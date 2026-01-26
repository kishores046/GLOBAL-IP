import axios from 'axios';
import {
  TrademarkSummaryResponse,
  ClassificationTrendsResponse,
  GeographicTrendsResponse,
  StatusDistributionResponse,
  AggregatedTrademarkTrendData,
  TrademarkTrendFilterOptions,
} from '../types/trademark-trends';

const API_BASE_URL = 'http://localhost:8080/api/trends/trademarks';

// Create dedicated axios instance for trademark trend analysis
const trademarkTrendApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
trademarkTrendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handling
trademarkTrendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Trademark trend API error:', error.response?.data || error.message);
    throw error;
  }
);

// Cache system for trademark data
interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number; // time-to-live in milliseconds
}

const trademarkCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes default

const generateCacheKey = (endpoint: string, filters?: TrademarkTrendFilterOptions): string => {
  return `trademark:${endpoint}:${JSON.stringify(filters || {})}`;
};

const isCacheValid = (cacheKey: string): boolean => {
  const entry = trademarkCache.get(cacheKey);
  if (!entry) return false;
  return Date.now() - entry.timestamp < entry.ttl;
};

const getCachedData = (cacheKey: string): unknown | null => {
  if (isCacheValid(cacheKey)) {
    return trademarkCache.get(cacheKey)?.data || null;
  }
  trademarkCache.delete(cacheKey);
  return null;
};

const setCacheData = (cacheKey: string, data: unknown, ttl: number = CACHE_TTL): void => {
  trademarkCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

export const trademarkTrendAPI = {
  /**
   * Fetch trademark summary metrics
   * Provides total applications, filings by year, and recent activity
   */
  getSummary: async (filters?: TrademarkTrendFilterOptions): Promise<TrademarkSummaryResponse> => {
    const cacheKey = generateCacheKey('summary', filters);
    const cached = getCachedData(cacheKey) as TrademarkSummaryResponse | null;
    if (cached) {
      console.log('📊 Using cached trademark summary data');
      return cached;
    }

    try {
      console.log('🔄 Fetching trademark summary...');
      const response = await trademarkTrendApi.get<any>('/summary', {
        params: filters,
      });
      // Backend returns raw data, we need to wrap it
      const wrappedResponse: TrademarkSummaryResponse = {
        data: response.data,
      };
      setCacheData(cacheKey, wrappedResponse);
      return wrappedResponse;
    } catch (error) {
      console.error('❌ Error fetching trademark summary:', error);
      throw error;
    }
  },

  /**
   * Fetch top trademark classes (International Classification)
   * Shows business sectors with highest branding activity
   */
  getTopClasses: async (filters?: TrademarkTrendFilterOptions): Promise<ClassificationTrendsResponse> => {
    // Always fetch fresh data (bypass cache)
    try {
      console.log('🔄 Fetching top trademark classes (no cache)...');
      const response = await trademarkTrendApi.get<any>('/classes/top', {
        params: filters,
      });
      const wrappedResponse: ClassificationTrendsResponse = {
        data: Array.isArray(response.data) ? response.data : [],
      };
      return wrappedResponse;
    } catch (error) {
      console.error('❌ Error fetching trademark classes:', error);
      throw error;
    }
  },

  /**
   * Fetch top countries by trademark filings
   * Shows geographic concentration of brand ownership
   */
  getTopCountries: async (filters?: TrademarkTrendFilterOptions): Promise<GeographicTrendsResponse> => {
    // Always fetch fresh data (bypass cache)
    try {
      console.log('🔄 Fetching top trademark countries (no cache)...');
      const response = await trademarkTrendApi.get<any>('/countries/top', {
        params: filters,
      });
      const wrappedResponse: GeographicTrendsResponse = {
        data: Array.isArray(response.data) ? response.data : [],
      };
      return wrappedResponse;
    } catch (error) {
      console.error('❌ Error fetching trademark countries:', error);
      throw error;
    }
  },

  /**
   * Fetch trademark status distribution (LIVE, DEAD, etc.)
   * Shows brand lifecycle health and longevity
   */
  getStatusDistribution: async (filters?: TrademarkTrendFilterOptions): Promise<StatusDistributionResponse> => {
    const cacheKey = generateCacheKey('statusDistribution', filters);
    const cached = getCachedData(cacheKey) as StatusDistributionResponse | null;
    if (cached) {
      console.log('📊 Using cached trademark status data');
      return cached;
    }

    try {
      console.log('🔄 Fetching trademark status distribution...');
      const response = await trademarkTrendApi.get<any>('/status', {
        params: filters,
      });
      // Backend returns array directly, wrap it
      const wrappedResponse: StatusDistributionResponse = {
        data: Array.isArray(response.data) ? response.data : [],
      };
      setCacheData(cacheKey, wrappedResponse);
      return wrappedResponse;
    } catch (error) {
      console.error('❌ Error fetching trademark status:', error);
      throw error;
    }
  },

  /**
   * Fetch all trademark trend data in one call
   * Aggregates summary, classes, countries, and status for comprehensive analysis
   */
  getAllTrendData: async (filters?: TrademarkTrendFilterOptions): Promise<AggregatedTrademarkTrendData> => {
    try {
      console.log('🔄 Aggregating all trademark trend data...');
      const [summary, classes, countries, status] = await Promise.all([
        trademarkTrendAPI.getSummary(filters),
        trademarkTrendAPI.getTopClasses(filters),
        trademarkTrendAPI.getTopCountries(filters),
        trademarkTrendAPI.getStatusDistribution(filters),
      ]);

      const aggregatedData: AggregatedTrademarkTrendData = {
        summary: summary.data,
        topClasses: classes.data,
        topCountries: countries.data,
        statusDistribution: status.data,
        timestamp: new Date().toISOString(),
      };

      console.log('✅ Successfully aggregated trademark trend data');
      return aggregatedData;
    } catch (error) {
      console.error('❌ Error aggregating trademark trend data:', error);
      throw error;
    }
  },

  /**
   * Clear cache (useful for manual refresh)
   */
  clearCache: (): void => {
    trademarkCache.clear();
    console.log('🧹 Trademark trend cache cleared');
  },
};

export default trademarkTrendAPI;
