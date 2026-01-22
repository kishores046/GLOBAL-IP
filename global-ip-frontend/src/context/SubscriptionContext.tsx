/**
 * Subscription Context Provider
 * Manages global subscription state and provides subscription utilities
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import subscriptionApi from '../services/subscriptionApi';
import type {
  Subscription,
  SubscriptionTier,
  MonitoringType,
  TierLimits,
  SubscriptionUsage,
} from '../types/subscription';
import { getTierLimits, isLimitExceeded, formatLimit, SubscriptionRequiredError } from '../types/subscription';

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  usage: SubscriptionUsage | null;
  tierLimits: TierLimits | null;
  isSubscribed: boolean;
  isActive: boolean;
  refreshSubscription: () => Promise<void>;
  requireSubscription: (feature: MonitoringType) => void;
  canUseFeature: (feature: MonitoringType) => boolean;
  hasTierAccess: (requiredTier: SubscriptionTier) => boolean;
  checkLimit: (limitType: 'competitors' | 'patents', currentCount: number) => boolean;
  getLimitDisplay: (limitType: 'competitors' | 'patents') => string;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load active subscription on mount or auth change
   */
  const loadSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      setUsage(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const activeSubscription = await subscriptionApi.getActiveSubscription();
      setSubscription(activeSubscription);

      // Don't call getUsage - endpoint doesn't exist on backend
      // Initialize usage as null if no subscription
      if (!activeSubscription) {
        setUsage(null);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      setSubscription(null);
      setUsage(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  /**
   * Listen for page visibility changes to refresh subscription
   * This handles cases where user creates subscription in another tab/window
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        loadSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadSubscription, isAuthenticated]);

  /**
   * Refresh subscription data
   */
  const refreshSubscription = useCallback(async () => {
    await loadSubscription();
  }, [loadSubscription]);

  /**
   * Require subscription for a feature - throws error if not subscribed
   */
  const requireSubscription = useCallback(
    (feature: MonitoringType) => {
      if (!subscription || subscription.status !== 'ACTIVE') {
        throw new SubscriptionRequiredError(
          `You don't have an active subscription for ${feature}.`
        );
      }
    },
    [subscription]
  );

  /**
   * Check if user can use a feature
   */
  const canUseFeature = useCallback(
    (feature: MonitoringType): boolean => {
      if (!subscription || subscription.status !== 'ACTIVE') {
        return false;
      }
      // Additional feature-specific checks can be added here
      return true;
    },
    [subscription]
  );

  /**
   * Check if user has access to a required tier
   */
  const hasTierAccess = useCallback(
    (requiredTier: SubscriptionTier): boolean => {
      if (!subscription || subscription.status !== 'ACTIVE') {
        return false;
      }

      const tierOrder: SubscriptionTier[] = ['BASIC', 'PRO', 'ENTERPRISE'];
      const userTierIndex = tierOrder.indexOf(subscription.tier);
      const requiredTierIndex = tierOrder.indexOf(requiredTier);

      return userTierIndex >= requiredTierIndex;
    },
    [subscription]
  );

  /**
   * Check if a limit is exceeded
   */
  const checkLimit = useCallback(
    (limitType: 'competitors' | 'patents', currentCount: number): boolean => {
      if (!subscription || !usage || subscription.status !== 'ACTIVE') {
        return true; // Block if no subscription
      }

      const limits = getTierLimits(subscription.tier);
      const limit = limitType === 'competitors' ? limits.maxCompetitors : limits.maxPatentsTracked;
      const used = limitType === 'competitors' ? usage.competitorsUsed : usage.patentsTracked;

      return isLimitExceeded(used + currentCount, limit);
    },
    [subscription, usage]
  );

  /**
   * Get limit display string
   */
  const getLimitDisplay = useCallback(
    (limitType: 'competitors' | 'patents'): string => {
      if (!subscription || subscription.status !== 'ACTIVE') {
        return 'N/A';
      }

      const limits = getTierLimits(subscription.tier);
      const limit = limitType === 'competitors' ? limits.maxCompetitors : limits.maxPatentsTracked;
      
      let usedValue = 0;
      if (usage) {
        usedValue = limitType === 'competitors' ? usage.competitorsUsed : usage.patentsTracked;
      }

      return `${usedValue} / ${formatLimit(limit)}`;
    },
    [subscription, usage]
  );

  // Computed values
  const isSubscribed = subscription !== null;
  const isActive = subscription?.status === 'ACTIVE';
  const tierLimits = subscription ? getTierLimits(subscription.tier) : null;

  const value: SubscriptionContextType = useMemo(
    () => ({
      subscription,
      isLoading,
      usage,
      tierLimits,
      isSubscribed,
      isActive,
      refreshSubscription,
      requireSubscription,
      canUseFeature,
      hasTierAccess,
      checkLimit,
      getLimitDisplay,
    }),
    [
      subscription,
      isLoading,
      usage,
      tierLimits,
      isSubscribed,
      isActive,
      refreshSubscription,
      requireSubscription,
      canUseFeature,
      hasTierAccess,
      checkLimit,
      getLimitDisplay,
    ]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

