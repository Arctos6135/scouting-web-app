//import * as mongoose from 'mongoose';
import * as users from './models/User';
import { ScoutModel } from './models/Scouting';
import { FormModel } from './models/Form';
import { ResponseModel } from './models/Response';

const models = {
	Organization: users.OrganizationModel,
	VerificationCode: users.VerificationCodeModel,
	Scout: ScoutModel,
	Form: FormModel,
	Response: ResponseModel
};

export default models;