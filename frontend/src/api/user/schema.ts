import { z } from "zod";
import { createApiResponseSchema } from "../schema";

//===----------------------------------------------------------------------===//
//=== Get Profile
//===----------------------------------------------------------------------===//

// No request schema needed for get own user profile

export const GetOwnProfileResponseSchema = createApiResponseSchema(z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(['male', 'female']),
  sexualOrientation: z.enum(['straight', 'gay', 'bisexual']),
  biography: z.string(),
  fameRating: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  email: z.string(),
  isEmailVerified: z.boolean(),
}));
export type GetOwnProfileResponse = z.infer<typeof GetOwnProfileResponseSchema>;

//===----------------------------------------------------------------------===//
//=== Update Profile
//===----------------------------------------------------------------------===//

export const UpdateProfileRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(['male', 'female']),
  sexualOrientation: z.enum(['straight', 'gay', 'bisexual']),
  biography: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

// No response needed for update profile