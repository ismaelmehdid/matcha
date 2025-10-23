import { z } from "zod";

export const InterestSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type Interest = z.infer<typeof InterestSchema>;

export const InterestsSchema = z.array(InterestSchema);
export type Interests = z.infer<typeof InterestsSchema>;