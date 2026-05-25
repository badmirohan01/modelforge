'use client';

import { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { modelService } from '@/services/model.service';
import { inferenceService } from '@/services/inference.service';
import { apikeyService } from '@/services/apikey.service';
import { ErrorResponse } from '@/types';
import { AxiosError } from 'axios';

/**
 * Composite hook for the model detail page.
 * Fetches model, keys, and logs in parallel.
 * Provides mutations for infer, generateKey, and revokeKey.
 *
 * Query keys:
 *   ['model', modelId]  — single model detail
 *   ['keys', modelId]   — API keys for this model
 *   ['logs', modelId, page] — inference logs (paginated)
 */
export function useModelDetail(modelId: string) {
  const queryClient = useQueryClient();
  const [logsPage, setLogsPage] = useState(0);

  // --- Queries (parallel) ---

  const modelQuery = useQuery({
    queryKey: ['model', modelId],
    queryFn: () => modelService.getModel(modelId),
    enabled: !!modelId,
  });

  const keysQuery = useQuery({
    queryKey: ['keys', modelId],
    queryFn: async () => {
      // The new getKeys fetches all keys for the user. We filter them here for this specific model.
      const allKeys = await apikeyService.getKeys();
      return allKeys.filter(k => k.isGlobal || (k.modelIds && k.modelIds.includes(modelId)));
    },
    enabled: !!modelId,
  });

  const logsQuery = useQuery({
    queryKey: ['logs', modelId, logsPage],
    queryFn: () => inferenceService.getLogs(modelId, logsPage, 20),
    enabled: !!modelId,
  });

  // --- Mutations ---

  const inferMutation = useMutation({
    mutationFn: ({
      inputs,
      proba,
    }: {
      inputs: unknown;
      proba?: boolean;
    }) => inferenceService.infer(modelId, inputs, proba),
    onSuccess: () => {
      // Refresh model stats (Total Calls, Avg Latency)
      queryClient.invalidateQueries({
        queryKey: ['model', modelId],
      });
      // Refresh logs
      queryClient.invalidateQueries({
        queryKey: ['logs', modelId],
      });
      toast.success('Inference completed!');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || 'Inference failed.';
      toast.error(message);
    },
  });

  const generateKeyMutation = useMutation({
    mutationFn: (label: string) =>
      apikeyService.generateKey([modelId], false, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys', modelId] });
      toast.success('API key generated!');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || 'Failed to generate key.';
      toast.error(message);
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: (keyId: string) =>
      apikeyService.revokeKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys', modelId] });
      toast.success('API key revoked.');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || 'Failed to revoke key.';
      toast.error(message);
    },
  });

  const updateKeyMutation = useMutation({
    mutationFn: ({ keyId, label }: { keyId: string; label: string }) =>
      apikeyService.updateKey(keyId, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys', modelId] });
      toast.success('API key renamed.');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || 'Failed to rename key.';
      toast.error(message);
    },
  });

  // --- Combined loading state ---
  const isLoading =
    modelQuery.isLoading || keysQuery.isLoading || logsQuery.isLoading;

  return {
    // Query data
    model: modelQuery.data,
    modelError: modelQuery.error,
    isModelLoading: modelQuery.isLoading,

    keys: keysQuery.data,
    keysError: keysQuery.error,
    isKeysLoading: keysQuery.isLoading,

    logs: logsQuery.data,
    logsError: logsQuery.error,
    isLogsLoading: logsQuery.isLoading,

    // Pagination
    logsPage,
    setLogsPage,

    // Mutations
    infer: inferMutation,
    generateKey: generateKeyMutation,
    revokeKey: revokeKeyMutation,
    updateKey: updateKeyMutation,

    // Combined
    isLoading,
  };
}
