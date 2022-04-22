import { z } from 'zod';

export const Timer = z.object({
	type: z.literal('timer'),
	max: z.number(),
	valueID: z.string()
});

export type Timer = z.infer<typeof Timer>

export function serialize(data: number, previous: bigint, timer: Timer): bigint {
	const max = timer.max/100;
	const intVal = Math.round(data/100);
	return previous * BigInt(max) + BigInt(intVal);
}

export function deserialize(data: bigint, timer: Timer): { data: number, remaining: bigint } {
	const max = timer.max/100;
	const intVal = data%BigInt(max);
	const val = (Number(intVal))*100;
	return {
		data: val,
		remaining: data/BigInt(max)
	};
}

export function getSchema(timer: Timer) {
	return z.number().max(timer.max);
}