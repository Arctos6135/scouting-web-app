import {buildSchema, getModelForClass} from '@typegoose/typegoose';
import AssignmentResponseClass from '../../../shared/dataClasses/AssignmentResponseClass'; 

class AssignmentResponse extends AssignmentResponseClass {}

export const AssignmentResponseModel = getModelForClass(AssignmentResponse);
export const AssignmentResponseSchema = buildSchema(AssignmentResponse);
