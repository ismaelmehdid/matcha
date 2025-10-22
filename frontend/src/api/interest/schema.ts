
import { createApiResponseSchema } from "../schema";
import { z } from "zod";

//===----------------------------------------------------------------------===//
//=== Get all interests
//===----------------------------------------------------------------------===//

// No request schema needed for get all interests

export const GetAllInterestsResponseSchema = createApiResponseSchema(
  z.array(z.object({
    id: z.number(),
    name: z.string(),
  }))
);
export type GetAllInterestsResponse = z.infer<typeof GetAllInterestsResponseSchema>;