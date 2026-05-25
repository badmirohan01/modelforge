'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { modelService } from '@/services/model.service';
import { ErrorResponse } from '@/types';
import { AxiosError } from 'axios';

/**
 * Fetches the full list of models.
 * Query key: ['models']
 */
export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: modelService.getModels,
  });
}

/**
 * Mutation to upload a new model.
 * On success: invalidates ['models'] so the list auto-refreshes.
 */
export function useUploadModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => modelService.uploadModel(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Model deployed successfully!');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || 'Failed to deploy model.';
      toast.error(message);
    },
  });
}
