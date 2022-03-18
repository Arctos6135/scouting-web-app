//import * as mongoose from 'mongoose';
import * as users from './models/User';
import { ScoutModel } from './models/Scouting';
import { FormModel } from './models/Form';
import { AssignmentResponseModel } from './models/AssignmentResponse';
import { AssignmentModel } from './models/Assignment';

const models = {
	Organization: users.OrganizationModel,
	VerificationCode: users.VerificationCodeModel,
	Scout: ScoutModel,
	Form: FormModel,
	Assignment: AssignmentModel,
	AssignmentResponse: AssignmentResponseModel
};

export default models;