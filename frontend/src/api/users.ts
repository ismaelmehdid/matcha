import { api } from './client';

export interface User {
  id: number;
  username: string;
  email: string;
  is_email_verified: boolean;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female';
  sexual_orientation: 'straight' | 'gay' | 'bisexual';
  biography?: string;
  fame_rating: number;
  latitude?: number;
  longitude?: number;
  last_login?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const UsersAPI = {
  getCurrentUser: async (): Promise<User> => await api('/users/me'),
};

