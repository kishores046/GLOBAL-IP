import axios, { AxiosInstance } from 'axios';
import { ApplicationLifecycleDto, TrademarkLifecycleDto } from '../types/lifecycle';

const API_BASE_URL = 'http://localhost:8080/api/analyst';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
apiClient.interceptors.request.use(
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

/**
 * Fetch patent lifecycle information
 * @param publicationNumber - Patent publication number
 * @returns Promise with patent lifecycle data
 */
export const fetchPatentLifecycle = async (
  publicationNumber: string
): Promise<ApplicationLifecycleDto> => {
  try {
    const response = await apiClient.get<ApplicationLifecycleDto>(
      `/patents/${publicationNumber}/lifecycle`
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
    const response = await apiClient.get<TrademarkLifecycleDto>(
      `/trademarks/${trademarkId}/lifecycle`
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

export default apiClient;
