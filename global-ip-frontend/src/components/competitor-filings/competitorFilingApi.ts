import axios from 'axios';
import {
  FilingSummaryDTO,
  FilingTrendDTO,
  MonthlyTrendsMap,
  CompetitorFilingDTO,
  FilingSearchRequest,
  SyncResultDTO,
} from './types';

const BASE_URL = '/api/competitors/filings';

export const competitorFilingApi = {
  syncLatestFilings: async (fromDate: string): Promise<SyncResultDTO> => {
    const response = await axios.post(`${BASE_URL}/sync`, null, {
      params: { fromDate },
    });
    return response.data;
  },

  getFilingSummary: async (): Promise<FilingSummaryDTO> => {
    const response = await axios.get(`${BASE_URL}/summary`);
    return response.data;
  },

  getFilingTrends: async (fromDate: string): Promise<FilingTrendDTO[]> => {
    const response = await axios.get(`${BASE_URL}/trends`, {
      params: { fromDate },
    });
    return response.data;
  },

  getMonthlyTrends: async (fromDate: string): Promise<MonthlyTrendsMap> => {
    const response = await axios.get(`${BASE_URL}/trends/monthly`, {
      params: { fromDate },
    });
    return response.data;
  },

  getFilingsForCompetitor: async (competitorId: number): Promise<CompetitorFilingDTO[]> => {
    const response = await axios.get(`${BASE_URL}/competitor/${competitorId}`);
    return response.data;
  },

  getFilingsForCompetitorPaginated: async (
    competitorId: number,
    page: number = 0,
    size: number = 50
  ): Promise<{ content: CompetitorFilingDTO[]; totalElements: number; totalPages: number }> => {
    const response = await axios.get(`${BASE_URL}/competitor/${competitorId}/page`, {
      params: { page, size },
    });
    return response.data;
  },

  searchFilings: async (
    request: FilingSearchRequest
  ): Promise<{ content: CompetitorFilingDTO[]; totalElements: number; totalPages: number }> => {
    const response = await axios.post(`${BASE_URL}/search`, request);
    return response.data;
  },
};
