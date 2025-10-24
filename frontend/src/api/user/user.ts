import apiClient from '@/lib/apiClient';
import { parseApiResponse } from '../parseResponse';
import { createApiResponseSchema } from '../schema';
import { UserSchema, type SexualOrientation, type Gender, type User, type Profile, ProfileSchema, type Matches, MatchesSchema } from '@/types/user';
import { getToastMessage } from '@/lib/messageMap';

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  sexualOrientation?: SexualOrientation;
  biography?: string;
  latitude?: number;
  longitude?: number;
}

export const userApi = {
  getOwnProfile: async (): Promise<User> => {
    const response = await parseApiResponse(apiClient.get('/users/me'), createApiResponseSchema(UserSchema));
    if (!response.success) {
      throw new Error(getToastMessage(response.messageKey));
    }
    return response.data;
  },

  updateProfile: async (request: UpdateProfileRequest): Promise<User> => {
    const response = await parseApiResponse(apiClient.put('/users/me', request), createApiResponseSchema(UserSchema));
    if (!response.success) {
      throw new Error(getToastMessage(response.messageKey));
    }
    return response.data;
  },

  findAllMatches: async (): Promise<Matches> => {
    const response = await parseApiResponse(apiClient.get('/users/matches'), createApiResponseSchema(MatchesSchema));
    if (!response.success) {
      throw new Error(getToastMessage(response.messageKey));
    }
    return response.data;
  },
};
