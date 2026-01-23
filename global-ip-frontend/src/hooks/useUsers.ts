/**
 * React Query Hooks for User Management
 * Custom hooks for data fetching with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import type { 
  UserAdminDto, 
  UserActivityDto, 
  UserProfileResponse, 
  DashboardUserCountResponse,
  UserSearchParams,
  PageResponse
} from '../types/admin';

/**
 * Hook to fetch paginated users list
 */
export const useUsers = (params: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => adminApi.getUsers(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });
};

/**
 * Hook to search users with filters
 */
export const useSearchUsers = (params: UserSearchParams) => {
  return useQuery<PageResponse<UserAdminDto>, Error>({
    queryKey: ['users', 'search', params],
    queryFn: () => adminApi.searchUsers(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch single user by ID
 */
export const useUser = (userId: string, enabled: boolean = true) => {
  return useQuery<UserAdminDto, Error>({
    queryKey: ['users', userId],
    queryFn: () => adminApi.getUser(userId),
    enabled: enabled && !!userId,
  });
};

/**
 * Hook to fetch user activity statistics
 */
export const useUserActivity = (userId: string, enabled: boolean = true) => {
  return useQuery<UserActivityDto, Error>({
    queryKey: ['user-activity', userId],
    queryFn: () => adminApi.getUserActivity(userId),
    enabled: enabled && !!userId,
  });
};

/**
 * Hook to fetch inactive users
 */
export const useInactiveUsers = (enabled: boolean = true) => {
  return useQuery<UserProfileResponse[], Error>({
    queryKey: ['users', 'inactive'],
    queryFn: () => adminApi.getInactiveUsers(),
    enabled,
  });
};

/**
 * Hook to fetch dashboard user counts
 */
export const useDashboardCounts = () => {
  return useQuery<DashboardUserCountResponse, Error>({
    queryKey: ['dashboard', 'counts'],
    queryFn: () => adminApi.getDashboardCounts(),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 45000,
  });
};

/**
 * Hook to update user roles
 */
export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      adminApi.updateUserRoles(userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'counts'] });
    },
  });
};
