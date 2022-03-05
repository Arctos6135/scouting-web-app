//import * as mongoose from 'mongoose';
import * as users from './models/User';
import * as scouting from './models/Scouting';
import * as forms from './models/Form';

export default {
	Organization: users.Organization,
	VerificationCode: users.VerificationCode,
	Scout: scouting.Scout,
	Form: forms.Form
}
