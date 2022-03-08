import { prop} from '@typegoose/typegoose';
import { email } from './util';

export enum RegisterResult {
	Successful,
	EmailTaken,
	Invalid,
	LoginTaken
}
export default class OrganizationClass {
	@prop(email)
	public email: string;

	@prop()
	public orgName?: string;

	@prop({
		default: () => false
	})
	public verified: boolean;

	@prop()
		orgID: string;
}