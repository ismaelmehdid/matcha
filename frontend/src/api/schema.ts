import { z } from 'zod';

export const ApiErrorSchema = z.object({
  code: z.string(),
  details: z.string(),
});

export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.union([
    z.object({
      success: z.literal(true),
      data: z.union([dataSchema, EmptyDataSchema]),
      messageKey: z.string(),
    }),
    z.object({
      success: z.literal(false),
      error: ApiErrorSchema,
      messageKey: z.string(),
    }),
  ]);
}

export type ApiError = z.infer<typeof ApiErrorSchema>;

//===----------------------------------------------------------------------===//

export const EmptyDataSchema = z.object({});

export const EmptyResponseSchema = z.union([
  z.object({
    success: z.literal(true),
    data: EmptyDataSchema,
    messageKey: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: ApiErrorSchema,
    messageKey: z.string(),
  }),
]);

export type EmptyResponse = z.infer<typeof EmptyResponseSchema>;
