import {buildSchema, getModelForClass, pre} from '@typegoose/typegoose';
import AssignmentClass from '../../../shared/dataClasses/AssignmentClass'; 
import {promisify} from 'util';
import * as crypto from 'crypto';

@pre<Assignment>('save', async function() {
	// Default initialize orgID to 24 random bytes
	// This should be more than enough to prevent collisions
	if (!this.id) this.id = (await promisify(crypto.randomBytes)(24)).toString('base64').replace(/[/]/g, '-');
})
class Assignment extends AssignmentClass {}

export const AssignmentModel = getModelForClass(Assignment);
export const AssignmentSchema = buildSchema(Assignment);
