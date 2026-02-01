/**
 * Admin API Service
 * Handles all API calls for Admin Monitoring Dashboard
 */

import api from './api';
import type {
  AdminOverviewDto,
  ApiHealthStatus,
  SystemHealthSummary,
  ErrorSummaryDto,
  ApiUsageLogDto,
  LogFilters,
  PageResponse,
  AdminApiKeyListResponse,
  AdminApiKeyFilters,
} from '../types/admin';

// Use the centralized axios instance which is already configured with:
// - Base URL from environment variables
// - JWT interceptor
// - Error handling

const API_BASE = '/admin';

/**
 * Admin API Service
 */
export const adminApi = {
  /**
   * Get system overview metrics
   * @returns Promise<AdminOverviewDto>
   */
  getOverview: async (): Promise<AdminOverviewDto> => {
    const { data } = await api.get(`${API_BASE}/overview`);
    return data;
  },

  /**
   * Get individual API health status
   * @returns Promise<ApiHealthStatus[]>
   */
  getHealth: async (): Promise<ApiHealthStatus[]> => {
    const { data } = await api.get(`${API_BASE}/health`);
    return data;
  },

  /**
   * Get overall system health summary
   * @returns Promise<SystemHealthSummary>
   */
  getHealthSummary: async (): Promise<SystemHealthSummary> => {
    const { data } = await api.get(`${API_BASE}/health/summary`);
    return data;
  },

  /**
   * Get error summary by service
   * @returns Promise<ErrorSummaryDto[]>
   */
  getErrorSummary: async (): Promise<ErrorSummaryDto[]> => {
    const { data } = await api.get(`${API_BASE}/errors`);
    return data;
  },

  /**
   * Get paginated API usage logs with filters
   * @param filters - Log filter options
   * @returns Promise<PageResponse<ApiUsageLogDto>>
   */
  getUsageLogs: async (
    filters: LogFilters
  ): Promise<PageResponse<ApiUsageLogDto>> => {
    // Clean up undefined values from filters
    const cleanFilters: Record<string, string | number> = {};
    
    if (filters.service) cleanFilters.service = filters.service;
    if (filters.status) cleanFilters.status = filters.status;
    if (filters.action) cleanFilters.action = filters.action;
    if (filters.startDate) cleanFilters.startDate = filters.startDate;
    if (filters.endDate) cleanFilters.endDate = filters.endDate;
    if (filters.page !== undefined) cleanFilters.page = filters.page;
    if (filters.size !== undefined) cleanFilters.size = filters.size;
    if (filters.sort) cleanFilters.sort = filters.sort;

    const { data } = await api.get(`${API_BASE}/usage-logs`, {
      params: cleanFilters,
    });
    return data;
  },

  /**
   * Export logs as CSV file
   * @param filters - Log filter options (without pagination)
   * @returns Promise<Blob>
   */
  exportLogs: async (
    filters: Omit<LogFilters, 'page' | 'size' | 'sort'>
  ): Promise<Blob> => {
    // Clean up undefined values from filters
    const cleanFilters: Record<string, string> = {};
    
    if (filters.service) cleanFilters.service = filters.service;
    if (filters.status) cleanFilters.status = filters.status;
    if (filters.action) cleanFilters.action = filters.action;
    if (filters.startDate) cleanFilters.startDate = filters.startDate;
    if (filters.endDate) cleanFilters.endDate = filters.endDate;

    const { data } = await api.get(`${API_BASE}/usage-logs/export`, {
      params: cleanFilters,
      responseType: 'blob',
    });
    return data;
  },

  // ==================== User Management APIs ====================

  /**
   * List all users with pagination
   * @param params - Pagination parameters
   * @returns Promise<PageResponse<UserAdminDto>>
   */
  getUsers: async (params: { page?: number; size?: number }) => {
    const { data } = await api.get(`${API_BASE}/users`, { params });
    return data;
  },

  /**
   * Search users by username, email, or role
   * @param params - Search and filter parameters
   * @returns Promise<PageResponse<UserAdminDto>>
   */
  searchUsers: async (params: { 
    query?: string; 
    role?: string; 
    page?: number; 
    size?: number;
  }) => {
    const { data } = await api.get(`${API_BASE}/users/search`, { params });
    return data;
  },

  /**
   * Get single user by ID
   * @param userId - User ID
   * @returns Promise<UserAdminDto>
   */
  getUser: async (userId: string) => {
    const { data } = await api.get(`${API_BASE}/users/${userId}`);
    return data;
  },

  /**
   * Get user activity statistics
   * @param userId - User ID
   * @returns Promise<UserActivityDto>
   */
  getUserActivity: async (userId: string) => {
    const { data } = await api.get(`${API_BASE}/users/${userId}/activity`);
    return data;
  },

  /**
   * Update user roles
   * @param userId - User ID
   * @param roles - Array of role names
   * @returns Promise<UserAdminDto>
   */
  updateUserRoles: async (userId: string, roles: string[]) => {
    const { data } = await api.put(`${API_BASE}/users/${userId}/roles`, roles, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  },

  /**
   * Delete user by ID
   * @param userId - User ID
   * @returns Promise<void>
   */
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`${API_BASE}/users/${userId}`);
  },

  /**
   * Create new user with temporary password
   * @param userData - User creation request data
   * @returns Promise<UserAdminDto>
   */
  createUser: async (userData: {
    username: string;
    email: string;
    temporaryPassword: string;
    roles: string[];
    phoneNumber?: string;
    company?: string;
    location?: string;
    position?: string;
  }) => {
    const { data } = await api.post(`${API_BASE}/users`, userData);
    return data;
  },

  /**
   * Get inactive users (no activity in 24h)
   * @returns Promise<UserProfileResponse[]>
   */
  getInactiveUsers: async () => {
    const { data } = await api.get(`${API_BASE}/users/inactive`);
    return data;
  },

  /**
   * Get dashboard user counts
   * @returns Promise<DashboardUserCountResponse>
   */
  getDashboardCounts: async () => {
    const { data } = await api.get(`${API_BASE}/dashboard/counts`);
    return data;
  },

  /**
   * Block a user by ID
   * @param userId - User ID to block
   * @param reason - Reason for blocking
   * @returns Promise<BlockUserResponse>
   */
  blockUser: async (userId: string, reason: string) => {
    const { data } = await api.post(`${API_BASE}/users/${userId}/block`, {
      reason,
    });
    return data;
  },

  /**
   * Unblock a user by ID
   * @param userId - User ID to unblock
   * @returns Promise<UnblockUserResponse>
   */
  unblockUser: async (userId: string) => {
    const { data } = await api.post(`${API_BASE}/users/${userId}/unblock`);
    return data;
  },

  // ==================== API Key Management APIs ====================

  /**
   * Get all API keys with pagination and filtering
   * @param filters - Filter options (page, size for pagination)
   * @returns Promise<AdminApiKeyListResponse>
   */
  getAdminApiKeys: async (
    filters: AdminApiKeyFilters = {}
  ): Promise<AdminApiKeyListResponse> => {
    const params: Record<string, number> = {
      page: filters.page ?? 0,
      size: filters.size ?? 20,
    };

    const { data } = await api.get('/settings/api-keys/admin', {
      params,
    });
    return data;
  },

  /**
   * Revoke an API key by ID
   * @param keyId - The API key ID to revoke
   * @returns Promise<void>
   */
  revokeApiKey: async (keyId: string): Promise<void> => {
    await api.delete(`/settings/api-keys/admin/${keyId}`);
  },
};

// Export default
export default adminApi;
