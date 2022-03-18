import { prop, getModelForClass, DocumentType, ReturnModelType, pre } from '@typegoose/typegoose';
import { promisify } from 'util';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {ScoutModel} from './Scouting';
import OrganizationClass, { RegisterResult } from '@scouting-app/shared/dataClasses/OrganizationClass';
import VerificationCodeClass from '@scouting-app/shared/dataClasses/VerificationCodeClass';

@pre<Organization>('save', async function() {
	// Default initialize orgID to 24 random bytes
	// This should be more than enough to prevent collisions
	if (this.orgID == null) this.orgID = (await promisify(crypto.randomBytes)(24)).toString('base64').replace(/[/]/g, '-');
})
export class Organization extends OrganizationClass {
	public async verify(this: DocumentType<Organization>, password: string): Promise<boolean> {
		if (this.verified) return true;
		const code = VerificationCodeModel.getUserCode(this.email);

		// TODO: Send verification email
		// For now we can just verify manually
		await this.save();
		return true;
	}

	public static async hasUser(this: ReturnModelType<typeof Organization>, email: string): Promise<boolean> {
		return await OrganizationModel.count({ $or: [{ email }] }).exec() == 1;
	}

	public static async register(this: ReturnModelType<typeof Organization>, email: string, password: string, name: string): Promise<RegisterResult> {
		if (await OrganizationModel.hasUser(email)) return RegisterResult.EmailTaken;
		const user = new OrganizationModel({
			email, orgName: name
		});
		try {
			if (!(await user.save())) return RegisterResult.Invalid;
			await ScoutModel.register(email, password, user.orgID, 'admin');
			await ScoutModel.updateOne({email, org: user.orgID}, { admin: true }).exec();
			// TODO: Potentially handle errors by deleting the org
			// If for some reason the admin user is not created then the org is inaccessible
		} 
		catch (e) {
			console.log(e);
			return RegisterResult.Invalid;
		}
		return RegisterResult.Successful;
	}
}

export class VerificationCode extends VerificationCodeClass{
	public static async getUserCode(this: ReturnModelType<typeof VerificationCode>, email: string) {
		let code = await this.findOne({ email }).exec();
		if (!code) {
			code = new VerificationCodeModel({ code: crypto.randomBytes(128).toString('base64'), email });
			code.save();
		}

		return code.code;
	}
}

export const OrganizationModel = getModelForClass(Organization);
export const VerificationCodeModel = getModelForClass(VerificationCode);
