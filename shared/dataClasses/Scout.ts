import { z } from 'zod';

export enum LoginResult {
	Successful,
	WrongPassword,
	NoUser,
	Unverified,
	NoOrg
}

export const Scout = z.object({
	name: z.string(),
	login: z.string(),
	passwordHash: z.string(),
	team: z.string(),
	admin: z.boolean().default(false)
});

export type Scout = z.infer<typeof Scout>;