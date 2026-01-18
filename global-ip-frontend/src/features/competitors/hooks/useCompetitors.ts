/**
 * React Query Hooks for Competitor Management
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
  QueryClient,
} from '@tanstack/react-query';
import { competitorApi } from '../api/competitorApi';
import type {
  CompetitorDTO,
  CompetitorCreateRequest,
  CompetitorUpdateRequest,
} from '../types';

/**
 * Query keys for competitor operations
 */
export const competitorQueryKeys = {
  all: ['competitors'] as const,
  lists: () => [...competitorQueryKeys.all, 'list'] as const,
  list: (activeOnly: boolean) =>
    [...competitorQueryKeys.lists(), { activeOnly }] as const,
  details: () => [...competitorQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...competitorQueryKeys.details(), id] as const,
  search: (query: string) =>
    [...competitorQueryKeys.all, 'search', query] as const,
};

// ==================== QUERIES ====================

/**
 * Hook to fetch all competitors
 * @param activeOnly - Filter to only active competitors (default: true)
 */
export function useCompetitors(
  activeOnly: boolean = true
): UseQueryResult<CompetitorDTO[], Error> {
  return useQuery({
    queryKey: competitorQueryKeys.list(activeOnly),
    queryFn: () => competitorApi.list(activeOnly),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch a single competitor by ID
 * @param id - Competitor ID
 * @param enabled - Whether the query should run (default: true)
 */
export function useCompetitorById(
  id: number | null,
  enabled: boolean = true
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: competitorQueryKeys.detail(id!),
    queryFn: () => competitorApi.getById(id!),
    enabled: enabled && id !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to search competitors
 * @param searchQuery - Search term
 */
export function useSearchCompetitors(
  searchQuery: string
): UseQueryResult<CompetitorDTO[], Error> {
  return useQuery({
    queryKey: competitorQueryKeys.search(searchQuery),
    queryFn: () => competitorApi.search(searchQuery),
    enabled: searchQuery.length > 0,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });
}

// ==================== MUTATIONS ====================

/**
 * Hook to create a new competitor
 */
export function useCreateCompetitor(): UseMutationResult<
  CompetitorDTO,
  Error,
  CompetitorCreateRequest,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: competitorApi.create,
    onSuccess: (newCompetitor) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: competitorQueryKeys.lists() });
      // Optionally add the new competitor to the cache
      queryClient.setQueryData(
        competitorQueryKeys.detail(newCompetitor.id),
        newCompetitor
      );
    },
  });
}

/**
 * Hook to update a competitor
 */
export function useUpdateCompetitor(
  competitorId: number
): UseMutationResult<CompetitorDTO, Error, CompetitorUpdateRequest, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CompetitorUpdateRequest) =>
      competitorApi.update(competitorId, request),
    onSuccess: (updatedCompetitor) => {
      // Invalidate and update cache
      queryClient.setQueryData(
        competitorQueryKeys.detail(competitorId),
        updatedCompetitor
      );
      queryClient.invalidateQueries({ queryKey: competitorQueryKeys.lists() });
    },
  });
}

/**
 * Hook to delete a competitor
 */
export function useDeleteCompetitor(): UseMutationResult<
  void,
  Error,
  number,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: competitorApi.delete,
    onSuccess: () => {
      // Invalidate all competitor queries
      queryClient.invalidateQueries({ queryKey: competitorQueryKeys.all });
    },
  });
}

/**
 * Hook to toggle competitor active status
 */
export function useToggleCompetitorActive(): UseMutationResult<
  CompetitorDTO,
  Error,
  { id: number; active: boolean },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }) => competitorApi.toggleActive(id, active),
    onSuccess: (updatedCompetitor) => {
      queryClient.setQueryData(
        competitorQueryKeys.detail(updatedCompetitor.id),
        updatedCompetitor
      );
      queryClient.invalidateQueries({ queryKey: competitorQueryKeys.lists() });
    },
  });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Utility to prefetch a competitor
 */
export function prefetchCompetitor(
  queryClient: QueryClient,
  competitorId: number
) {
  return queryClient.prefetchQuery({
    queryKey: competitorQueryKeys.detail(competitorId),
    queryFn: () => competitorApi.getById(competitorId),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Utility to prefetch all competitors
 */
export function prefetchCompetitors(
  queryClient: QueryClient,
  activeOnly: boolean = true
) {
  return queryClient.prefetchQuery({
    queryKey: competitorQueryKeys.list(activeOnly),
    queryFn: () => competitorApi.list(activeOnly),
    staleTime: 5 * 60 * 1000,
  });
}
