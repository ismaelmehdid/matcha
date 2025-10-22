import { z } from "zod";
import { createApiResponseSchema } from "../schema";

export const UserPhotoSchema = z.object({
  id: z.number(),
  url: z.string(),
  is_profile_pic: z.boolean(),
});
export type UserPhoto = z.infer<typeof UserPhotoSchema>;

export const UserInterestSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type UserInterest = z.infer<typeof UserInterestSchema>;

//===----------------------------------------------------------------------===//
//=== Get Profile
//===----------------------------------------------------------------------===//

// No request schema needed for get own user profile

export const GetOwnProfileResponseSchema = createApiResponseSchema(z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(['male', 'female']).nullable(),
  sexualOrientation: z.enum(['straight', 'gay', 'bisexual']).nullable(),
  biography: z.string().nullable(),
  fameRating: z.number(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  email: z.string(),
  isEmailVerified: z.boolean(),
  createdAt: z.string().transform((str) => new Date(str)),
  lastTimeActive: z.string().nullable().transform((str) => str ? new Date(str) : null),
  photos: z.array(UserPhotoSchema),
  interests: z.array(UserInterestSchema),
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