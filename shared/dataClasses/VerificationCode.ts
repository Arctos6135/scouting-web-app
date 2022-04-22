import { z } from 'zod';

export const VerificationCode = z.object({
	email: z.string().email(),
	code: z.string(),
	createdAt: z.date()
});

export type VerificationCode = z.infer<typeof VerificationCode>;