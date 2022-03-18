import { prop } from '@typegoose/typegoose';
import * as crypto from 'crypto';

export default class AssignmentClass {
	@prop({ required: true }) 
	public name: string;
	@prop({
		// Ensure each scout is only assigned once
		validate: ((scouts: string[]) => (new Set(scouts)).size == scouts.length),
		required: true
	}) scouts: string[];
    @prop() 
	public due?: string;
    @prop({ required: true, default: () => crypto.randomBytes(24).toString('hex') }) 
	public id: string;
	@prop({ required: true }) 
	public form: string;
}
