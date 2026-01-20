/**
 * React Query Hooks for Admin API Key Management
 * Custom hooks for API key data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import type {
  AdminApiKeyListResponse,
  AdminApiKeyFilters,
} from '../types/admin';

/**
 * Hook to fetch paginated API keys with filters
 * @param filters - Filter options (userId, status, searchKey, pagination)
 * @returns UseQueryResult with API keys data
 */
export const useAdminApiKeys = (
  filters: AdminApiKeyFilters = {}
): UseQueryResult<AdminApiKeyListResponse, Error> => {
  return useQuery({
    queryKey: ['admin', 'api-keys', filters],
    queryFn: () => adminApi.getAdminApiKeys(filters),
    placeholderData: (previousData) => previousData, // Smooth pagination
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

/**
 * Hook to revoke an API key
 * @returns Mutation object for revoking API keys
 */
export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => adminApi.revokeApiKey(keyId),
    onSuccess: () => {
      // Invalidate and refetch API keys list
      queryClient.invalidateQueries({ queryKey: ['admin', 'api-keys'] });
    },
    onError: (error) => {
      console.error('Failed to revoke API key:', error);
    },
  });
};

/**
 * Hook for managing API key related queries and mutations
 * Provides both query and mutation functionality
 */
export const useAdminApiKeyManagement = (filters: AdminApiKeyFilters = {}) => {
  const keysQuery = useAdminApiKeys(filters);
  const revokeMutation = useRevokeApiKey();

  return {
    keys: keysQuery.data,
    isLoading: keysQuery.isLoading,
    error: keysQuery.error,
    isPending: keysQuery.isPending,
    refetch: keysQuery.refetch,
    revokeKey: revokeMutation.mutate,
    isRevoking: revokeMutation.isPending,
    revokeError: revokeMutation.error,
  };
};
