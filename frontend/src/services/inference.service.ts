import api from './api';
import { InferResponse, InferenceLogResponse } from '@/types';

export const inferenceService = {
  async infer(
    modelId: string,
    payload: any,
    proba: boolean = false
  ): Promise<InferResponse> {
    // If user typed a raw array, wrap it. If it's already an object, use it.
    const requestBody = Array.isArray(payload) 
      ? { inputs: payload, returnProba: proba }
      : { ...payload, returnProba: proba };

    const { data } = await api.post<InferResponse>(
      `/api/models/${modelId}/infer`,
      requestBody
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
