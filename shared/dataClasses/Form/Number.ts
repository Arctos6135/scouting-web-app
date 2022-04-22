import { z } from 'zod';

export const Num = z.object({
	type: z.literal('num'),
	min: z.number().default(0),
	max: z.number().default(0),
	increment: z.number().default(1),
	default: z.number().optional(),
	valueID: z.string()
});

export type Num = z.infer<typeof Num>;
export function serialize(data: number, previous: bigint, num: Num): bigint {
	const min = num.min/num.increment;
	const max = num.max/num.increment;
	const intVal = Math.round((data-min)/num.increment);
	return previous * BigInt(max-min) + BigInt(intVal);
}

export function deserialize(data: bigint, num: Num): { data: number, remaining: bigint } {
	const min = num.min/num.increment;
	const max = num.max/num.increment;
	const intVal = data%BigInt(max-min);
	const val = (Number(intVal)+min)*num.increment;
	console.log(intVal, max, min);
	return {
		data: val,
		remaining: data/BigInt(max-min)
	};
}

export function getSchema(num: Num) {
	const out = z.number().min(num.min).max(num.max).multipleOf(num.increment);
	if (num.default) return out.default(num.default);
	return out;
}