import {buildSchema, getModelForClass} from '@typegoose/typegoose';
import FormClass from '../../../formSchema/Form'; 

export const Form = getModelForClass(FormClass);
export const FormSchema = buildSchema(FormClass);
