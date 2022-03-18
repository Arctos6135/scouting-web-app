import { prop } from '@typegoose/typegoose';
import FormComponent from './FormComponent';

class Num extends FormComponent {
	@prop()
	readonly type = 'num';
	@prop() min: number;
	@prop() max: number;

	@prop() default?: string;
}

export default Num;
