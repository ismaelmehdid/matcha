import apiClient from '@/lib/apiClient';
import { parseApiResponse } from '../parseResponse';
import { createApiResponseSchema } from '../schema';
import { UserSchema, type SexualOrientation, type Gender, type User } from '@/types/user';
import { z } from 'zod';

export const userApi = {
  getOwnProfile: async (): Promise<User> => {
    const response = await parseApiResponse(apiClient.get('/users/me'), createApiResponseSchema(UserSchema));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
    return response.data;
  },

  updateProfile: async (firstName: string, lastName: string, gender: Gender, sexualOrientation: SexualOrientation, biography: string, latitude: number, longitude: number): Promise<void> => {
    const response = await parseApiResponse(apiClient.put('/users/me', { firstName, lastName, gender, sexualOrientation, biography, latitude, longitude }), createApiResponseSchema(z.void()));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
  },
};
