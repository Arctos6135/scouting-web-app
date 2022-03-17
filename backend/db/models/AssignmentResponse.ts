import {buildSchema, getModelForClass, index} from '@typegoose/typegoose';
import AssignmentResponseClass from '../../../shared/dataClasses/AssignmentResponseClass'; 

@index({ org: 1, scout: 1, assignment: 1 }, { unique: true })
class AssignmentResponse extends AssignmentResponseClass {}

export const AssignmentResponseModel = getModelForClass(AssignmentResponse);
export const AssignmentResponseSchema = buildSchema(AssignmentResponse);
