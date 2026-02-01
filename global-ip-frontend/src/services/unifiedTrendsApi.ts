import api from './api';
import { FilingTrendData, CountryTrendData } from '../types/unifiedTrends';

// Use the centralized axios instance which is already configured with:
// - Base URL from environment variables
// - JWT interceptor
// - Error handling

const API_BASE = '/analyst/unified/trends';

/**
 * Unified Trends API
 * Provides aggregated analytics data for visualization
 */
export const unifiedTrendsApi = {
  /**
   * Get filing trends over time
   * Returns yearly data with PatentsView and EPO counts
   */
  async getFilingTrends(): Promise<FilingTrendData[]> {
    try {
      const response = await api.get<FilingTrendData[]>(`${API_BASE}/filings`);
      console.log('Filing trends data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching filing trends:', error);
      throw error;
    }
  },

  /**
   * Get country distribution data
   * Returns patent counts by country for PatentsView and EPO
   */
  async getCountryTrends(): Promise<CountryTrendData[]> {
    try {
      const response = await api.get<CountryTrendData[]>(`${API_BASE}/countries`);
      console.log('Country trends data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching country trends:', error);
      throw error;
    }
  }
};
