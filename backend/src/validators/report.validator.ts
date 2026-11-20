import { z } from 'zod';

export const topGroupAQuerySchema = z.object({
  limit: z.preprocess(
    (value) => (value === undefined || value === '' ? undefined : value),
    z.coerce
      .number({ invalid_type_error: 'Limit must be an integer between 1 and 50.' })
      .int('Limit must be an integer between 1 and 50.')
      .min(1, 'Limit must be at least 1.')
      .max(50, 'Limit must not exceed 50.')
      .default(10),
  ),
});

export type TopGroupAQueryInput = z.infer<typeof topGroupAQuerySchema>;
