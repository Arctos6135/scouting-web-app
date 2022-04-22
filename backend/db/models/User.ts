import * as crypto from 'crypto';
import { Scout } from './Scouting';
import { Team as TeamSchema, RegisterResult } from 'shared/dataClasses/Team';
import { VerificationCode as VerificationCodeSchema } from 'shared/dataClasses/VerificationCode';
import { Collection } from 'mongodb';

export class Team {
	static collection: Collection<TeamSchema>;
	static validate(team: unknown): team is TeamSchema {
		try {
			TeamSchema.parse(team);
			return true;
		}
		catch (e) {
			return false;
		}
	}
	public static async verify(team: TeamSchema, password: string): Promise<boolean> {
		if (team.verified) return true;
		const code = VerificationCode.getUserCode(team.email);

		// TODO: Send verification email
		// For now we can just verify manually
		return true;
	}

	public static async hasUser(email: string): Promise<boolean> {
		return await this.collection.count({ $or: [{ email }] }) == 1;
	}

	public static async register(email: string, password: string, name: string): Promise<RegisterResult> {
		if (await Team.hasUser(email)) return RegisterResult.EmailTaken;
		try {
			const user = TeamSchema.parse({
				email, teamName: name
			});
			if (!(this.collection.insertOne(user))) return RegisterResult.Invalid;
			await Scout.register(email, password, user.teamID, 'admin');
			await Scout.collection.findOneAndUpdate({email, team: user.teamID}, { $set: { admin: true } });
			// TODO: Potentially handle errors by deleting the team
			// If for some reason the admin user is not created then the team is inaccessible
		} 
		catch (e) {
			console.log(e);
			return RegisterResult.Invalid;
		}
		return RegisterResult.Successful;
	}
}

export class VerificationCode {
	static collection: Collection<VerificationCodeSchema>;
	static validate(team: unknown): team is VerificationCodeSchema {
		try {
			VerificationCodeSchema.parse(team);
			return true;
		}
		catch (e) {
			return false;
		}
	}
	public static async getUserCode(email: string) {
		let code: VerificationCodeSchema | null = await this.collection.findOne({ email });
		if (!code) {
			code = VerificationCodeSchema.parse({ code: crypto.randomBytes(128).toString('base64'), email });
			await this.collection.insertOne(code);
		}

		return code.code;
	}
}