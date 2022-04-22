import { z } from 'zod';
import uniqueID from '../uniqueId';
import { Section, getSchema } from './Form';

export const Response = z.object({
	team: z.string(),
	scout: z.string(),
	form: z.string(),
	// override this for responses
	data: z.record(z.string(), z.union([z.string(), z.number()])),
	name: z.string(),
	id: z.string().default(() => uniqueID())
});

export function responseSchema(sections: Section[]) {
	return Response.extend({
		data: getSchema(sections)
	});
}

export type Response = z.infer<typeof Response>;