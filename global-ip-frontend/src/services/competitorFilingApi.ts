/**
 * Competitor Filings API Service
 * Handles all competitor filing and analytics API calls
 */

import api from './api';

// DTOs from backend
export interface FilingTrendDTO {
  competitorCode: string;
  competitorName: string;
  count: number;
  periodStart: string;
  periodEnd: string;
}

export interface CompetitorFilingDTO {
  id: number;
  competitorId: number;
  competitorCode: string;
  competitorName: string;
  patentId: string;
  title: string;
  publicationDate: string;
  jurisdiction: string;
  filedBy: string;
  currentOwner: string;
  filingType: string;
  status: string;
  fetchedAt: string;
}

export interface CompetitorSyncResult {
  competitorCode: string;
  newFilings: number;
  duplicates: number;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
}

export interface SyncResultDTO {
  syncStarted: string;
  syncCompleted: string;
  competitorsProcessed: number;
  newFilingsFound: number;
  duplicatesSkipped: number;
  details: CompetitorSyncResult[];
}

export interface FilingSummaryDTO {
  totalFilings: number;
  oldestFilingDate: string | null;
  newestFilingDate: string | null;
}

export interface FilingSearchRequest {
  competitorId?: number;
  jurisdiction?: string;
  filingType?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const competitorFilingApi = {
  /**
   * Sync latest filings from date
   * POST /api/competitors/filings/sync?fromDate=YYYY-MM-DD
   */
  syncLatestFilings: async (fromDate: string): Promise<SyncResultDTO> => {
    const response = await api.post<SyncResultDTO>('/competitors/filings/sync', null, {
      params: { fromDate },
    });
    return response.data;
  },

  /**
   * Get filing trends
   * GET /api/competitors/filings/trends?fromDate=YYYY-MM-DD
   */
  getFilingTrends: async (fromDate: string = '2020-01-01'): Promise<FilingTrendDTO[]> => {
    const response = await api.get<FilingTrendDTO[]>('/competitors/filings/trends', {
      params: { fromDate },
    });
    return response.data || [];
  },

  /**
   * Get monthly filing trends aggregation
   * GET /api/competitors/filings/trends/monthly?fromDate=YYYY-MM-DD
   */
  getMonthlyFilingTrends: async (fromDate: string): Promise<Record<string, Record<string, number>>> => {
    const response = await api.get<Record<string, Record<string, number>>>(
      '/competitors/filings/trends/monthly',
      {
        params: { fromDate },
      }
    );
    return response.data || {};
  },

  /**
   * Get filing summary KPIs
   * GET /api/competitors/filings/summary
   */
  getFilingSummary: async (): Promise<FilingSummaryDTO> => {
    const response = await api.get<FilingSummaryDTO>('/competitors/filings/summary');
    return response.data;
  },

  /**
   * Get filings for specific competitor (non-paginated)
   * GET /api/competitors/filings/competitor/{competitorId}
   */
  getFilingsForCompetitor: async (competitorId: number): Promise<CompetitorFilingDTO[]> => {
    const response = await api.get<CompetitorFilingDTO[]>(
      `/competitors/filings/competitor/${competitorId}`
    );
    return response.data || [];
  },

  /**
   * Get filings for specific competitor (paginated)
   * GET /api/competitors/filings/competitor/{competitorId}/page?page=0&size=50
   */
  getFilingsForCompetitorPaginated: async (
    competitorId: number,
    page: number = 0,
    size: number = 50
  ): Promise<PaginatedResponse<CompetitorFilingDTO>> => {
    const response = await api.get<PaginatedResponse<CompetitorFilingDTO>>(
      `/competitors/filings/competitor/${competitorId}/page`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  /**
   * Search filings with advanced filters
   * POST /api/competitors/filings/search
   */
  searchFilings: async (request: FilingSearchRequest): Promise<PaginatedResponse<CompetitorFilingDTO>> => {
    const response = await api.post<PaginatedResponse<CompetitorFilingDTO>>(
      '/competitors/filings/search',
      request
    );
    return response.data;
  },

  /**
   * Get total competitor tracking count
   * GET /api/competitors/tracking/total-count
   */
  getTotalTrackingCount: async (): Promise<number> => {
    try {
      console.log('📊 Fetching total competitor tracking count from /api/competitors/tracking/total-count');
      const response = await api.get<number>('/competitors/tracking/total-count');
      console.log('✅ Total competitor tracking count response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch total competitor tracking count:');
      console.error('  Status:', error.response?.status);
      console.error('  StatusText:', error.response?.statusText);
      console.error('  Data:', error.response?.data);
      console.error('  Message:', error.message);
      throw error;
    }
  },
};

export default competitorFilingApi;
