import { prop } from '@typegoose/typegoose';
import FormComponent from './FormComponent';

class Picker extends FormComponent {
	@prop()
	readonly type = 'picker';
	@prop({
		minlength: 1,
		maxlength: 50
	}) options: string[];
	@prop() default?: string;

	static serialize(data: string, previous: bigint, picker: Picker): bigint {
		if (!picker.options.includes(data)) throw new TypeError('Invalid choice');
		return previous * BigInt(picker.options.length) + BigInt(picker.options.indexOf(data))
	}

	static deserialize(data: bigint, picker: Picker): { data: string, remaining: bigint } {
		return {
			data: picker.options[Number(data%BigInt(picker.options.length))],
			remaining: data/BigInt(picker.options.length)
		}
	}
}

export default Picker;
