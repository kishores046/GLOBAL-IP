import api from '../services/api';
import { ApplicationLifecycleDto, TrademarkLifecycleDto } from '../types/lifecycle';

// Use the centralized axios instance which is already configured with:
// - Base URL from environment variables
// - JWT interceptor
// - Error handling

const API_BASE = '/analyst';

/**
 * Fetch patent lifecycle information
 * @param publicationNumber - Patent publication number
 * @returns Promise with patent lifecycle data
 */
export const fetchPatentLifecycle = async (
  publicationNumber: string
): Promise<ApplicationLifecycleDto> => {
  try {
    const response = await api.get<ApplicationLifecycleDto>(
      `${API_BASE}/patents/${publicationNumber}/lifecycle`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch patent lifecycle: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

/**
 * Fetch trademark lifecycle information
 * @param trademarkId - Trademark identifier
 * @returns Promise with trademark lifecycle data
 */
export const fetchTrademarkLifecycle = async (
  trademarkId: string
): Promise<TrademarkLifecycleDto> => {
  try {
    const response = await api.get<TrademarkLifecycleDto>(
      `${API_BASE}/trademarks/${trademarkId}/lifecycle`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch trademark lifecycle: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

export default api;
