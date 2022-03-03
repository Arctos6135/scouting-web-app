import { prop, getModelForClass, DocumentType, ReturnModelType, Ref } from '@typegoose/typegoose';
import FormComponent from './FormComponent';
import Num from './Number';
import Picker from './Picker';
import Text from './Text';

type Component = Num | Picker | Text;
export class Row {
	readonly type: string = 'row';
	components: Group[];
}

export class Group {
	readonly type: string = 'group';
	label: string;
	component: Component;
	description?: string;
};

export class Section {
	readonly type: string = 'section';
	header?: string;
	groups: (Group | Row)[];
};

export default class Form {
	@prop()
	sections: Section[];

	@prop()
	// orgID
	ownerOrgID: string;

	@prop()
	name: string
};
