/**
 * API Key Service
 * Handles API key operations
 * 
 * SECURITY RULES:
 * ❌ Never cache raw API key
 * ❌ Never log raw API key
 * ❌ Never show raw key again after modal closes
 */

import api from './api';
import type {
  ApiKeyResponse,
} from '../types/apiKey';

interface CreateApiKeyResponse {
  apiKey: string;
}

class ApiKeyService {
  /**
   * Get all API keys for the authenticated user
   * GET /api/settings/api-keys
   */
  async getApiKeys(): Promise<ApiKeyResponse[]> {
    try {
      const response = await api.get<ApiKeyResponse[]>('/settings/api-keys');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      throw error;
    }
  }

  /**
   * Create a new API key
   * POST /api/settings/api-keys
   * 
   * No parameters - key name auto-derived from authenticated user
   * Backend returns raw key ONCE - must be displayed immediately
   * 
   * @returns { apiKey: string } - Raw API key shown only once
   */
  async createApiKey(): Promise<CreateApiKeyResponse> {
    try {
      const response = await api.post<CreateApiKeyResponse>('/settings/api-keys');
      
      // Validate response has apiKey
      if (!response.data?.apiKey) {
        console.warn('API response missing apiKey:', response.data);
        throw new Error('Invalid response: apiKey not found in response');
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error;
    }
  }

  /**
   * Revoke an API key by ID
   * DELETE /api/settings/api-keys/{id}
   * 
   * @param id - API key ID
   */
  async revokeApiKey(id: string): Promise<void> {
    try {
      await api.delete(`/settings/api-keys/${id}`);
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new ApiKeyService();
