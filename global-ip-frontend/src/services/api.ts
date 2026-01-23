import axios from 'axios';
import { isTokenExpired, clearAuthData, formatTokenForLog } from '../utils/authUtils';

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
    
    // Debug logging
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
      tokenPreview: formatTokenForLog(token),
    });
    
    // Check if token is expired before making request
    if (token && isTokenExpired()) {
      console.error('❌ Token expired, clearing auth data');
      clearAuthData();
      window.location.href = '/login';
      return Promise.reject(new Error('Token expired'));
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No JWT token found - request may fail if endpoint requires auth');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Helper function to extract error details
const extractErrorDetails = (errorData: any) => {
  const errorMessage = typeof errorData === 'string' ? errorData : errorData?.message ?? '';
  const errorType = errorData?.errorType ?? errorData?.type ?? '';
  return { errorMessage, errorType };
};

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
      // Handle 401 Unauthorized - token expired, invalid, or blacklisted
      if (error.response.status === 401) {
        handleUnauthorized();
      }
      
      // Handle 403 Forbidden - user blocked or permission denied
      if (error.response.status === 403) {
        handleForbidden(error);
      }
    } else if (error.request) {
      console.error('⚠️ No response received from backend:', error.request);
      console.error('Make sure your backend is running on http://localhost:8080');
    }
    
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized errors
const handleUnauthorized = () => {
  console.error('❌ 401 Unauthorized - Token expired, invalid, or blacklisted');
  
  // Don't redirect if already on login or change-password pages
  const currentPath = window.location.pathname;
  if (currentPath !== '/login' && currentPath !== '/change-password') {
    // Clear all auth data
    clearAuthData();
    // Show message to user (they can see this in the login page redirect)
    sessionStorage.setItem('authMessage', 'Session expired. Please log in again.');
    // Redirect to login
    window.location.href = '/login';
  }
};

// Handle 403 Forbidden errors
const handleForbidden = (error: any) => {
  console.error('❌ 403 Forbidden - User may be blocked or lacks permissions');
  const errorData = error.response.data;
  const { errorMessage, errorType } = extractErrorDetails(errorData);
  
  console.error('403 Error details:', {
    message: errorMessage,
    type: errorType,
    data: errorData,
    url: error.config?.url,
    method: error.config?.method,
  });
  
  // Check if user is blocked (common scenario)
  const isUserBlocked = 
    errorMessage.includes('blocked') ||
    errorMessage.includes('Blocked') ||
    errorType === 'UserBlockedException' ||
    errorMessage.includes('account has been blocked');
  
  if (isUserBlocked) {
    console.error('🚫 User account blocked by administrator');
    // Force logout
    clearAuthData();
    sessionStorage.setItem('authMessage', 'Your account has been blocked. Contact administrator.');
    window.location.href = '/login';
  }
  
  // Check if this is a subscription-related error
  const isSubscriptionError =
    errorMessage.includes('subscription') ||
    errorMessage.includes('Subscription') ||
    errorType === 'SubscriptionRequiredException' ||
    errorType === 'TierLimitExceededException';
  
  if (isSubscriptionError) {
    // Mark this as a subscription error for handling by components
    error.isSubscriptionError = true;
    error.subscriptionErrorType = errorType ?? 'SubscriptionRequiredException';
  }
};

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
  trademarkId?: string;
  id?: string;
  applicationNumber?: string;
  registrationNumber?: string;
  markName: string;
  jurisdiction: string;
  filingDate?: string;
  status?: string;
  statusCode?: string;
  owners?: string[];
  state?: string;
  [key: string]: any; // Allow any additional fields from backend
}

export interface GlobalTrademarkDetailDto {
  id?: string;
  trademarkId?: string;
  markName: string;
  owners?: string[];
  goodsAndServices?: string | string[];
  internationalClasses?: string[];
  filingDate?: string;
  statusCode?: string;
  jurisdiction?: string;
  source?: string;
  bookmarked: boolean;
  drawingCode?: string;
  [key: string]: any; // Allow any additional fields from backend
}

