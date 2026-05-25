'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apikeyService } from '@/services/apikey.service';
import { ErrorResponse } from '@/types';
import { AxiosError } from 'axios';

export function useApiKeys() {
  const queryClient = useQueryClient();

  const keysQuery = useQuery({
    queryKey: ['keys'],
    queryFn: () => apikeyService.getKeys(),
  });

  const generateKeyMutation = useMutation({
    mutationFn: ({ modelIds, isGlobal, label }: { modelIds: string[]; isGlobal: boolean; label: string }) =>
      apikeyService.generateKey(modelIds, isGlobal, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] });
      toast.success('API key generated!');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || 'Failed to generate key.';
      toast.error(message);
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: (keyId: string) => apikeyService.revokeKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] });
      toast.success('API key revoked.');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || 'Failed to revoke key.';
      toast.error(message);
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (keyId: string) => apikeyService.deleteKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] });
      toast.success('API key deleted.');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || 'Failed to delete key.';
      toast.error(message);
    },
  });

  const updateKeyMutation = useMutation({
    mutationFn: ({ keyId, label }: { keyId: string; label: string }) =>
      apikeyService.updateKey(keyId, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] });
      toast.success('API key updated.');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || 'Failed to update key.';
      toast.error(message);
    },
  });

  return {
    keys: keysQuery.data,
    keysError: keysQuery.error,
    isKeysLoading: keysQuery.isLoading,
    generateKey: generateKeyMutation,
    revokeKey: revokeKeyMutation,
    deleteKey: deleteKeyMutation,
    updateKey: updateKeyMutation,
  };
}
