import api from './api';
import { ApiKeyResponse } from '@/types';

export const apikeyService = {
  async generateKey(
    modelId: string,
    label: string
  ): Promise<ApiKeyResponse> {
    const { data } = await api.post<ApiKeyResponse>(
      `/api/models/${modelId}/keys`,
      null,
      { params: { label } }
    );
    return data;
  },

  async getKeys(modelId: string): Promise<ApiKeyResponse[]> {
    const { data } = await api.get<ApiKeyResponse[]>(
      `/api/models/${modelId}/keys`
    );
    return data;
  },

  async revokeKey(modelId: string, keyId: string): Promise<void> {
    await api.delete(`/api/models/${modelId}/keys/${keyId}`);
  },

  async updateKey(
    modelId: string,
    keyId: string,
    label: string
  ): Promise<ApiKeyResponse> {
    const { data } = await api.put<ApiKeyResponse>(
      `/api/models/${modelId}/keys/${keyId}`,
      null,
      { params: { label } }
    );
    return data;
  },
};
