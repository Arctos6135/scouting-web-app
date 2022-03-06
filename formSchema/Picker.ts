import { prop, getModelForClass, DocumentType, ReturnModelType } from '@typegoose/typegoose';
import FormComponent from './FormComponent';

class Picker extends FormComponent {
	@prop()
	readonly type = 'picker';
	@prop({
		minlength: 1,
		maxlength: 50
	})
		options: string[];
	@prop()
		default?: string;
}

export default Picker;
