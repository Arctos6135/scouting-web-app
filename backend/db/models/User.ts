import * as crypto from 'crypto';
import { Scout } from './Scouting';
import { Team as TeamSchema, RegisterResult } from 'shared/dataClasses/Team';
import { VerificationCode as VerificationCodeSchema } from 'shared/dataClasses/VerificationCode';
import { Collection } from 'mongodb';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
});

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
	public static async sendVerificationEmail(team: TeamSchema): Promise<void> {
		if (team.verified) return;
		const code = await VerificationCode.getUserCode(team.email);

		await transporter.sendMail({
			to: team.email,
			from: process.env.EMAIL_ADDRESS,
			subject: 'Scouting App email verification',
			html: `This email has been registered with the arctos scouting app. Your verification link is 
				<a href="${process.env.ADDRESS}/verify/${code}">${process.env.ADDRESS}/verify/${code}</a>`
		});
	}

	public static async verify(code: string): Promise<boolean> {
		const row = await VerificationCode.collection.findOne({code});
		if (!row) return false;
		await this.collection.findOneAndUpdate({email: row.email}, {$set: {verified: true}});
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
			// TODO: Potentially handle errors by deleting the team
			// If for some reason the admin user is not created then the team is inaccessible
			await this.sendVerificationEmail(user);
			await Scout.register(email, password, user.teamID, 'admin');
			await Scout.collection.findOneAndUpdate({login: email, team: user.teamID}, { $set: { admin: true } });
		} 
		catch (e) {
			console.log(e);
			await this.collection.deleteOne({ email });
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
			code = VerificationCodeSchema.parse({ code: crypto.randomBytes(8).toString('hex'), email });
			await this.collection.insertOne(code);
		}

		return code.code;
	}
}