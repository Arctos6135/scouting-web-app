import {buildSchema, getModelForClass, index} from '@typegoose/typegoose';
import ResponseClass from '../../../shared/dataClasses/ResponseClass'; 

@index({ org: 1, scout: 1, assignment: 1 }, { unique: true })
class Response extends ResponseClass {}

export const ResponseModel = getModelForClass(Response);
export const ResponseSchema = buildSchema(Response);
