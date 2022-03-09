//import * as mongoose from 'mongoose';
import * as users from './models/User';
import * as scouting from './models/Scouting';
import * as forms from './models/Form';
import * as games from './models/Assignment';

const models = {
	Organization: users.OrganizationModel,
	VerificationCode: users.VerificationCodeModel,
	Scout: scouting.ScoutModel,
	Form: forms.FormModel,
	Assignment: games.AssignmentModel
};

export default models;