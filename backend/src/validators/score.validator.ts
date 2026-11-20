import { z } from 'zod';

export const sbdParamSchema = z.object({
  sbd: z
    .string()
    .trim()
    .regex(/^\d{8}$/, 'Registration number must be exactly 8 digits (e.g., 01000001).'),
});

export type SbdParamInput = z.infer<typeof sbdParamSchema>;
