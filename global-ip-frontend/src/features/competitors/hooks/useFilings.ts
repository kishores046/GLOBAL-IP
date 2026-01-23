/**
 * React Query Hooks for Filing Management
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { filingApi } from '../api/filingApi';
import type {
  CompetitorFilingDTO,
  PageableResponse,
  FilingSearchRequest,
  FilingSearchResponse,
  FilingSummaryDTO,
  FilingTrendDTO,
  MonthlyTrendsMap,
  SyncResultDTO,
} from '../types';

/**
 * Query keys for filing operations
 */
export const filingQueryKeys = {
  all: ['filings'] as const,
  byCompetitor: () => [...filingQueryKeys.all, 'byCompetitor'] as const,
  byCompetitorId: (id: number) =>
    [...filingQueryKeys.byCompetitor(), id] as const,
  paginated: () => [...filingQueryKeys.all, 'paginated'] as const,
  paginatedByCompetitor: (id: number, page: number, size: number) =>
    [...filingQueryKeys.paginated(), id, page, size] as const,
  search: () => [...filingQueryKeys.all, 'search'] as const,
  searchParams: (params: FilingSearchRequest) =>
    [...filingQueryKeys.search(), params] as const,
  summary: () => [...filingQueryKeys.all, 'summary'] as const,
  trends: () => [...filingQueryKeys.all, 'trends'] as const,
  trendsByDate: (fromDate?: string) =>
    [...filingQueryKeys.trends(), { fromDate }] as const,
  monthlyTrends: () => [...filingQueryKeys.all, 'monthlyTrends'] as const,
  monthlyTrendsByDate: (fromDate?: string) =>
    [...filingQueryKeys.monthlyTrends(), { fromDate }] as const,
};

// ==================== QUERIES ====================

/**
 * Hook to fetch all filings for a competitor (non-paginated)
 */
export function useFilingsByCompetitor(
  competitorId: number | null,
  enabled: boolean = true
): UseQueryResult<CompetitorFilingDTO[], Error> {
  return useQuery({
    queryKey: filingQueryKeys.byCompetitorId(competitorId!),
    queryFn: () => filingApi.getByCompetitor(competitorId!),
    enabled: enabled && competitorId !== null,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch paginated filings for a competitor
 */
export function useFilingsByCompetitorPaginated(
  competitorId: number | null,
  page: number = 0,
  size: number = 50,
  enabled: boolean = true
): UseQueryResult<PageableResponse<CompetitorFilingDTO>, Error> {
  return useQuery({
    queryKey: filingQueryKeys.paginatedByCompetitor(competitorId!, page, size),
    queryFn: () =>
      filingApi.getByCompetitorPaginated(competitorId!, page, size),
    enabled: enabled && competitorId !== null,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to search filings with filters
 */
export function useSearchFilings(
  request: FilingSearchRequest,
  enabled: boolean = true
): UseQueryResult<FilingSearchResponse, Error> {
  return useQuery({
    queryKey: filingQueryKeys.searchParams(request),
    queryFn: () => filingApi.search(request),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch filing summary
 */
export function useFilingSummary(): UseQueryResult<FilingSummaryDTO, Error> {
  return useQuery({
    queryKey: filingQueryKeys.summary(),
    queryFn: filingApi.getSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch filing trends
 */
export function useFilingTrends(
  fromDate?: string
): UseQueryResult<FilingTrendDTO[], Error> {
  return useQuery({
    queryKey: filingQueryKeys.trendsByDate(fromDate),
    queryFn: () => filingApi.getTrends(fromDate),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000,
  });
}

/**
 * Hook to fetch monthly filing trends
 */
export function useMonthlyFilingTrends(
  fromDate?: string
): UseQueryResult<MonthlyTrendsMap, Error> {
  return useQuery({
    queryKey: filingQueryKeys.monthlyTrendsByDate(fromDate),
    queryFn: () => filingApi.getMonthlyTrends(fromDate),
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

// ==================== MUTATIONS ====================

/**
 * Hook to trigger filing sync
 */
export function useFilingSync(): UseMutationResult<
  SyncResultDTO,
  Error,
  string,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filingApi.sync,
    onSuccess: () => {
      // Invalidate all filing-related queries
      queryClient.invalidateQueries({ queryKey: filingQueryKeys.all });
    },
  });
}

/**
 * Hook to export filings to CSV
 */
export function useExportFilingsCsv(): UseMutationResult<
  Blob,
  Error,
  { request: FilingSearchRequest; filename?: string },
  unknown
> {
  return useMutation({
    mutationFn: ({ request, filename }) =>
      filingApi.exportToCsv(request, filename),
  });
}
