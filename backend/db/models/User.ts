import { prop, getModelForClass, DocumentType, ReturnModelType, pre } from '@typegoose/typegoose';
import { promisify } from 'util';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {Scout} from './Scouting';

export const email = {
	unique: true,
	validate: {
		validator: (s: string) => /^.+@.+\..{1,5}$/.test(s),
		message: 'value must be email'
	},
	maxlength: 100,
	minlength: 3
};

export enum RegisterResult {
	Successful,
	EmailTaken,
	Invalid,
	PinTaken
};

@pre<OrganizationClass>('save', async function() {
	if (this.orgID == null) this.orgID = (await promisify(crypto.randomBytes)(24)).toString('base64').replace(/[/]/g, '-');
})
export class OrganizationClass {
	@prop(email)
	public email: string;

	@prop()
	public orgName?: string;

	@prop({
		default: () => false
	})
	public verified: boolean;

	@prop()
	orgID: string;

	public async verify(this: DocumentType<OrganizationClass>, password: string): Promise<boolean> {
		if (this.verified) return true;
		const code = VerificationCode.getUserCode(this.email);

		// TODO: Send verification email
		// For now we can just verify manually
		await this.save();
		return true;
	}

	public static async hasUser(this: ReturnModelType<typeof OrganizationClass>, email: string): Promise<boolean> {
		return await Organization.count({ $or: [{ email }] }).exec() == 1;
	}

	public static async register(this: ReturnModelType<typeof OrganizationClass>, email: string, password: string): Promise<RegisterResult> {
		if (await Organization.hasUser(email)) return RegisterResult.EmailTaken;
		const passwordHash = await bcrypt.hash(password, 12);
		const user = new Organization({
			email
		});
		try {
			if (!(await user.save())) return RegisterResult.Invalid;
			await Scout.register(email, password, user.orgID, 'admin');
			await Scout.updateOne({email, org: user.orgID}, { admin: true }).exec();
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

export class VerificationCodeClass {
	@prop(email)
	public email: string;

	@prop()
	public code: string
	@prop({
		expires: "24h",
		default: Date.now
	})
	public createdAt: Date;

	public static async getUserCode(this: ReturnModelType<typeof VerificationCodeClass>, email: string) {
		let code = await this.findOne({ email }).exec();
		if (!code) {
			code = new VerificationCode({ code: crypto.randomBytes(128).toString('base64'), email });
			code.save();
		}

		return code.code;
	}
}

export const Organization = getModelForClass(OrganizationClass);
export const VerificationCode = getModelForClass(VerificationCodeClass);
