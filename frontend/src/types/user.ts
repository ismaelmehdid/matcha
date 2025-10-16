import { z } from 'zod';
import { createApiResponseSchema } from './api';

//TODO: Check if everything is there
export const UserSchema = z.object({
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
});

export const UserResponseSchema = createApiResponseSchema(UserSchema);

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
