import { prop, getModelForClass, DocumentType, ReturnModelType } from '@typegoose/typegoose';
import FormComponent from './FormComponent';

class Text extends FormComponent {
	@prop()
	readonly type = 'text';
	@prop() minlength?: number;
	@prop({
		max: 10000
	}) maxlength?: number;

	@prop() password?: boolean;

	@prop({
		validate: ((charset: string) => (new Set(charset)).size == charset.length)
	}) charset?: string;
}

export default Text;

