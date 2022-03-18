import { getModelForClass, DocumentType, ReturnModelType, buildSchema } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { RegisterResult } from '../../../shared/dataClasses/OrganizationClass';
import ScoutClass, { LoginResult } from '../../../shared/dataClasses/ScoutClass';
import { OrganizationModel } from './User';

export class Scout extends ScoutClass {
	public async updatePassword(this: DocumentType<Scout>, newPassword: string): Promise<boolean> {
		this.passwordHash = await bcrypt.hash(newPassword, 10);
		await this.save();
		return true;
	}

	public static async login(this: ReturnModelType<typeof Scout>, org: string, login: string, password: string): Promise<LoginResult> {
		const organization = await OrganizationModel.findOne({ orgID: org }).exec();
		if (!organization) return LoginResult.NoOrg;
		if (!organization.verified) return LoginResult.Unverified;
		const user = await ScoutModel.findOne({ login: login, org }).exec();

		if (!user) return LoginResult.NoUser;

		if (await bcrypt.compare(password, user.passwordHash)) return LoginResult.Successful;
		else {
			return LoginResult.WrongPassword;
		}
	}

	public static async register(this: ReturnModelType<typeof Scout>, login: string, password: string, org: string, name: string): Promise<RegisterResult> {
		if (await ScoutModel.count({ login, org }).exec() > 0) return RegisterResult.LoginTaken;
		const passwordHash = await bcrypt.hash(password, 10);
		const user = new ScoutModel({
			name, passwordHash, login, org
		});
		try {
			if (!(await user.save())) return RegisterResult.Invalid;
		} 
		catch (e) {
			console.log(e);
			return RegisterResult.Invalid;
		}
		return RegisterResult.Successful;
	}
}


export const ScoutModel = getModelForClass(Scout);
export const ScoutSchema = buildSchema(Scout);
