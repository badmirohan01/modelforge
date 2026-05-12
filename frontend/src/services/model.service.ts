import api from './api';
import { ModelResponse, ModelUploadResponse } from '@/types';

export const modelService = {
  async getModels(): Promise<ModelResponse[]> {
    const { data } = await api.get<ModelResponse[]>('/api/models');
    return data;
  },

  async getModel(modelId: string): Promise<ModelResponse> {
    const { data } = await api.get<ModelResponse>(`/api/models/${modelId}`);
    return data;
  },

  async uploadModel(formData: FormData): Promise<ModelUploadResponse> {
    // Do NOT set Content-Type — let browser set multipart boundary
    const { data } = await api.post<ModelUploadResponse>(
      '/api/models/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
};
