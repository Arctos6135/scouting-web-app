import {prop} from '@typegoose/typegoose';
import assert from 'assert';
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

	static serialize(data: string, previous: bigint, text: Text): bigint {
		assert(data.length <= text.maxlength);
		let charmap = {};
		for (let i = 0; i < text.charset.length; i++) {
			charmap[text.charset[i]] = BigInt(i);
		}
		for (let i = 0; i < data.length; i++) {
			previous *= BigInt(text.charset.length);
			previous += charmap[data[i]];
			if (!(data[i] in charmap)) throw new TypeError(`Invalid character ${data[i]}`);
		}
		previous *= BigInt(text.maxlength);
		previous += BigInt(data.length);
		return previous;
	}

	static deserialize(data: bigint, text: Text): { data: string, remaining: bigint } {
		let length = data % BigInt(text.maxlength);
		data /= BigInt(text.maxlength);
		let out = '';
		for (let i = 0n; i < length; i++) {
			out += text.charset[Number(data % BigInt(text.charset.length))];
			data /= BigInt(text.charset.length);
		}
		out = out.split('').reverse().join('');
		return { data: out, remaining: data };
	}
}

export default Text;

