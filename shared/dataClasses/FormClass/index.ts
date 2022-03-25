import {prop} from '@typegoose/typegoose';
import Num from './Number';
import Picker from './Picker';
import Text from './Text';
import Timer from './Timer';
import Toggle from './Toggle';

type Component = Num | Picker | Text | Timer | Toggle;
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

const constructorMap: {
	'num': typeof Num;
	'picker': typeof Picker;
	'text': typeof Text;
	'timer': typeof Timer;
	'toggle': typeof Toggle;
} = {
	'num': Num,
	'picker': Picker,
	'text': Text,
	'timer': Timer,
	'toggle': Toggle
};

function extractGroups(schema: Section[]): Group[] {
	const groups = [];
	const processGroup = (group: Group) => {
		groups.push(group);
	};

	const processRow = (row: Row) => {
		for (const g of row.components) processGroup(g);
	};

	const processSection = (section: Section) => {
		for (const g of section.groups) {
			if (g.type == 'group') processGroup(g as Group);
			else if (g.type == 'row') processRow(g as Row);
		}
	};

	for (const section of schema) processSection(section);

	return groups;
}

export function serialize(data: { [key: string]: number | string }, schema: Section[]) {
	let out = 0n;
	const processGroup = (group: Group) => {
		const constructor = constructorMap[group.component.type];
		out = constructor.serialize(data[group.component.valueID] as never, out, group.component as never);
	};

	extractGroups(schema).forEach(processGroup);
	return out;
}

export function deserialize(data: bigint, schema: Section[]) {
	const groups = extractGroups(schema);
	groups.reverse();
	const out: { [key: string]: number | string } = {};
	
	const processGroup = (group: Group) => {
		const constructor = constructorMap[group.component.type];
		const res = constructor.deserialize(data, group.component as never);
		out[group.component.valueID] = res.data;
		data = res.remaining;
	};

	groups.forEach(processGroup);

	return out;
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
