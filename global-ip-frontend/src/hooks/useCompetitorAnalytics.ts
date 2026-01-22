/**
 * React Query hooks for Competitor Analytics
 * Handles all data fetching with caching and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import competitorFilingApi, {
  CompetitorFilingDTO,
  FilingSummaryDTO,
  SyncResultDTO,
} from '../services/competitorFilingApi';
import { competitorApi } from '../features/competitors/api/competitorApi';
import { CompetitorDTO } from '../features/competitors/types';

// Query Keys
const QUERY_KEYS = {
  competitors: ['competitors'],
  competitorDetail: (id: number) => ['competitor', id],
  filings: (competitorId: number) => ['filings', competitorId],
  summary: ['filing-summary'],
  trends: (fromDate: string) => ['filing-trends', fromDate],
};

/**
 * Fetch all competitors (entry point for Competitor Analytics)
 */
export function useCompetitors(activeOnly: boolean = true) {
  return useQuery<CompetitorDTO[], Error>({
    queryKey: QUERY_KEYS.competitors,
    queryFn: async () => {
      return await competitorApi.list(activeOnly);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch filings for a specific competitor (drill-down)
 * IMPORTANT: This endpoint has a backend guard that causes 403 errors.
 * Always pass enabled={hasSubscription} to prevent unnecessary 403 calls.
 */
export function useCompetitorFilings(competitorId: number, enabled: boolean = true) {
  return useQuery<CompetitorFilingDTO[], Error>({
    queryKey: QUERY_KEYS.filings(competitorId),
    queryFn: async () => {
      return await competitorFilingApi.getFilingsForCompetitor(competitorId);
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error: any) => {
      // Don't retry 403 errors - backend guard issue
      if (error?.response?.status === 403) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
  });
}

/**
 * Fetch filings for a specific competitor (paginated)
 * IMPORTANT: This endpoint has a backend guard that causes 403 errors.
 * Always pass enabled={hasSubscription} to prevent unnecessary 403 calls.
 */
export function useCompetitorFilingsPaginated(
  competitorId: number,
  page: number = 0,
  pageSize: number = 50,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.filings(competitorId), 'paginated', page, pageSize],
    queryFn: async () => {
      return await competitorFilingApi.getFilingsForCompetitorPaginated(
        competitorId,
        page,
        pageSize
      );
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry 403 errors - backend guard issue
      if (error?.response?.status === 403) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
  });
}

/**
 * Fetch filing summary (KPIs)
 * IMPORTANT: This endpoint has a backend guard that causes 403 errors.
 * Always pass enabled={hasSubscription} to prevent unnecessary 403 calls.
 */
export function useFilingSummary(enabled: boolean = true) {
  return useQuery<FilingSummaryDTO, Error>({
    queryKey: QUERY_KEYS.summary,
    queryFn: async () => {
      return await competitorFilingApi.getFilingSummary();
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry 403 errors - backend guard issue
      if (error?.response?.status === 403) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
  });
}

/**
 * Fetch filing trends (simple ranked list)
 * IMPORTANT: This endpoint has a backend guard that causes 403 errors.
 * Always pass enabled={hasSubscription} to prevent unnecessary 403 calls.
 */
export function useFilingTrends(fromDate: string, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.trends(fromDate),
    queryFn: async () => {
      return await competitorFilingApi.getFilingTrends(fromDate);
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry 403 errors - backend guard issue
      if (error?.response?.status === 403) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
  });
}

/**
 * Sync latest filings mutation
 * IMPORTANT: This endpoint has a backend guard that causes 403 errors.
 * Make sure subscription is verified before calling.
 */
export function useSyncLatestFilings() {
  const queryClient = useQueryClient();

  return useMutation<SyncResultDTO, Error, { fromDate: string }>({
    mutationFn: async ({ fromDate }) => {
      return await competitorFilingApi.syncLatestFilings(fromDate);
    },
    onSuccess: () => {
      // Invalidate all affected queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.competitors });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summary });
    },
    onError: (error) => {
      console.error('❌ Sync failed:', error);
    },
    retry: (failureCount, error: any) => {
      // Don't retry 403 errors - backend guard issue
      if (error?.response?.status === 403) {
        return false;
      }
      // Retry other errors up to 1 time
      return failureCount < 1;
    },
  });
}

/**
 * Check if user has COMPETITOR_FILING subscription
 */
export function useHasCompetitorFilingSubscription() {
  return useQuery<boolean, Error>({
    queryKey: ['subscription-check', 'competitor-filing'],
    queryFn: async () => {
      try {
        const subscriptions = await (
          await import('../services/subscriptionApi').then(m => m.default)
        ).getActiveSubscriptions();
        
        return subscriptions.some(
          (sub: any) =>
            sub.type?.toUpperCase() === 'COMPETITOR_FILING' &&
            sub.status?.toUpperCase() === 'ACTIVE'
        );
      } catch (error) {
        console.error('❌ Error checking subscription:', error);
        return false;
      }
    },
    staleTime: 1 * 60 * 1000, // Reduced to 1 minute for more frequent checks
    gcTime: 5 * 60 * 1000,
  });
}
