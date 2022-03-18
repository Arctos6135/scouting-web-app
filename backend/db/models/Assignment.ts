import {buildSchema, getModelForClass, pre} from '@typegoose/typegoose';
import AssignmentClass from '../../../shared/dataClasses/AssignmentClass'; 
import {promisify} from 'util';
import * as crypto from 'crypto';

class Assignment extends AssignmentClass {}

export const AssignmentModel = getModelForClass(Assignment);
export const AssignmentSchema = buildSchema(Assignment);
