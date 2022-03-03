import {prop} from "@typegoose/typegoose";

export default abstract class FormComponent {
	abstract readonly type: string;
	@prop({
		unique: true
	})
	readonly valueID: string;
};
