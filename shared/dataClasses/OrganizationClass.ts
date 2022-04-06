import { prop} from '@typegoose/typegoose';
import { email } from './util';
import uniqueID from '../uniqueId';

export enum RegisterResult {
	Successful,
	EmailTaken,
	Invalid,
	LoginTaken
}
export default class OrganizationClass {
	@prop({
		...email,
		required: true
	})
	public email: string;

	@prop()
	public orgName?: string;

	@prop({
		default: () => false
	})
	public verified: boolean;

	@prop({ required: true, default: () => uniqueID() })
	public orgID: string;
}
