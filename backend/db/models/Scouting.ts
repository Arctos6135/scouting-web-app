import { prop, getModelForClass, DocumentType, ReturnModelType, buildSchema } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import {RegisterResult, Organization} from './User';

export enum LoginResult {
	Successful,
	WrongPassword,
	NoUser,
	Unverified,
	NoOrg
}

export class ScoutClass {
	@prop()
		name: string;
	@prop()
		login: string;
	@prop()
		passwordHash: string;
	@prop()
		org: string;
	@prop()
		admin: boolean;

	@prop({ default: 0 })
		connections: number;

	public async updatePassword(this: DocumentType<ScoutClass>, newPassword: string): Promise<boolean> {
		this.passwordHash = await bcrypt.hash(newPassword, 10);
		await this.save();
		return true;
	}

	public static async login(this: ReturnModelType<typeof ScoutClass>, org: string, login: string, password: string): Promise<LoginResult> {
		const organization = await Organization.findOne({ orgID: org }).exec();
		if (!organization) return LoginResult.NoOrg;
		if (!organization.verified) return LoginResult.Unverified;
		const user = await Scout.findOne({ login: login, org }).exec();

		if (!user) return LoginResult.NoUser;

		if (await bcrypt.compare(password, user.passwordHash)) return LoginResult.Successful;
		else {
			return LoginResult.WrongPassword;
		}
	}

	public static async register(this: ReturnModelType<typeof ScoutClass>, login: string, password: string, org: string, name: string): Promise<RegisterResult> {
		if (await Scout.count({ login, org }).exec() > 0) return RegisterResult.LoginTaken;
		const passwordHash = await bcrypt.hash(password, 10);
		const user = new Scout({
			name, passwordHash, login, org
		});
		try {
			if (!(await user.save())) return RegisterResult.Invalid;
		} 
		catch (e) {
			return RegisterResult.Invalid;
		}
		return RegisterResult.Successful;
	}
}


export const Scout = getModelForClass(ScoutClass);
export const ScoutSchema = buildSchema(ScoutClass);
