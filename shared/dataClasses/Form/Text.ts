import { z } from 'zod';

export const Text = z.object({
	type: z.literal('text'),
	maxlength: z.number().max(10000).min(0),
	password: z.boolean().default(false),
	default: z.string().optional(),
	charset: z.string().refine(s => /* All characters are unique */ (new Set(s)).size == s.length),
	valueID: z.string()
});
export type Text = z.infer<typeof Text>;
export function serialize(data: string, previous: bigint, text: Text): bigint {
	const charmap: { [key: string]: bigint } = {};
	for (let i = 0; i < text.charset.length; i++) {
		charmap[text.charset[i]] = BigInt(i);
	}
	for (let i = 0; i < data.length; i++) {
		previous *= BigInt(text.charset.length);
		previous += charmap[data[i]];
		if (!(data[i] in charmap)) throw new TypeError(`Invalid character ${data[i]}`);
	}
	previous *= BigInt(text.maxlength);
	previous += BigInt(data.length);
	return previous;
}

export function deserialize(data: bigint, text: Text): { data: string, remaining: bigint } {
	const length = data % BigInt(text.maxlength);
	data /= BigInt(text.maxlength);
	let out = '';
	for (let i = 0n; i < length; i++) {
		out += text.charset[Number(data % BigInt(text.charset.length))];
		data /= BigInt(text.charset.length);
	}
	out = out.split('').reverse().join('');
	return { data: out, remaining: data };
}

export function getSchema(text: Text) {
	const out = z.string().max(text.maxlength)
		.refine(s => Array.from(s).every(c => text.charset.includes(c)));
	if (text.default) return out.default(text.default);
	return out;
}