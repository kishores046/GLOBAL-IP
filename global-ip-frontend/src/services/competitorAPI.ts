import api from './api';

/**
 * Competitor API Service
 * Handles competitor management and filing data retrieval
 */

export interface Competitor {
  id: number;
  code: string;
  displayName: string;
  assigneeNames: string[];
  active: boolean;
  description?: string;
  industry?: string;
  createdAt?: string;
  updatedAt?: string;
  totalFilings?: number;
}

export interface CompetitorCreateRequest {
  code: string;
  displayName: string;
  assigneeNames: string[];
  description?: string;
  industry?: string;
}

export interface CompetitorUpdateRequest {
  displayName?: string;
  assigneeNames?: string[];
  active?: boolean;
  description?: string;
  industry?: string;
}

export interface FilingSummary {
  totalFilings: number;
  oldestFilingDate?: string;
  latestFilingDate?: string;
  competitorsTracked: number;
}

export interface MonthlyFilingTrend {
  month: string; // YYYY-MM format
  competitorCode: string;
  competitorName: string;
  filingCount: number;
}

export interface CompetitorFiling {
  id: number;
  patentId: string;
  title: string;
  competitorCode: string;
  competitorName: string;
  publicationDate: string;
  jurisdiction: string;
  assignee?: string;
}

export interface FilingSearchRequest {
  competitorIds?: number[];
  fromDate?: string;
  toDate?: string;
  jurisdiction?: string;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface SyncResult {
  syncStarted: string;
  syncCompleted: string;
  competitorsProcessed: number;
  newFilingsFound: number;
  duplicatesSkipped: number;
  details: Array<{
    competitorCode: string;
    newFilings: number;
    duplicates: number;
    status: string;
    errorMessage?: string;
  }>;
}

export const competitorAPI = {
  /**
   * Get all competitors
   */
  async getAllCompetitors(activeOnly: boolean = true): Promise<Competitor[]> {
    const response = await api.get<Competitor[]>('/competitors', {
      params: { activeOnly }
    });
    return response.data;
  },

  /**
   * Sync filings for all active competitors from PatentsView
   * @param fromDate - Start date for filings (YYYY-MM-DD format)
   * @returns Sync result with statistics
   */
  async syncFilings(fromDate: string): Promise<SyncResult> {
    const response = await api.post<SyncResult>('/competitors/filings/sync', null, {
      params: { fromDate }
    });
    return response.data;
  },

  /**
   * Get competitor by ID
   */
  async getCompetitorById(id: number): Promise<Competitor> {
    const response = await api.get<Competitor>(`/competitors/${id}`);
    return response.data;
  },

  /**
   * Get competitor by code
   */
  async getCompetitorByCode(code: string): Promise<Competitor> {
    const response = await api.get<Competitor>(`/competitors/code/${code}`);
    return response.data;
  },

  /**
   * Create new competitor
   */
  async createCompetitor(request: CompetitorCreateRequest): Promise<Competitor> {
    const response = await api.post<Competitor>('/competitors', request);
    return response.data;
  },

  /**
   * Update competitor
   */
  async updateCompetitor(id: number, request: CompetitorUpdateRequest): Promise<Competitor> {
    const response = await api.put<Competitor>(`/competitors/${id}`, request);
    return response.data;
  },

  /**
   * Delete competitor
   */
  async deleteCompetitor(id: number): Promise<void> {
    await api.delete(`/competitors/${id}`);
  },

  /**
   * Search competitors
   */
  async searchCompetitors(query: string): Promise<Competitor[]> {
    const response = await api.get<Competitor[]>('/competitors/search', {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Get filing summary
   */
  async getFilingSummary(): Promise<FilingSummary> {
    const response = await api.get<FilingSummary>('/competitors/filings/summary');
    return response.data;
  },

  /**
   * Get monthly filing trends
   * Backend returns Map<String, Map<String, Long>> structure
   * We convert it to MonthlyFilingTrend[] for frontend consumption
   */
  async getMonthlyTrends(fromDate?: string): Promise<MonthlyFilingTrend[]> {
    const params = fromDate ? { fromDate } : {};
    const response = await api.get<Record<string, Record<string, number>>>('/competitors/filings/trends/monthly', { params });
    
    // Convert Map<String, Map<String, Long>> to MonthlyFilingTrend[]
    const data = response.data;
    const trends: MonthlyFilingTrend[] = [];
    
    // Get all competitors first to map codes to names
    const competitorMap = new Map<string, string>();
    try {
      const competitors = await this.getAllCompetitors();
      competitors.forEach(comp => {
        competitorMap.set(comp.code, comp.name);
      });
    } catch (err) {
      console.warn('Failed to fetch competitor names:', err);
    }
    
    for (const [competitorCode, monthlyData] of Object.entries(data)) {
      for (const [month, filingCount] of Object.entries(monthlyData)) {
        trends.push({
          competitorCode,
          month,
          filingCount,
          competitorName: competitorMap.get(competitorCode) || competitorCode
        });
      }
    }
    
    // Sort by month to ensure chronological order
    trends.sort((a, b) => a.month.localeCompare(b.month));
    
    return trends;
  },

  /**
   * Search filings with filters
   */
  async searchFilings(request: FilingSearchRequest): Promise<PageResponse<CompetitorFiling>> {
    const response = await api.post<PageResponse<CompetitorFiling>>('/competitors/filings/search', request);
    return response.data;
  },
};
