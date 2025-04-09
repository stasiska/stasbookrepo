import { z } from 'zod';

export const config = z.object({
  NODE_ENV: z.string().optional(),
  CHECK: z.string(),
});

export type ConfigSchema = z.infer<typeof config>;
