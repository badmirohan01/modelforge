import api from './api';
import { ApiKeyResponse } from '@/types';

export const apikeyService = {
  async generateKey(
    modelIds: string[],
    isGlobal: boolean,
    label: string
  ): Promise<ApiKeyResponse> {
    const { data } = await api.post<ApiKeyResponse>('/api/keys', {
      modelIds,
      isGlobal,
      label,
    });
    return data;
  },

  async getKeys(): Promise<ApiKeyResponse[]> {
    const { data } = await api.get<ApiKeyResponse[]>('/api/keys');
    return data;
  },

  async revokeKey(keyId: string): Promise<void> {
    await api.put(`/api/keys/${keyId}/revoke`);
  },

  async deleteKey(keyId: string): Promise<void> {
    await api.delete(`/api/keys/${keyId}`);
  },

  async updateKey(keyId: string, label: string): Promise<ApiKeyResponse> {
    const { data } = await api.patch<ApiKeyResponse>(`/api/keys/${keyId}`, {
      label,
    });
    return data;
  },
};
