//import * as mongoose from 'mongoose';
import * as users from './models/User';
import * as scouting from './models/Scouting';

export default {
	Organization: users.Organization,
	VerificationCode: users.VerificationCode,
	Scout: scouting.Scout
}
