'use client';

import { useQuery } from '@tanstack/react-query';
import { inferenceService } from '@/services/inference.service';

/**
 * Standalone hook for fetching inference logs for a given model.
 * Used by the dedicated /logs page.
 *
 * Query key: ['logs', modelId, page]
 */
export function useLogs(modelId: string, page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: ['logs', modelId, page],
    queryFn: () => inferenceService.getLogs(modelId, page, size),
    enabled: !!modelId,
  });
}
