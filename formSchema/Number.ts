import { prop, getModelForClass, DocumentType, ReturnModelType } from '@typegoose/typegoose';
import FormComponent from './FormComponent';

export enum NumTypes {
	slide, click, default
};

class Num extends FormComponent {
	@prop()
	readonly type = 'num';
	@prop()
	min: Num
	@prop()
	max: Num

	@prop()
	numType: NumTypes;

	@prop()
	default?: string;
}

export default Num;

