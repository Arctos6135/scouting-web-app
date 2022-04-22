import { Collection } from 'mongodb';
import { Form as FormSchema } from 'shared/dataClasses/Form';

export class Form {
	static collection: Collection<FormSchema>;
	static validate(data: unknown): data is FormSchema {
		try {
			FormSchema.parse(data);
			return true;
		}
		catch (e) {
			return false;
		}
	}
}