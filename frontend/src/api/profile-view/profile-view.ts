import apiClient from '@/lib/apiClient';
import { parseApiResponse } from '../parseResponse';
import { createApiResponseSchema } from '../schema';
import { getToastMessage } from '@/lib/messageMap';
import { ProfileViewSchema, type ProfileView } from '@/types/profile-view';
import { z } from 'zod';

const GetProfileViewsResponseSchema = z.object({ profileViews: z.array(ProfileViewSchema) });

export const profileViewApi = {
  getProfileViews: async (): Promise<ProfileView[]> => {
    const response = await parseApiResponse(
      apiClient.get('/profile-views'),
      createApiResponseSchema(GetProfileViewsResponseSchema)
    );
    if (!response.success) {
      throw new Error(getToastMessage(response.messageKey));
    }
    return response.data.profileViews;
  },

  recordProfileView: async (userId: string): Promise<void> => {
    const response = await parseApiResponse(
      apiClient.post('/profile-views', { userId }),
      createApiResponseSchema(z.void())
    );
    if (!response.success) {
      throw new Error(getToastMessage(response.messageKey));
    }
  },
};
