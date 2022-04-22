import { z } from 'zod';

export const Toggle = z.object({
	type: z.literal('toggle'),
	falseLabel: z.string(),
	trueLabel: z.string(),
	valueID: z.string()
});
export type Toggle = z.infer<typeof Toggle>;

export function serialize(data: number, previous: bigint, toggle: Toggle): bigint {
	return previous * BigInt(2) + BigInt(data);
}

export function deserialize(data: bigint, toggle: Toggle): { data: number, remaining: bigint } {
	return {
		data: Number(data%BigInt(2)),
		remaining: data/BigInt(2)
	};
}

export function getSchema(toggle: Toggle) {
	return z.boolean().default(false);
}

export default Toggle;
