import { z } from 'zod';
import * as num from './Number';
import * as picker from './Picker';
import * as text from './Text';
import * as timer from './Timer';
import * as toggle from './Toggle';


export const Component = z.discriminatedUnion('type', [num.Num, picker.Picker, text.Text, timer.Timer, toggle.Toggle]);
export type Component = z.infer<typeof Component>;

export const Group = z.object({
	type: z.literal('group'),
	label: z.string(),
	component: Component,
	description: z.string().optional()
});
export type Group = z.infer<typeof Group>;

export const Row = z.object({
	type: z.literal('row'),
	components: z.array(Group)
});
export type Row = z.infer<typeof Row>;

export const Section = z.object({
	type: z.literal('section'),
	header: z.string().optional(),
	groups: z.array(z.discriminatedUnion('type', [Group, Row]))
});
export type Section = z.infer<typeof Section>;

export const constructorMap: {
	'num': typeof num;
	'picker': typeof picker;
	'text': typeof text;
	'timer': typeof timer;
	'toggle': typeof toggle;
} = {
	'num': num,
	'picker': picker,
	'text': text,
	'timer': timer,
	'toggle': toggle
};

export const formTypeMap = {
	'num': num.Num,
	'picker': picker.Picker,
	'text': text.Text,
	'timer': timer.Timer,
	'toggle': toggle.Toggle
} as const;

function extractGroups(schema: Section[]): Group[] {
	const groups: Group[] = [];
	const processGroup = (group: Group) => {
		groups.push(group);
	};

	const processRow = (row: Row) => {
		for (const g of row.components) processGroup(g);
	};

	const processSection = (section: Section) => {
		for (const g of section.groups) {
			if (g.type == 'group') processGroup(g);
			else if (g.type == 'row') processRow(g);
		}
	};

	for (const section of schema) processSection(section);

	return groups;
}

export function getSchema(sections: Section[]) {
	const groups = extractGroups(sections);
	const schema: {[key: string]: z.ZodType} = {};
	for (const g of groups) {
		schema[g.type] = constructorMap[g.component.type].getSchema(g.component as never);
	}
	return z.object(schema);
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

export const Form = z.object({
	sections: z.array(Section).default([]),
	ownerTeam: z.string(),
	id: z.string(),
	name: z.string().default('Form')
});

export type Form = z.infer<typeof Form>;