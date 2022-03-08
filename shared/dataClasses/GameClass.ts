import { prop, Ref } from '@typegoose/typegoose';
import FormClass from './FormClass';

export default class GameClass {
	@prop() name: string;
	@prop() form: Ref<FormClass>;
	@prop() org: string;
}