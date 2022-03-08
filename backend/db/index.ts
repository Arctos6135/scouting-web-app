//import * as mongoose from 'mongoose';
import * as users from './models/User';
import * as scouting from './models/Scouting';
import * as forms from './models/Form';

const models = {
	Organization: users.OrganizationModel,
	VerificationCode: users.VerificationCodeModel,
	Scout: scouting.ScoutModel,
	Form: forms.FormModel
};

export default models;