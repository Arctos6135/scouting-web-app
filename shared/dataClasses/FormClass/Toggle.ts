import { prop } from '@typegoose/typegoose';
import FormComponent from './FormComponent';

class Toggle extends FormComponent {
	@prop()
	readonly type = 'toggle';

	@prop() falseLabel: string;
	@prop() trueLabel: string;

	static serialize(data: number, previous: bigint, toggle: Toggle): bigint {
		return previous * BigInt(2) + BigInt(data);
	}

	static deserialize(data: bigint, toggle: Toggle): { data: number, remaining: bigint } {
		return {
			data: Number(data%BigInt(2)),
			remaining: data/BigInt(2)
		};
	}
}

export default Toggle;
