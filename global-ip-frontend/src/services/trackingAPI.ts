import api from './api';

// Use the centralized axios instance which is already configured with:
// - Base URL from environment variables
// - JWT interceptor
// - Error handling

// Get API base path - use unified tracking endpoint for all roles
const getApiBase = (): string => {
  // The backend controller at /api/tracking allows all authenticated roles
  // (ANALYST, ADMIN, USER) via @PreAuthorize("hasAnyRole('ANALYST','ADMIN','USER')")
  return '/tracking';
};

export interface TrackingPreferences {
  patentId: string;
  trackLifecycleEvents?: boolean;
  trackStatusChanges?: boolean;
  trackRenewalsExpiry?: boolean;
  enableDashboardAlerts?: boolean;
  enableEmailNotifications?: boolean;
}

/**
 * Patent Tracking API
 * Handles user tracking preferences and notifications
 */
export const trackingApi = {
  /**
   * Check if patent is being tracked by current user
   * @param patentId - Publication number
   * @returns boolean - true if tracking, false otherwise
   */
  async isTracking(patentId: string): Promise<boolean> {
    try {
      const API_BASE = getApiBase();
      const response = await api.get(`${API_BASE}/is-tracking/${patentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error checking tracking status:', error);
      throw error;
    }
  },

  /**
   * Get tracking preferences for a specific patent
   * @param patentId - Publication number
   */
  async getPreferences(patentId: string): Promise<TrackingPreferences> {
    try {
      const API_BASE = getApiBase();
      const response = await api.get(`${API_BASE}/preferences/${patentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  },

  /**
   * Get all tracking preferences for current user
   */
  async getAllPreferences(): Promise<TrackingPreferences[]> {
    try {
      const API_BASE = getApiBase();
      const response = await api.get(`${API_BASE}/preferences`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all preferences:', error);
      throw error;
    }
  },

  /**
   * Save or update tracking preferences
   * @param preferences - Tracking preferences object
   */
  async savePreferences(preferences: TrackingPreferences): Promise<TrackingPreferences> {
    try {
      const API_BASE = getApiBase();
      console.log('Saving preferences:', preferences, 'to:', API_BASE);
      const response = await api.post(`${API_BASE}/preferences`, preferences);
      console.log('Save response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Delete tracking preferences (stop tracking)
   * @param patentId - Publication number
   */
  async deletePreferences(patentId: string): Promise<void> {
    try {
      const API_BASE = getApiBase();
      await api.delete(`${API_BASE}/preferences/${patentId}`);
    } catch (error: any) {
      console.error('Error deleting preferences:', error);
      throw error;
    }
  }
  ,
  /**
   * Get total tracked patents for the current user
   */
  async getTotalTrackedPatents(): Promise<number> {
    try {
      const API_BASE = getApiBase();
      const response = await api.get(`${API_BASE}/total`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching total tracked patents:', error);
      throw error;
    }
  }
};
