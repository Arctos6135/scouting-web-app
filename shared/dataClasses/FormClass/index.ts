import { prop, getModelForClass, DocumentType, ReturnModelType, Ref } from '@typegoose/typegoose';
import FormComponent from './FormComponent';
import Num from './Number';
import Picker from './Picker';
import Text from './Text';

type Component = Num | Picker | Text;
export class Row {
	@prop()
	readonly type: string = 'row';
	@prop() components: Group[];
}

export class Group {
	@prop()
	readonly type: string = 'group';
	@prop() label: string;
	@prop() component: Component;
	@prop() description?: string;
}

export class Section {
	@prop()
	readonly type: string = 'section';
	@prop() header?: string;
	@prop() groups: (Group | Row)[];
}

export default class FormClass {
	@prop() sections: Section[];

	@prop() ownerOrg: string;

	@prop({
		unique: true,
		required: true
	}) id: string;

	@prop() name: string;
}
