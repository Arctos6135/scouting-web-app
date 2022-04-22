import uniqueID from '../uniqueId';
import { z } from 'zod';

export enum RegisterResult {
	Successful,
	EmailTaken,
	Invalid,
	LoginTaken
}

export const Team = z.object({
	email: z.string().email(),
	teamName: z.string(),
	verified: z.boolean().default(false),
	teamID: z.string().default(() => uniqueID())
});

export type Team = z.infer<typeof Team>