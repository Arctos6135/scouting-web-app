import { prop } from '@typegoose/typegoose';
import { email } from './util';

export default class VerificationCodeClass {
	@prop(email)
	public email: string;

	@prop()
	public code: string;
	@prop({
		expires: '24h',
		default: Date.now
	})
	public createdAt: Date;
}
