import apiClient from '@/lib/apiClient';
import { parseApiResponse } from '@/api/parseResponse';
import { createApiResponseSchema } from '../schema';
import { AccessTokenSchema, type AccessToken } from '@/types/user';
import { z } from 'zod';

export const authApi = {
  signUp: async (email: string, password: string, firstName: string, lastName: string, username: string): Promise<AccessToken> => {
    const response = await parseApiResponse(apiClient.post('/auth/sign-up', { email, password, firstName, lastName, username }), createApiResponseSchema(AccessTokenSchema));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
    return response.data;
  },

  signIn: async (username: string, password: string): Promise<AccessToken> => {
    const response = await parseApiResponse(apiClient.post('/auth/sign-in', { username, password }), createApiResponseSchema(AccessTokenSchema));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
    return response.data;
  },

  signOut: async (): Promise<void> => {
    const response = await parseApiResponse(apiClient.post('/auth/sign-out'), createApiResponseSchema(z.void()));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
  },

  refreshToken: async (): Promise<AccessToken> => {
    const response = await parseApiResponse(apiClient.get('/auth/refresh-token'), createApiResponseSchema(AccessTokenSchema));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
    return response.data;
  },

  sendPasswordResetEmail: async (email: string): Promise<void> => {
    const response = await parseApiResponse(apiClient.post('/auth/send-password-reset-email', email), createApiResponseSchema(z.void()));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    console.log('TOKEN: ', token);
    console.log('PASSWORD: ', password);
    const response = await parseApiResponse(apiClient.post('/auth/reset-password', { token: token, password: password }), createApiResponseSchema(z.void()));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
  },

  sendVerifyEmail: async (): Promise<void> => {
    const response = await parseApiResponse(apiClient.post('/auth/send-verify-email'), createApiResponseSchema(z.void()));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
  },

  verifyEmail: async (verifyEmailToken: string): Promise<void> => {
    const response = await parseApiResponse(apiClient.get(`/auth/verify-email?token=${verifyEmailToken}`), createApiResponseSchema(z.void()));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
  },
};
