import axios from 'axios';

// Base API URL - update this to match your backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        console.log('401 Unauthorized - clearing tokens and redirecting to login');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('No response received from backend:', error.request);
      console.error('Make sure your backend is running on http://localhost:8080');
    }
    return Promise.reject(error);
  }
);

// ==================== UNIFIED SEARCH TYPES ====================
export interface UnifiedSearchRequest {
  keyword: string;
  jurisdiction?: string;
  filingDateFrom?: string;
  filingDateTo?: string;
  assignee?: string;
  inventor?: string;
  owner?: string;
  state?: string;
}

export interface PatentDocument {
  publicationNumber: string;
  jurisdiction: string;
  title?: string;
  filingDate?: string;
  publicationDate?: string;
  grantDate?: string;
  assignees?: string[];
  inventors?: string[];
  abstract?: string;
  cpcClasses?: string[];
  ipcClasses?: string[];
  timesCited?: number;
  totalCitations?: number;
  wipoKind?: string;
  source?: string;
  bookmarked?: boolean;
}

export interface TrademarkResultDto {
  trademarkId: string;
  markName: string;
  jurisdiction: string;
  filingDate?: string;
  status?: string;
  owners?: string[];
  state?: string;
}

export interface UnifiedSearchResponse {
  patents: PatentDocument[];
  trademarks: TrademarkResultDto[];
}

// ==================== PATENT DETAIL TYPES ====================
export interface GlobalPatentDetailDto {
  publicationNumber: string;
  jurisdiction: string;
  title?: string;
  abstract?: string;
  abstractText?: string;
  filingDate?: string;
  publicationDate?: string;
  grantDate?: string;
  wipoKind?: string;
  timesCited?: number;
  totalCitations?: number;
  inventors?: string[];
  assignees?: string[];
  cpcClasses?: string[];
  ipcClasses?: string[];
  source?: string;
  bookmarked: boolean;
}

// ==================== BOOKMARK TYPES ====================
export interface BookmarkedPatent {
  publicationNumber: string;
  title?: string;
  jurisdiction: string;
  filingDate?: string;
  grantDate?: string;
  source?: string;
  bookmarkedAt?: string;
  assignee?: string;
  publicationDate?: string;
}

// ==================== API FUNCTIONS ====================

// Unified Search API
export const unifiedSearchAPI = {
  search: async (searchParams: UnifiedSearchRequest): Promise<UnifiedSearchResponse> => {
    const requestBody: any = {
      keyword: searchParams.keyword.trim(),
    };
    
    if (searchParams.jurisdiction && searchParams.jurisdiction !== 'ALL') {
      requestBody.jurisdiction = searchParams.jurisdiction;
    }
    if (searchParams.filingDateFrom) {
      requestBody.filingDateFrom = searchParams.filingDateFrom;
    }
    if (searchParams.filingDateTo) {
      requestBody.filingDateTo = searchParams.filingDateTo;
    }
    if (searchParams.assignee?.trim()) {
      requestBody.assignee = searchParams.assignee.trim();
    }
    if (searchParams.inventor?.trim()) {
      requestBody.inventor = searchParams.inventor.trim();
    }
    if (searchParams.owner?.trim()) {
      requestBody.owner = searchParams.owner.trim();
    }
    if (searchParams.state?.trim()) {
      requestBody.state = searchParams.state.trim();
    }
    
    const response = await api.post('/search/advanced', requestBody);
    return response.data;
  },
};

// Patent Detail API
export const patentDetailAPI = {
  getDetail: async (publicationNumber: string): Promise<GlobalPatentDetailDto> => {
    const response = await api.get(`/patents/${publicationNumber}`);
    return response.data;
  },
  
  bookmark: async (publicationNumber: string, source: string = 'PATENTSVIEW'): Promise<void> => {
    await api.post(`/patents/${publicationNumber}/bookmark`, null, {
      params: { source }
    });
  },
  
  unbookmark: async (publicationNumber: string): Promise<void> => {
    await api.delete(`/patents/${publicationNumber}/bookmark`);
  },
};

// Bookmark Management API
export const bookmarkAPI = {
  getBookmarkedPatents: async (): Promise<BookmarkedPatent[]> => {
    const response = await api.get('/users/me/bookmarks/patents');
    return response.data;
  },
};

// Legacy Patent Search API (for backward compatibility)
export interface PatentSearchRequest {
  keyword: string;
  jurisdiction?: string | null;
  filingDateFrom?: string | null;
  filingDateTo?: string | null;
  assignee?: string;
  inventor?: string;
}

export interface PatentSearchResult {
  publicationNumber: string;
  jurisdiction: string;
  title: string;
  publicationDate: string;
  assignees: string[];
  inventors: string[];
}

export const patentSearchAPI = {
  search: async (searchParams: PatentSearchRequest): Promise<PatentSearchResult[]> => {
    const requestBody: any = {
      keyword: searchParams.keyword,
    };
    
    if (searchParams.jurisdiction && searchParams.jurisdiction !== 'ALL') {
      requestBody.jurisdiction = searchParams.jurisdiction;
    }
    if (searchParams.filingDateFrom) {
      requestBody.filingDateFrom = searchParams.filingDateFrom;
    }
    if (searchParams.filingDateTo) {
      requestBody.filingDateTo = searchParams.filingDateTo;
    }
    if (searchParams.assignee?.trim()) {
      requestBody.assignee = searchParams.assignee.trim();
    }
    if (searchParams.inventor?.trim()) {
      requestBody.inventor = searchParams.inventor.trim();
    }
    
    const response = await api.post('/patents/search', requestBody);
    return response.data;
  },
};

export default api;
export { API_BASE_URL };
