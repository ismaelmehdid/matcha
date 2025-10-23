import { z } from 'zod';

export const ApiErrorSchema = z.object({
  code: z.string(),
  details: z.string(),
});

export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.union([
    z.object({
      success: z.literal(true),
      data: dataSchema,
      messageKey: z.string(),
    }),
    z.object({
      success: z.literal(false),
      error: ApiErrorSchema,
      messageKey: z.string(),
      timestamp: z.string(),
      path: z.string(),
    }),
  ]);
}

export type ApiError = z.infer<typeof ApiErrorSchema>;
