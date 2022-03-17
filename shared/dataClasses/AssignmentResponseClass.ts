import { prop } from '@typegoose/typegoose';

export default class AssignmentResponseClass {
	@prop({ required: true }) 
	public org!: string;
	@prop({ required: true }) 
	public scout!: string;
	@prop({ required: true }) 
	public assignment!: string;
	@prop({ required: true }) 
	public data!: {[key: string]: number | string};
}
