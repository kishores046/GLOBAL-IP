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

// Patent Search Types
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

// Patent Search API
export const patentSearchAPI = {
  // Unified search endpoint - dynamically builds request body
  search: async (searchParams: PatentSearchRequest): Promise<PatentSearchResult[]> => {
    // Build request body with only non-empty fields
    const requestBody: any = {
      keyword: searchParams.keyword,
    };
    
    // Add optional fields only if they have values
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
