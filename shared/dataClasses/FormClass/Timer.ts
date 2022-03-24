import { prop } from '@typegoose/typegoose';
import FormComponent from './FormComponent';
import Num from './Number';

class Timer extends FormComponent {
	@prop()
	readonly type = 'timer';
	@prop() max: number;

	static serialize(data: number, previous: bigint, timer: Timer): bigint {
		const max = timer.max/100;
		const intVal = Math.round(data/100);
		return previous * BigInt(max) + BigInt(intVal);
	}

	static deserialize(data: bigint, timer: Timer): { data: number, remaining: bigint } {
		const max = timer.max/100;
		const intVal = data%BigInt(max);
		const val = (Number(intVal))*100;
		return {
			data: val,
			remaining: data/BigInt(max)
		};
	}
}   

export default Timer;