export interface UnifiedSearchResponse {
  patents: PatentDocument[];
  trademarks: TrademarkResultDto[];
}

// ==================== PATENT DETAIL TYPES ====================
// ==================== CITATION NETWORK TYPES ====================
export interface Citation {
  citingPatent: string;
  citedPatent: string;
  citationDirection: 'BACKWARD' | 'FORWARD';
  citationType?: string;
  country?: string;
  title?: string;  // Patent title for tooltips
}

export interface CitationNetwork {
  centerPatent: string;
  backwardCitations: Citation[];   // already capped at 10
  forwardCitations: Citation[];    // already capped at 10
  backwardTotal: number;            // full count before truncation
  forwardTotal: number;             // full count before truncation
  truncated: boolean;               // true if totals > rendered
  // Legacy fields for backward compatibility
  patentNumber?: string;
  backwardCount?: number;
  forwardCount?: number;
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
  citationNetwork?: CitationNetwork | null;
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

export interface BookmarkedTrademark {
  trademarkId: string;
  markName?: string;
  jurisdiction?: string;
  filingDate?: string;
  statusCode?: string;
  source?: string;
  bookmarkedAt?: string;
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
    
    const response = await api.post('/search', requestBody);
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

// Trademark Detail API
export const trademarkDetailAPI = {
  getDetail: async (trademarkId: string): Promise<GlobalTrademarkDetailDto> => {
    console.log("Fetching trademark detail for ID:", trademarkId);
    const response = await api.get(`/trademarks/${trademarkId}`);
    const data = response.data;
    
    // Normalize the response - backend returns 'id' but frontend expects 'trademarkId'
    if (data.id && !data.trademarkId) {
      data.trademarkId = data.id;
    }
    
    console.log("Trademark detail response:", data);
    return data;
  },
  
  bookmark: async (trademarkId: string, source: string = 'TMVIEW'): Promise<void> => {
    console.log("Bookmarking trademark:", trademarkId, "with source:", source);
    const url = `/trademarks/${encodeURIComponent(trademarkId)}/bookmark?source=${encodeURIComponent(source)}`;
    console.log("POST URL:", url);
    await api.post(url);
    console.log("Bookmark successful");
  },
  
  unbookmark: async (trademarkId: string): Promise<void> => {
    console.log("Unbookmarking trademark:", trademarkId);
    const url = `/trademarks/${encodeURIComponent(trademarkId)}/bookmark`;
    console.log("DELETE URL:", url);
    await api.delete(url);
    console.log("Unbookmark successful");
  },
};

// Bookmark Management API
export const bookmarkAPI = {
  getBookmarkedPatents: async (): Promise<BookmarkedPatent[]> => {
    const response = await api.get('/users/me/bookmarks/patents');
    return response.data;
  },
  
  getBookmarkedTrademarks: async (): Promise<BookmarkedTrademark[]> => {
    const response = await api.get('/users/me/bookmarks/trademarks');
    console.log("Bookmarked trademarks response:", response.data);
    if (response.data && response.data.length > 0) {
      console.log("First bookmarked trademark from API:", response.data[0]);
      console.log("Fields in bookmarked trademark:", Object.keys(response.data[0]));
    }
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

// Dashboard API
export const dashboardAPI = {
  getUserSearchCount: async (): Promise<number> => {
    const response = await api.get('/user/dashboard/my/searchCount');
    return response.data;
  },
  
  getAnalystSearchCount: async (): Promise<number> => {
    const response = await api.get('/analyst/dashboard/my/searchCount');
    return response.data;
  },

  getTotalGraphCount: async (): Promise<number> => {
    try {
      console.log('📊 Fetching total graph count from /api/analyst/dashboard/graphs/total-count');
      const response = await api.get('/analyst/dashboard/graphs/total-count');
      console.log('✅ Total graph count response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch total graph count:');
      console.error('  Status:', error.response?.status);
      console.error('  StatusText:', error.response?.statusText);
      console.error('  Data:', error.response?.data);
      console.error('  Message:', error.message);
      console.error('  Full error:', error);
      throw error;
    }
  },
};

export default api;
export { API_BASE_URL };
