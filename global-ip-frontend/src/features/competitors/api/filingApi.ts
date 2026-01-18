/**
 * Filing API Service
 * Handles all competitor filing management API calls
 */

import axios from 'axios';
import type {
  CompetitorFilingDTO,
  PageableResponse,
  FilingSearchRequest,
  FilingSearchResponse,
  FilingSummaryDTO,
  FilingTrendDTO,
  MonthlyTrendsMap,
  SyncResultDTO,
  SyncTriggerRequest,
  ApiErrorResponse,
} from '../types';

// Create axios instance with backend base URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Add JWT interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const API_BASE_URL = '/api/competitors/filings';

/**
 * Filing API service for filing operations and analytics
 */
export const filingApi = {
  /**
   * Get all filings for a specific competitor (non-paginated)
   */
  async getByCompetitor(competitorId: number): Promise<CompetitorFilingDTO[]> {
    try {
      const { data } = await api.get<CompetitorFilingDTO[]>(
        `${API_BASE_URL}/competitor/${competitorId}`
      );
      return data;
    } catch (error) {
      handleApiError(error, `Failed to fetch filings for competitor ${competitorId}`);
    }
  },

  /**
   * Get paginated filings for a specific competitor
   */
  async getByCompetitorPaginated(
    competitorId: number,
    page: number = 0,
    size: number = 50
  ): Promise<PageableResponse<CompetitorFilingDTO>> {
    try {
      const { data } = await api.get<PageableResponse<CompetitorFilingDTO>>(
        `${API_BASE_URL}/competitor/${competitorId}/page`,
        {
          params: { page, size },
        }
      );
      return data;
    } catch (error) {
      handleApiError(
        error,
        `Failed to fetch paginated filings for competitor ${competitorId}`
      );
    }
  },

  /**
   * Search filings with advanced filters
   */
  async search(
    request: FilingSearchRequest
  ): Promise<FilingSearchResponse> {
    try {
      const { data } = await api.post<FilingSearchResponse>(
        `${API_BASE_URL}/search`,
        request
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to search filings');
    }
  },

  /**
   * Get filing summary/dashboard statistics
   */
  async getSummary(): Promise<FilingSummaryDTO> {
    try {
      const { data } = await api.get<FilingSummaryDTO>(
        `${API_BASE_URL}/summary`
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch filing summary');
    }
  },

  /**
   * Get filing trends (with optional date filter)
   */
  async getTrends(fromDate?: string): Promise<FilingTrendDTO[]> {
    try {
      const params = fromDate ? { fromDate } : undefined;
      const { data } = await api.get<FilingTrendDTO[]>(
        `${API_BASE_URL}/trends`,
        { params }
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch filing trends');
    }
  },

  /**
   * Get monthly filing trends
   */
  async getMonthlyTrends(fromDate?: string): Promise<MonthlyTrendsMap> {
    try {
      const params = fromDate ? { fromDate } : undefined;
      const { data } = await api.get<MonthlyTrendsMap>(
        `${API_BASE_URL}/trends/monthly`,
        { params }
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch monthly filing trends');
    }
  },

  /**
   * Trigger sync for all active competitors
   */
  async sync(fromDate: string): Promise<SyncResultDTO> {
    try {
      const { data } = await api.post<SyncResultDTO>(
        `${API_BASE_URL}/sync`,
        {},
        {
          params: { fromDate },
        }
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to trigger filing sync');
    }
  },

  /**
   * Export filings to CSV
   */
  async exportToCsv(
    request: FilingSearchRequest,
    filename: string = 'competitor-filings.csv'
  ): Promise<Blob> {
    try {
      const { data } = await api.post(
        `${API_BASE_URL}/export/csv`,
        request,
        {
          responseType: 'blob',
        }
      );
      return data as Blob;
    } catch (error) {
      handleApiError(error, 'Failed to export filings to CSV');
    }
  },
};

/**
 * Handle API errors with consistent error messages
 */
function handleApiError(error: unknown, fallbackMessage: string): never {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse | undefined;
    const message = apiError?.message || error.message || fallbackMessage;
    throw new Error(message);
  }
  throw new Error(fallbackMessage);
}
