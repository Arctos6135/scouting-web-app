import { z } from 'zod';

export const Picker = z.object({
	type: z.literal('picker'),
	options: z.array(z.string()).min(1).max(50),
	default: z.string().optional(),
	valueID: z.string()
});
export type Picker = z.infer<typeof Picker>;

export function serialize(data: string, previous: bigint, picker: Picker): bigint {
	if (!picker.options.includes(data)) throw new TypeError('Invalid choice');
	return previous * BigInt(picker.options.length) + BigInt(picker.options.indexOf(data));
}

export function deserialize(data: bigint, picker: Picker): { data: string, remaining: bigint } {
	return {
		data: picker.options[Number(data%BigInt(picker.options.length))],
		remaining: data/BigInt(picker.options.length)
	};
}

export function getSchema(picker: Picker) {
	const out = z.string().refine(val => picker.options.includes(val));
	if (picker.default) return out.default(picker.default);
	return out;
}