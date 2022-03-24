import {prop} from '@typegoose/typegoose';
import FormComponent from './FormComponent';

class Num extends FormComponent {
	@prop()
	readonly type = 'num';
	
	@prop() min: number;
	@prop() max: number;
	@prop() increment: number;

	@prop() default?: string;

	static serialize(data: number, previous: bigint, num: Num): bigint {
		const min = num.min/num.increment;
		const max = num.max/num.increment;
		const intVal = Math.round((data-min)/num.increment);
		console.log(intVal, max, min);
		return previous * BigInt(max-min) + BigInt(intVal)
	}

	static deserialize(data: bigint, num: Num): { data: number, remaining: bigint } {
		const min = num.min/num.increment;
		const max = num.max/num.increment;
		const intVal = data%BigInt(max-min);
		const val = (Number(intVal)+min)*num.increment;
		console.log(intVal, max, min);
		return {
			data: val,
			remaining: data/BigInt(max-min)
		}
	}
}

export default Num;
