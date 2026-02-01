import api from './api';
import { ApplicationLifecycleDto } from '../types/lifecycle';

// Use the centralized axios instance which is already configured with:
// - Base URL from environment variables
// - JWT interceptor
// - Error handling

const API_BASE = '/analyst/patents';

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
