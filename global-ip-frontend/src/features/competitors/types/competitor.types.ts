/**
 * Competitor Tracking System - TypeScript Interfaces
 * Defines all data models for competitor management, filing tracking, and analytics
 */

// ==================== TYPE ALIASES ====================

export type Jurisdiction = 'US' | 'EP' | 'BOTH';
export type FilingJurisdiction = 'US' | 'EP';
export type FilingStatus = 'ACTIVE' | 'INACTIVE' | 'PUBLISHED' | 'PENDING' | 'ABANDONED';
export type SyncStatus = 'SUCCESS' | 'FAILED';

// ==================== COMPETITOR MODELS ====================

export interface CompetitorDTO {
  id: number;
  code: string;
  displayName: string;
  assigneeNames: string[];
  active: boolean;
  description?: string;
  industry?: string;
  jurisdiction: Jurisdiction;
  createdAt: string;
  updatedAt: string;
  totalFilings?: number;
}

export interface CompetitorCreateRequest {
  code: string;
  displayName: string;
  assigneeNames: string[];
  description?: string;
  industry?: string;
  jurisdiction?: Jurisdiction;
}

export interface CompetitorUpdateRequest {
  displayName?: string;
  assigneeNames?: string[];
  active?: boolean;
  description?: string;
  industry?: string;
  jurisdiction?: Jurisdiction;
}

export interface CompetitorDetailResponse extends CompetitorDTO {
  filingStats?: {
    totalFilings: number;
    usFilings: number;
    epFilings: number;
    activeFilings: number;
  };
}

// ==================== FILING MODELS ====================

export interface CompetitorFilingDTO {
  id: number;
  competitorId: number;
  competitorCode: string;
  competitorName: string;
  patentId: string;
  title: string;
  publicationDate: string;
  jurisdiction: FilingJurisdiction;
  filedBy: string;
  currentOwner: string;
  filingType?: string;
  status: FilingStatus;
  fetchedAt: string;
}

export interface PageableResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface FilingSearchRequest {
  competitorIds?: number[];
  fromDate?: string;
  toDate?: string;
  jurisdiction?: FilingJurisdiction;
  page?: number;
  size?: number;
  searchTerm?: string;
}

export interface FilingSearchResponse extends PageableResponse<CompetitorFilingDTO> {
  totalFilingCount: number;
}

// ==================== SYNC MODELS ====================

export interface SyncResultDTO {
  syncStarted: string;
  syncCompleted: string;
  competitorsProcessed: number;
  newFilingsFound: number;
  duplicatesSkipped: number;
  details: CompetitorSyncResult[];
}

export interface CompetitorSyncResult {
  competitorCode: string;
  newFilings: number;
  duplicates: number;
  status: SyncStatus;
  errorMessage?: string;
}

export interface SyncTriggerRequest {
  fromDate: string;
}

// ==================== ANALYTICS MODELS ====================

export interface CompetitorFilingSummary {
  competitorCode: string;
  competitorName: string;
  filingCount: number;
  latestFiling?: string;           // ISO date
}

export interface FilingSummaryDTO {
  totalFilings: number;
  competitorsTracked: number;
  oldestFiling?: string;
  newestFiling?: string;
  byCompetitor?: CompetitorFilingSummary[];
  jurisdictionBreakdown?: {
    us: number;
    ep: number;
  };
}

export interface FilingTrendDTO {
  competitorId: number;
  competitorCode: string;
  competitorName: string;
  count: number;
  periodStart?: string;
  periodEnd?: string;
}

export type MonthlyTrendsMap = Record<string, Record<string, number>>;

export interface FilingTrendData {
  [key: string]: string | number;
}

export interface AnalyticsSummaryData {
  totalCompetitors: number;
  totalFilings: number;
  activeCompetitors: number;
  newestFiling?: string;
  oldestFiling?: string;
  jurisdictionBreakdown: {
    us: number;
    ep: number;
  };
}

// ==================== UI STATE MODELS ====================

export interface CompetitorFiltersState {
  activeOnly: boolean;
  searchQuery: string;
  selectedJurisdiction?: Jurisdiction | 'ALL';
  selectedIndustries?: string[];
  sortBy: 'name' | 'code' | 'filings' | 'created';
  sortOrder: 'asc' | 'desc';
}

export interface FilingFiltersState {
  selectedCompetitorIds: number[];
  fromDate?: string;
  toDate?: string;
  jurisdiction?: FilingJurisdiction | 'ALL';
  searchTerm?: string;
  page: number;
  pageSize: 25 | 50 | 100;
}

export interface AnalyticsFiltersState {
  dateRange: 'last30' | 'last90' | 'last1y' | 'custom';
  customFromDate?: string;
  customToDate?: string;
}

// ==================== ERROR HANDLING ====================

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ==================== PAGINATION ====================

export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

// ==================== EXPORT MODELS ====================

export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  includeColumns?: string[];
  filename?: string;
}

// ==================== CHART DATA ====================

export interface CompetitorFilingCountData {
  competitorCode: string;
  competitorName: string;
  count: number;
}

export interface JurisdictionBreakdownData {
  jurisdiction: FilingJurisdiction;
  count: number;
  percentage: number;
}

export type TimeSeriesData = Record<string, string | number>;
