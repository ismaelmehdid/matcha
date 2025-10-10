import { api } from './client';

export const AuthAPI = {
  register: async (email: string, password: string, firstName: string, lastName: string, username: string) =>
    await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, username }),
    }),

  login: async (username: string, password: string) =>
    await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  verify: async () => await api('/auth/verify'),
};
