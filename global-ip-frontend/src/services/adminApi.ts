/**
 * Admin API Service
 * Handles all API calls for Admin Monitoring Dashboard
 */

import axios from 'axios';
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

const BASE_URL = 'http://localhost:8080/api/admin';

// Create axios instance with base configuration
const adminApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// Add response interceptor for error handling
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Admin API Error:', error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

/**
 * Admin API Service
 */
export const adminApi = {
  /**
   * Get system overview metrics
   * @returns Promise<AdminOverviewDto>
   */
  getOverview: async (): Promise<AdminOverviewDto> => {
    const { data } = await adminApiClient.get('/overview');
    return data;
  },

  /**
   * Get individual API health status
   * @returns Promise<ApiHealthStatus[]>
   */
  getHealth: async (): Promise<ApiHealthStatus[]> => {
    const { data } = await adminApiClient.get('/health');
    return data;
  },

  /**
   * Get overall system health summary
   * @returns Promise<SystemHealthSummary>
   */
  getHealthSummary: async (): Promise<SystemHealthSummary> => {
    const { data } = await adminApiClient.get('/health/summary');
    return data;
  },

  /**
   * Get error summary by service
   * @returns Promise<ErrorSummaryDto[]>
   */
  getErrorSummary: async (): Promise<ErrorSummaryDto[]> => {
    const { data } = await adminApiClient.get('/errors');
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

    const { data } = await adminApiClient.get('/usage-logs', {
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

    const { data } = await adminApiClient.get('/usage-logs/export', {
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
    const { data } = await adminApiClient.get('/users', { params });
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
    const { data } = await adminApiClient.get('/users/search', { params });
    return data;
  },

  /**
   * Get single user by ID
   * @param userId - User ID
   * @returns Promise<UserAdminDto>
   */
  getUser: async (userId: string) => {
    const { data } = await adminApiClient.get(`/users/${userId}`);
    return data;
  },

  /**
   * Get user activity statistics
   * @param userId - User ID
   * @returns Promise<UserActivityDto>
   */
  getUserActivity: async (userId: string) => {
    const { data } = await adminApiClient.get(`/users/${userId}/activity`);
    return data;
  },

  /**
   * Update user roles
   * @param userId - User ID
   * @param roles - Array of role names
   * @returns Promise<UserAdminDto>
   */
  updateUserRoles: async (userId: string, roles: string[]) => {
    const { data } = await adminApiClient.put(`/users/${userId}/roles`, roles, {
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
    await adminApiClient.delete(`/users/${userId}`);
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
    const { data } = await adminApiClient.post('/users', userData);
    return data;
  },

  /**
   * Get inactive users (no activity in 24h)
   * @returns Promise<UserProfileResponse[]>
   */
  getInactiveUsers: async () => {
    const { data } = await adminApiClient.get('/users/inactive');
    return data;
  },

  /**
   * Get dashboard user counts
   * @returns Promise<DashboardUserCountResponse>
   */
  getDashboardCounts: async () => {
    const { data } = await adminApiClient.get('/dashboard/counts');
    return data;
  },

  /**
   * Block a user by ID
   * @param userId - User ID to block
   * @param reason - Reason for blocking
   * @returns Promise<BlockUserResponse>
   */
  blockUser: async (userId: string, reason: string) => {
    const { data } = await adminApiClient.post(`/users/${userId}/block`, {
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
    const { data } = await adminApiClient.post(`/users/${userId}/unblock`);
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
