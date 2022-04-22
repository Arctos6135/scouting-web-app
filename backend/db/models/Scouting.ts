import { Team } from './User';
import { LoginResult, Scout as ScoutSchema } from 'shared/dataClasses/Scout';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import { RegisterResult } from 'shared/dataClasses/Team';
import { Collection } from 'mongodb';

export class Scout {
	public static collection: Collection<ScoutSchema>;
	public static validate(data: unknown): data is ScoutSchema {
		try {
			ScoutSchema.parse(data);
			return true;
		}
		catch (e) {
			return false;
		}
	}
	public static async updatePassword(scout: ScoutSchema, newPassword: string): Promise<boolean> {
		const old = _.cloneDeep(scout);
		const updated = _.cloneDeep(scout);
		updated.passwordHash = await bcrypt.hash(newPassword, 10);
		await this.collection.findOneAndUpdate(old, { $set: updated });
		return true;
	}

	public static async login(teamID: string, login: string, password: string): Promise<LoginResult> {
		const team = await Team.collection.findOne({ teamID });
		if (!team) {
			return LoginResult.NoOrg;
		}
		if (!team.verified) return LoginResult.Unverified;
		const user = await this.collection.findOne({ login, team: teamID });

		if (!user) return LoginResult.NoUser;

		if (await bcrypt.compare(password, user.passwordHash)) return LoginResult.Successful;
		else {
			return LoginResult.WrongPassword;
		}
	}

	public static async register(login: string, password: string, team: string, name: string): Promise<RegisterResult> {
		if (await this.collection.count({ login, team }) > 0) return RegisterResult.LoginTaken;
		const passwordHash = await bcrypt.hash(password, 10);
		const user = ScoutSchema.parse({
			name, passwordHash, login, team
		});
		try {
			if (!(await this.collection.insertOne(user))) return RegisterResult.Invalid;
		} 
		catch (e) {
			console.error(e);
			return RegisterResult.Invalid;
		}
		return RegisterResult.Successful;
	}
}