import axios from 'axios';
import {
  FilingTrendResponse,
  TechnologyTrendResponse,
  AssigneeTrendResponse,
  CountryTrendResponse,
  CitationTrendResponse,
  PatentQualityResponse,
  TrendAnalysisReport,
  TrendFilterOptions,
} from '../types/trends';

const API_BASE_URL = 'http://localhost:8080/api/analyst';

// Create dedicated axios instance for trend analysis
const trendApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
trendApi.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] Making request to: ${config.baseURL}${config.url}`, { 
      params: config.params,
      method: config.method 
    });
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Add response error logging
trendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Cache for trend data (prevents excessive API calls)
interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number; // time-to-live in milliseconds
}

const trendCache: Map<string, CacheEntry> = new Map();

const generateCacheKey = (endpoint: string, filters?: TrendFilterOptions): string => {
  return `${endpoint}:${JSON.stringify(filters || {})}`;
};

const isCacheValid = (cacheKey: string): boolean => {
  const entry = trendCache.get(cacheKey);
  if (!entry) return false;
  return Date.now() - entry.timestamp < entry.ttl;
};

const getCachedData = (cacheKey: string): unknown => {
  if (isCacheValid(cacheKey)) {
    return trendCache.get(cacheKey)?.data ?? null;
  }
  trendCache.delete(cacheKey);
  return null;
};

const setCacheData = (cacheKey: string, data: unknown, ttl: number = 5 * 60 * 1000): void => {
  trendCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

export const trendAnalysisAPI = {
  // Filing & Grant Trends
  getFilingTrends: async (filters?: TrendFilterOptions): Promise<FilingTrendResponse> => {
    const cacheKey = generateCacheKey('filings', filters);
    const cached = getCachedData(cacheKey) as FilingTrendResponse | null;
    if (cached) {
      console.log('[API] Returning cached filing trends');
      return cached;
    }

    try {
      console.log('[API] Fetching filing trends with filters:', filters);
      const response = await trendApi.get<FilingTrendResponse>('/trend/filings', {
        params: filters,
      });
      console.log('[API] Filing trends response:', response.data);
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching filing trends:', error);
      return { data: [], period: { startYear: filters?.startYear || 2000, endYear: filters?.endYear || new Date().getFullYear() } };
    }
  },

  getGrantTrends: async (filters?: TrendFilterOptions): Promise<FilingTrendResponse> => {
    const cacheKey = generateCacheKey('grants', filters);
    const cached = getCachedData(cacheKey) as FilingTrendResponse | null;
    if (cached) return cached;

    try {
      const response = await trendApi.get<FilingTrendResponse>('/trend/grants', {
        params: filters,
      });
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching grant trends:', error);
      return { data: [], period: { startYear: filters?.startYear || 2000, endYear: filters?.endYear || new Date().getFullYear() } };
    }
  },

  // Technology Trends
  getTechnologyTrends: async (filters?: TrendFilterOptions, limit: number = 10): Promise<TechnologyTrendResponse> => {
    const cacheKey = generateCacheKey('technologies/top', filters) + `:limit:${limit}`;
    const cached = getCachedData(cacheKey) as TechnologyTrendResponse | null;
    if (cached) return cached;

    try {
      const response = await trendApi.get<TechnologyTrendResponse>('/trend/technologies/top', {
        params: { ...filters, limit },
      });
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching technology trends:', error);
      return { topTechnologies: [], evolutionData: [] };
    }
  },

  getTechnologyEvolution: async (filters?: TrendFilterOptions): Promise<TechnologyTrendResponse> => {
    const cacheKey = generateCacheKey('technologies/evolution', filters);
    const cached = getCachedData(cacheKey) as TechnologyTrendResponse | null;
    if (cached) return cached;

    try {
      const response = await trendApi.get<TechnologyTrendResponse>('/trend/technologies/evolution', {
        params: filters,
      });
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching technology evolution:', error);
      return { topTechnologies: [], evolutionData: [] };
    }
  },

  // Assignee Trends
  getTopAssignees: async (filters?: TrendFilterOptions, limit: number = 10): Promise<AssigneeTrendResponse> => {
    const cacheKey = generateCacheKey('assignees/top', filters) + `:limit:${limit}`;
    const cached = getCachedData(cacheKey) as AssigneeTrendResponse | null;
    if (cached) return cached;

    try {
      const response = await trendApi.get<AssigneeTrendResponse>('/trend/assignees/top', {
        params: { ...filters, limit },
      });
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching top assignees:', error);
      return { topAssignees: [], totalAssignees: 0 };
    }
  },

  // Geographic Trends
  getCountryTrends: async (filters?: TrendFilterOptions, limit: number = 10): Promise<CountryTrendResponse> => {
    const startDate = filters?.startYear 
      ? `${filters.startYear}-01-01`
      : new Date(new Date().getFullYear() - 10, 0, 1).toISOString().split('T')[0];
    
    const cacheKey = generateCacheKey('countries', filters) + `:startDate:${startDate}:limit:${limit}`;
    const cached = getCachedData(cacheKey) as CountryTrendResponse | null;
    if (cached) return cached;

    try {
      const response = await trendApi.get<CountryTrendResponse>('/trend/countries', {
        params: { startDate, limit },
      });
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching country trends:', error);
      return { countries: [], totalCountries: 0 };
    }
  },

  // Citation Analytics
  getCitationTrends: async (filters?: TrendFilterOptions, limit: number = 10): Promise<CitationTrendResponse> => {
    const cacheKey = generateCacheKey('citations', filters) + `:limit:${limit}`;
    const cached = getCachedData(cacheKey) as CitationTrendResponse | null;
    if (cached) return cached;

    try {
      const topCited = await trendApi.get('/trend/citations/top-cited', {
        params: { limit },
      });
      const topCiting = await trendApi.get('/trend/citations/top-citing', {
        params: { limit },
      });

      console.log('[API] Top Cited raw response:', topCited.data);
      console.log('[API] Top Citing raw response:', topCiting.data);

      const result = {
        topCited: topCited.data,
        topCiting: topCiting.data,
      };
      setCacheData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching citation trends:', error);
      return { topCited: [], topCiting: [] };
    }
  },

  // Patent Quality & Complexity
  getPatentTypeDistribution: async (): Promise<any[]> => {
    const cacheKey = generateCacheKey('patents/type-distribution', {});
    const cached = getCachedData(cacheKey) as any[] | null;
    if (cached) {
      console.log('[API] Returning cached patent type distribution');
      return cached;
    }

    try {
      console.log('[API] Fetching patent type distribution');
      const response = await trendApi.get<any[]>('/trend/patents/type-distribution');
      console.log('[API] Patent type distribution response:', response.data);
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching patent type distribution:', error);
      return [];
    }
  },

  getClaimComplexity: async (): Promise<any[]> => {
    const cacheKey = generateCacheKey('patents/claim-complexity', {});
    const cached = getCachedData(cacheKey) as any[] | null;
    if (cached) {
      console.log('[API] Returning cached claim complexity');
      return cached;
    }

    try {
      console.log('[API] Fetching claim complexity');
      const response = await trendApi.get<any[]>('/trend/patents/claim-complexity');
      console.log('[API] Claim complexity response:', response.data);
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching claim complexity:', error);
      return [];
    }
  },

  getTimeToGrant: async (): Promise<any[]> => {
    const cacheKey = generateCacheKey('patents/time-to-grant', {});
    const cached = getCachedData(cacheKey) as any[] | null;
    if (cached) {
      console.log('[API] Returning cached time to grant');
      return cached;
    }

    try {
      console.log('[API] Fetching time to grant');
      const response = await trendApi.get<any[]>('/trend/patents/time-to-grant');
      console.log('[API] Time to grant response:', response.data);
      setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching time to grant:', error);
      return [];
    }
  },

  getPatentQuality: async (filters?: TrendFilterOptions): Promise<PatentQualityResponse> => {
    const cacheKey = generateCacheKey('quality', filters);
    const cached = getCachedData(cacheKey) as PatentQualityResponse | null;
    if (cached) return cached;

    try {
      const typeDistribution = await trendApi.get('/trend/patents/type-distribution', {
        params: filters,
      });
      const claimComplexity = await trendApi.get('/trend/patents/claim-complexity', {
        params: filters,
      });
      const timeToGrant = await trendApi.get('/trend/patents/time-to-grant', {
        params: filters,
      });

      const result = {
        typeDistribution: typeDistribution.data,
        claimComplexity: claimComplexity.data,
        timeToGrant: timeToGrant.data,
      };
      setCacheData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching patent quality data:', error);
      // Return empty/fallback data instead of throwing to prevent component crash
      const fallbackResult: PatentQualityResponse = {
        typeDistribution: [],
        claimComplexity: [],
        timeToGrant: [],
      };
      return fallbackResult;
    }
  },

  // Composite Report
  getFullTrendReport: async (filters?: TrendFilterOptions): Promise<TrendAnalysisReport> => {
    const cacheKey = generateCacheKey('full-report', filters);
    const cached = getCachedData(cacheKey) as TrendAnalysisReport | null;
    if (cached) return cached;

    try {
      const [filingTrends, technologyTrends, assigneeTrends, countryTrends, citationTrends, qualityTrends] = await Promise.allSettled([
        trendAnalysisAPI.getFilingTrends(filters),
        trendAnalysisAPI.getTechnologyEvolution(filters),
        trendAnalysisAPI.getTopAssignees(filters),
        trendAnalysisAPI.getCountryTrends(filters),
        trendAnalysisAPI.getCitationTrends(filters),
        trendAnalysisAPI.getPatentQuality(filters),
      ]);

      const report: TrendAnalysisReport = {
        reportDate: new Date().toISOString(),
        filingTrends: filingTrends.status === 'fulfilled' ? filingTrends.value : { data: [], period: { startYear: filters?.startYear || 2000, endYear: filters?.endYear || new Date().getFullYear() } },
        technologyTrends: technologyTrends.status === 'fulfilled' ? technologyTrends.value : { topTechnologies: [], evolutionData: [] },
        assigneeTrends: assigneeTrends.status === 'fulfilled' ? assigneeTrends.value : { topAssignees: [], totalAssignees: 0 },
        countryTrends: countryTrends.status === 'fulfilled' ? countryTrends.value : { countries: [], totalCountries: 0 },
        citationTrends: citationTrends.status === 'fulfilled' ? citationTrends.value : { topCited: [], topCiting: [] },
        qualityTrends: qualityTrends.status === 'fulfilled' ? qualityTrends.value : { typeDistribution: [], claimComplexity: [], timeToGrant: [] },
      };

      setCacheData(cacheKey, report, 10 * 60 * 1000); // 10-minute cache for full report
      return report;
    } catch (error) {
      console.error('Error fetching full trend report:', error);
      // Return empty report structure instead of throwing
      return {
        reportDate: new Date().toISOString(),
        filingTrends: { data: [], period: { startYear: filters?.startYear || 2000, endYear: filters?.endYear || new Date().getFullYear() } },
        technologyTrends: { topTechnologies: [], evolutionData: [] },
        assigneeTrends: { topAssignees: [], totalAssignees: 0 },
        countryTrends: { countries: [], totalCountries: 0 },
        citationTrends: { topCited: [], topCiting: [] },
        qualityTrends: { typeDistribution: [], claimComplexity: [], timeToGrant: [] },
      };
    }
  },

  // Unified Country Trends (combines PatentsView and EPO counts)
  getUnifiedCountryTrends: async (): Promise<any[]> => {
    const cacheKey = 'unified-countries';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('🌍 Fetching unified country trends from /unified/trends/countries');
      const response = await trendApi.get<any[]>('/unified/trends/countries');
      console.log('✅ Unified country trends response:', response.data);
      
      // Transform the data: combine counts and filter out WO
      const transformedData = (response.data || [])
        .filter((item: any) => item.country !== 'WO') // Filter out World (WO)
        .map((item: any) => ({
          countryName: item.country,
          patentCount: (item.patentsViewCount || 0) + (item.epoCount || 0), // Combine both counts
          patentsViewCount: item.patentsViewCount || 0,
          epoCount: item.epoCount || 0,
          ...item,
        }))
        .sort((a: any, b: any) => b.patentCount - a.patentCount); // Sort by combined count descending
      
      setCacheData(cacheKey, transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error fetching unified country trends:', error);
      return [];
    }
  },

  // EPO Family Trends
  getEpoFamilyTrends: async (): Promise<any[]> => {
    const cacheKey = 'epo-family-trends';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('👨‍👩‍👧‍👦 Fetching EPO family trends');
      const response = await trendApi.get<any[]>('/epo/trends/families');
      console.log('✅ EPO family trends response:', response.data);
      
      // Transform the data
      const transformedData = (response.data || [])
        .map((item: any) => ({
          familySize: item.familySize || 0,
          familyCount: item.familyCount || 0,
          name: `Family Size ${item.familySize}`,
          count: item.familyCount || 0,
          ...item,
        }))
        .sort((a: any, b: any) => a.familySize - b.familySize); // Sort by family size ascending
      
      setCacheData(cacheKey, transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error fetching EPO family trends:', error);
      return [];
    }
  },

  // Utility: Clear cache
  clearCache: (): void => {
    trendCache.clear();
  },

  // Utility: Clear specific cache entry
  clearCacheEntry: (endpoint: string, filters?: TrendFilterOptions): void => {
    const cacheKey = generateCacheKey(endpoint, filters);
    trendCache.delete(cacheKey);
  },
};

export default trendAnalysisAPI;
