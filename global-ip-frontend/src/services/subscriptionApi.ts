/**
 * Subscription API Service
 * Handles all subscription-related API calls
 */

import api from './api';
import type {
  Subscription,
  CreateSubscriptionRequest,
} from '../types/subscription';

const subscriptionApi = {
  /**
   * Get active subscription for the current user
   * GET /api/subscriptions/active (returns array)
   * Returns the first active subscription or null
   */
  getActiveSubscription: async (): Promise<Subscription | null> => {
    try {
      const response = await api.get<Subscription[]>('/subscriptions/active');
      const subscriptions = response.data || [];
      
      // Return the first active subscription if available
      if (subscriptions.length > 0) {
        return subscriptions[0];
      }
      return null;
    } catch (error: any) {
      // If 404 or empty response, user has no active subscription
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get all active subscriptions for the current user
   * GET /api/subscriptions/active
   */
  getActiveSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await api.get<Subscription[]>('/subscriptions/active');
      return response.data || [];
    } catch (error: any) {
      // If 404 or empty response, user has no active subscriptions
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  /**
   * Create a new subscription
   * POST /api/subscriptions
   */
  createSubscription: async (request: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await api.post<Subscription>('/subscriptions', request);
    return response.data;
  },

  /**
   * Update subscription
   * PUT /api/subscriptions/:id
   */
  updateSubscription: async (
    subscriptionId: string,
    updates: Partial<CreateSubscriptionRequest>
  ): Promise<Subscription> => {
    const response = await api.put<Subscription>(`/subscriptions/${subscriptionId}`, updates);
    return response.data;
  },

  /**
   * Cancel subscription
   * DELETE /api/subscriptions/:id
   */
  cancelSubscription: async (subscriptionId: string): Promise<void> => {
    await api.delete(`/subscriptions/${subscriptionId}`);
  },
};

export default subscriptionApi;

