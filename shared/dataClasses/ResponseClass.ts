import { prop } from '@typegoose/typegoose';
import * as crypto from 'crypto';

export default class ResponseClass {
	@prop({ required: true }) 
	public org: string;
	@prop({ required: true }) 
	public scout: string;
	@prop({ required: true }) 
	public form: string;
	@prop({ required: true }) 
	public data: {[key: string]: number | string};

	@prop({ required: true }) 
	public name: string;
	@prop({ required: true, unique: true, default: () => crypto.randomUUID() }) 
	public id: string;
}
