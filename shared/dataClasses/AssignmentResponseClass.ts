import { prop } from '@typegoose/typegoose';

export default class AssignmentResponseClass {
	@prop() name: string;
	@prop() scout: string;
	@prop() assignment: string;
	@prop() data: {[key: string]: number | string};
}