import axios from 'axios';
import { FilingTrendData, CountryTrendData } from '../types/unifiedTrends';

// Create axios instance with JWT interceptor
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const API_BASE = '/api/analyst/unified/trends';

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
