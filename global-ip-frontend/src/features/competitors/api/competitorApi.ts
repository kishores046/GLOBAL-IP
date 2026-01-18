/**
 * Competitor API Service
 * Handles all competitor management API calls
 */

import axios from 'axios';
import type {
  CompetitorDTO,
  CompetitorCreateRequest,
  CompetitorUpdateRequest,
  CompetitorDetailResponse,
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

const API_BASE_URL = '/api/competitors';

/**
 * Competitor API service for CRUD operations
 */
export const competitorApi = {
  /**
   * Get all competitors
   */
  async list(activeOnly: boolean = true): Promise<CompetitorDTO[]> {
    try {
      const { data } = await api.get<CompetitorDTO[]>(API_BASE_URL, {
        params: { activeOnly },
      });
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch competitors');
    }
  },

  /**
   * Get competitor by ID
   */
  async getById(id: number): Promise<CompetitorDetailResponse> {
    try {
      const { data } = await api.get<CompetitorDetailResponse>(
        `${API_BASE_URL}/${id}`
      );
      return data;
    } catch (error) {
      handleApiError(error, `Failed to fetch competitor with ID ${id}`);
    }
  },

  /**
   * Get competitor by code
   */
  async getByCode(code: string): Promise<CompetitorDTO> {
    try {
      const { data } = await api.get<CompetitorDTO>(
        `${API_BASE_URL}/code/${code}`
      );
      return data;
    } catch (error) {
      handleApiError(error, `Failed to fetch competitor with code ${code}`);
    }
  },

  /**
   * Create a new competitor
   */
  async create(request: CompetitorCreateRequest): Promise<CompetitorDTO> {
    try {
      const { data } = await api.post<CompetitorDTO>(API_BASE_URL, request);
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to create competitor');
    }
  },

  /**
   * Update competitor
   */
  async update(
    id: number,
    request: CompetitorUpdateRequest
  ): Promise<CompetitorDTO> {
    try {
      const { data } = await api.put<CompetitorDTO>(
        `${API_BASE_URL}/${id}`,
        request
      );
      return data;
    } catch (error) {
      handleApiError(error, `Failed to update competitor with ID ${id}`);
    }
  },

  /**
   * Soft delete competitor (sets active=false)
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      handleApiError(error, `Failed to delete competitor with ID ${id}`);
    }
  },

  /**
   * Search competitors by query term
   */
  async search(searchTerm: string): Promise<CompetitorDTO[]> {
    try {
      const { data } = await api.get<CompetitorDTO[]>(
        `${API_BASE_URL}/search`,
        {
          params: { q: searchTerm },
        }
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to search competitors');
    }
  },

  /**
   * Toggle competitor active status
   */
  async toggleActive(
    id: number,
    active: boolean
  ): Promise<CompetitorDTO> {
    try {
      const { data } = await api.put<CompetitorDTO>(
        `${API_BASE_URL}/${id}`,
        { active }
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to update competitor status');
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
