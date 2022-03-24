import { serialize, deserialize, Section } from '.';

test('form serialize', () => {
	const testSchema: Section[] = [ { 'type': 'section', 'groups': [ { 'type': 'row', 'components': [ { 'type': 'group', 'label': '', 'component': { 'min': 0, 'max': 10, 'increment': 0.01, 'type': 'num', 'valueID': 'a' } }, { 'type': 'group', 'label': '', 'component': { 'min': 0, 'increment': 1, 'max': 10, 'type': 'num', 'valueID': 'b' } }, { 'type': 'group', 'label': '', 'component': { 'type': 'text', 'valueID': 'c', 'charset': 'xyz', 'minlength': 0, 'maxlength': 5 } } ] }, { 'type': 'group', 'label': '', 'component': { 'options': [ 'x', 'y', 'z' ], 'type': 'picker', 'valueID': 'd' } }, { 'type': 'group', 'label': '', 'component': { 'type': 'text', 'valueID': 'e', 'charset': 'xyz', 'maxlength': 20 } },{ 'type': 'group', 'label': '', 'component': { 'max': 30000, 'type': 'timer', 'valueID': 'f' } }  ] } ];
	const data = {
		'a': 3.05,
		'b': 8,
		'c': 'xxxy',
		'd': 'y',
		'e': 'yyxxz',
		'f': 25000
	};
	const serialized = deserialize(serialize(data, testSchema), testSchema);

	for (let i in data) if (typeof data[i] == 'number') data[i] = (expect as any).closeTo(data[i]);
	expect(serialized).toEqual(data);
});
