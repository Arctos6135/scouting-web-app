import {buildSchema, getModelForClass, index} from '@typegoose/typegoose';
import ResponseClass from '../../../shared/dataClasses/ResponseClass'; 

class Response extends ResponseClass {}

export const ResponseModel = getModelForClass(Response);
export const ResponseSchema = buildSchema(Response);
