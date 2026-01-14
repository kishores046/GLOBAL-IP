import axios from 'axios';
import { ApplicationLifecycleDto } from '../types/lifecycle';

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

const API_BASE = '/api/analyst/patents';

/**
 * Patent Lifecycle API
 * Handles patent data and lifecycle information
 */
export const patentApi = {
  /**
   * Get patent lifecycle data
   * @param patentId - Publication number
   */
  async getLifecycle(patentId: string): Promise<ApplicationLifecycleDto> {
    try {
      const response = await api.get(`${API_BASE}/${patentId}/lifecycle`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching lifecycle:', error);
      throw error;
    }
  },

  /**
   * Get all tracked patents for current user
   */
  async getTrackedPatents(): Promise<ApplicationLifecycleDto[]> {
    try {
      const response = await api.get(`${API_BASE}/tracked`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tracked patents:', error);
      throw error;
    }
  },

  /**
   * Get specific tracked patent lifecycle
   * @param patentId - Publication number
   */
  async getTrackedPatent(patentId: string): Promise<ApplicationLifecycleDto> {
    try {
      const response = await api.get(`${API_BASE}/tracked/${patentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tracked patent:', error);
      throw error;
    }
  }
};
