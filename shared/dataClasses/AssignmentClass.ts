import { prop } from '@typegoose/typegoose';

export default class AssignmentClass {
	@prop() name: string;
	@prop({
		// Ensure each scout is only assigned once
		validate: ((scouts: string[]) => (new Set(scouts)).size == scouts.length)
	}) scouts: string[];
    @prop() due?: string;
    @prop() id: string;
	@prop() form: string;
}
