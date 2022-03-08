import {buildSchema, getModelForClass} from '@typegoose/typegoose';
import FormClass from '../../../shared/dataClasses/FormClass'; 

export const FormModel = getModelForClass(FormClass);
export const FormSchema = buildSchema(FormClass);
