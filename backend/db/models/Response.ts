import { Collection } from 'mongodb';
import { Response as ResponseSchema } from 'shared/dataClasses/Response';

export class Response {
	static collection: Collection<ResponseSchema>;
	static validate(data: unknown): data is ResponseSchema {
		try {
			ResponseSchema.parse(data);
			return true;
		}
		catch (e) {
			return false;
		}
	}
}