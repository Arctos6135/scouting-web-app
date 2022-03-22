import { prop } from '@typegoose/typegoose';
import FormComponent from './FormComponent';

class Timer extends FormComponent {
	@prop()
	readonly type = 'timer';
}   

export default Timer;