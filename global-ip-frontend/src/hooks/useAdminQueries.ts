/**
 * React Query Hooks for Admin Dashboard
 * Custom hooks for data fetching with auto-refresh
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import type {
  AdminOverviewDto,
  ApiHealthStatus,
  SystemHealthSummary,
  ErrorSummaryDto,
  ApiUsageLogDto,
  LogFilters,
  PageResponse,
} from '../types/admin';

/**
 * Hook to fetch admin overview metrics
 * Auto-refreshes every 30 seconds
 */
export const useAdminOverview = (): UseQueryResult<AdminOverviewDto, Error> => {
  return useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => adminApi.getOverview(),
    refetchInterval: 30000, // 30 seconds
    staleTime: 20000, // Data considered fresh for 20 seconds
    retry: 2,
  });
};

/**
 * Hook to fetch API health status for all services
 * Auto-refreshes every 15 seconds
 */
export const useApiHealth = (): UseQueryResult<ApiHealthStatus[], Error> => {
  return useQuery({
    queryKey: ['admin', 'health'],
    queryFn: () => adminApi.getHealth(),
    refetchInterval: 15000, // 15 seconds
    staleTime: 10000, // Data considered fresh for 10 seconds
    retry: 2,
  });
};

/**
 * Hook to fetch overall system health summary
 * Auto-refreshes every 30 seconds
 */
export const useHealthSummary = (): UseQueryResult<SystemHealthSummary, Error> => {
  return useQuery({
    queryKey: ['admin', 'health', 'summary'],
    queryFn: () => adminApi.getHealthSummary(),
    refetchInterval: 30000, // 30 seconds
    staleTime: 20000,
    retry: 2,
  });
};

/**
 * Hook to fetch error summary by service
 * Auto-refreshes every 60 seconds
 */
export const useErrorSummary = (): UseQueryResult<ErrorSummaryDto[], Error> => {
  return useQuery({
    queryKey: ['admin', 'errors'],
    queryFn: () => adminApi.getErrorSummary(),
    refetchInterval: 60000, // 1 minute
    staleTime: 45000,
    retry: 2,
  });
};

/**
 * Hook to fetch paginated usage logs with filters
 * Does not auto-refresh to avoid disrupting pagination
 */
export const useUsageLogs = (
  filters: LogFilters
): UseQueryResult<PageResponse<ApiUsageLogDto>, Error> => {
  return useQuery({
    queryKey: ['admin', 'usage-logs', filters],
    queryFn: () => adminApi.getUsageLogs(filters),
    placeholderData: (previousData) => previousData, // Smooth pagination (replaces keepPreviousData)
    staleTime: 30000,
    retry: 2,
  });
};

/**
 * Hook for manual refresh control
 * Returns refetch functions for all queries
 */
export const useAdminRefresh = () => {
  const { refetch: refetchOverview } = useAdminOverview();
  const { refetch: refetchHealth } = useApiHealth();
  const { refetch: refetchHealthSummary } = useHealthSummary();
  const { refetch: refetchErrors } = useErrorSummary();

  const refreshAll = async () => {
    await Promise.all([
      refetchOverview(),
      refetchHealth(),
      refetchHealthSummary(),
      refetchErrors(),
    ]);
  };

  return {
    refetchOverview,
    refetchHealth,
    refetchHealthSummary,
    refetchErrors,
    refreshAll,
  };
};
