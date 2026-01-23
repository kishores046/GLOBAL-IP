/**
 * Admin Monitoring Dashboard Types
 * TypeScript interfaces for Admin API responses
 */

// ==================== Overview Types ====================
export interface AdminOverviewDto {
  totalUsers: number;
  activeUsers: number;
  requestsToday: number;
  errorsToday: number;
  topService: string;
  topAction: string;
}

// ==================== API Health Types ====================
export type ApiServiceType = "EPO" | "USPTO" | "TRADEMARK" | "TRENDS";
export type HealthStatusType = "HEALTHY" | "WARNING" | "ERROR" | "UNKNOWN";
export type OverallHealthType = "Excellent" | "Good" | "Degraded" | "Critical";

export interface ApiHealthStatus {
  service: ApiServiceType;
  status: HealthStatusType;
  avgLatencyMs: number;
  errorRate: number; // 0-1 decimal
  uptime: number; // 0-100 percentage
  lastSync: string; // "2 mins ago", "Just now", etc.
}

export interface SystemHealthSummary {
  operationalStatus: string; // "3 out of 4 APIs operational"
  avgLatency: number;
  totalRequests: number;
  overallHealth: OverallHealthType;
}

// ==================== Error Summary Types ====================
export interface ErrorSummaryDto {
  service: string;
  total: number;
  errors: number;
  rate: number; // 0-1 decimal
}

// ==================== Usage Logs Types ====================
export type LogStatusType = "SUCCESS" | "ERROR";

export interface ApiUsageLogDto {
  id: number;
  timestamp: string; // ISO format
  service: string;
  action: string;
  status: LogStatusType;
  responseTimeMs: number;
  userId: string;
}

export interface LogFilters {
  service?: string; // "EPO", "USPTO", "TRADEMARK", "TRENDS", or null
  status?: string; // "SUCCESS", "ERROR", or null
  action?: string;
  startDate?: string; // ISO format
  endDate?: string; // ISO format
  page?: number; // default: 0
  size?: number; // default: 20
  sort?: string; // default: "timestamp,desc"
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page
}

// ==================== UI Component Props ====================
export interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: number; // percentage change
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  loading?: boolean;
}

export interface HealthStatusCardProps {
  service: ApiServiceType;
  status: HealthStatusType;
  uptime: number;
  latency: number;
  lastSync: string;
  errorRate?: number;
  onClick?: () => void;
}

export interface StatusBadgeProps {
  status: LogStatusType;
  size?: "sm" | "md" | "lg";
}

export interface ServiceBadgeProps {
  service: string;
  size?: "sm" | "md";
}

// ==================== Chart Data Types ====================
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ServiceTrendData {
  date: string;
  [key: string]: number | string; // Dynamic service names
}

export interface ErrorTrendData {
  date: string;
  EPO?: number;
  USPTO?: number;
  TRADEMARK?: number;
  TRENDS?: number;
}

// ==================== User Management Types ====================

export interface UserAdminDto {
  id: string;
  username: string;
  email: string;
  roles: string[];  // ["USER", "ADMIN", etc.]
  createdAt: string;  // ISO format
  updatedAt: string;  // ISO format
}

export interface UserActivityDto {
  username: string;
  email: string;
  requestsLast24h: number;
  requestsLast7d: number;
  requestsLast30d: number;
  lastActivity: string | null;  // ISO format or null
  mostUsedService: string;  // "EPO" | "USPTO" | "TRADEMARK" | "TRENDS" | "N/A"
}

export interface UserProfileResponse {
  username: string;
  email: string;
  roles: string[];
  phoneNumber: string;
  company: string;
  location: string;
  position: string;
  bio: string;
}

export interface DashboardUserCountResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface BlockUserResponse {
  userId: string;
  email: string;
  blocked: boolean;
  blockReason: string;
  blockedAt: string;
  message: string;
}

export interface UnblockUserResponse {
  userId: string;
  email: string;
  blocked: boolean;
  message: string;
  unblockTime?: string;
}

export interface UserSearchParams {
  query?: string;    // Search by username or email
  role?: string;     // Filter by role: "USER" | "ADMIN" | etc.
  page?: number;     // default: 0
  size?: number;     // default: 10
}

// ==================== Admin API Key Management Types ====================

export type ApiKeyStatus = 'ACTIVE' | 'REVOKED';

export interface AdminApiKeyResponse {
  id: string;
  userId: string;
  name: string;
  maskedKey: string; // e.g., "abcd••••••••••1234"
  status: ApiKeyStatus;
  createdAt: string; // ISO format
  lastUsedAt?: string | null; // ISO format, optional
}

export interface AdminApiKeyListResponse {
  content: AdminApiKeyResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
}

export interface AdminApiKeyFilters {
  page?: number; // default: 0
  size?: number; // default: 20
}

export interface RevokeApiKeyRequest {
  id: string;
}
