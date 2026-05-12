import api from './api';
import { InferResponse, InferenceLogResponse } from '@/types';

export const inferenceService = {
  async infer(
    modelId: string,
    inputs: unknown,
    proba: boolean = false
  ): Promise<InferResponse> {
    const { data } = await api.post<InferResponse>(
      `/api/models/${modelId}/infer`,
      { inputs, proba }
    );
    return data;
  },

  async getLogs(
    modelId: string,
    page: number = 0,
    size: number = 20
  ): Promise<InferenceLogResponse[]> {
    const { data } = await api.get<InferenceLogResponse[]>(
      `/api/models/${modelId}/logs`,
      { params: { page, size } }
    );
    return data;
  },
};
