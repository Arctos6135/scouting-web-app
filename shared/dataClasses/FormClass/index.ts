import { prop } from '@typegoose/typegoose';
import Num from './Number';
import Picker from './Picker';
import Text from './Text';
import Timer from './Timer';

type Component = Num | Picker | Text | Timer;
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
