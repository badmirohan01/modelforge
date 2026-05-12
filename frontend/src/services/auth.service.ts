import api from './api';
import { AuthResponse } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    return data;
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/register', {
      email,
      password,
    });
    return data;
  },
};
