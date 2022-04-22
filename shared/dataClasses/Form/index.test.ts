import { z } from 'zod';
import { serialize, deserialize, Section } from '.';

test('form serialize', () => {
	const testSchema = z.array(Section).parse([ { 'type': 'section', 'groups': [ { 'type': 'row', 'components': [ { 'type': 'group', 'label': '', 'component': { 'min': 0, 'max': 10, 'increment': 0.01, 'type': 'num', 'valueID': 'a' } }, { 'type': 'group', 'label': '', 'component': { 'min': 0, 'increment': 1, 'max': 10, 'type': 'num', 'valueID': 'b' } }, { 'type': 'group', 'label': '', 'component': { 'type': 'text', 'valueID': 'c', 'charset': 'xyz', 'maxlength': 5 } } ] }, { 'type': 'group', 'label': '', 'component': { 'options': [ 'x', 'y', 'z' ], 'type': 'picker', 'valueID': 'd' } }, { 'type': 'group', 'label': '', 'component': { 'type': 'text', 'valueID': 'e', 'charset': 'xyz', 'maxlength': 20 } },{ 'type': 'group', 'label': '', 'component': { 'max': 30000, 'type': 'timer', 'valueID': 'f' } }, { 'type': 'group', 'label': '', 'component': { 'falseLabel': 'No', 'trueLabel': 'Yes', 'type': 'toggle', 'valueID': 'g' }}  ] }  ]);
	const data = {
		'a': 3.05,
		'b': 8,
		'c': 'xxxy',
		'd': 'y',
		'e': 'yyxxz',
		'f': 25000,
		'g': 1
	};
	const serialized = deserialize(serialize(data, testSchema), testSchema);

	/* @ts-ignore */
	for (const i in data) if (typeof data[i] == 'number') data[i] = expect.closeTo(data[i]);
	expect(serialized).toEqual(data);
});
