/**
 * Subscription Guard Hook
 * Provides utilities for guarding features based on subscription status
 */

import { useState, useCallback } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { SubscriptionUpgradeModal } from '../components/subscription/SubscriptionUpgradeModal';
import type { MonitoringType, SubscriptionTier } from '../types/subscription';
import { SubscriptionRequiredError, TierLimitExceededError } from '../types/subscription';

interface UseSubscriptionGuardOptions {
  feature?: MonitoringType;
  requiredTier?: SubscriptionTier;
  showModalOnError?: boolean;
}

interface UseSubscriptionGuardReturn {
  guard: <T>(fn: () => Promise<T>) => Promise<T | null>;
  isAllowed: () => boolean;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  UpgradeModal: () => JSX.Element;
}

export function useSubscriptionGuard(options: UseSubscriptionGuardOptions = {}): UseSubscriptionGuardReturn {
  const { requireSubscription, isActive, hasTierAccess, subscription } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Guard a function - wraps it with subscription checks
   */
  const guard = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        // Check subscription requirement
        if (options.feature) {
          requireSubscription(options.feature);
        } else if (!isActive) {
          throw new SubscriptionRequiredError();
        }

        // Check tier requirement
        if (options.requiredTier && !hasTierAccess(options.requiredTier)) {
          throw new SubscriptionRequiredError(
            `This feature requires ${options.requiredTier} plan or higher.`
          );
        }

        return await fn();
      } catch (error) {
        if (error instanceof SubscriptionRequiredError || error instanceof TierLimitExceededError) {
          setErrorMessage(error.message);
          if (options.showModalOnError !== false) {
            setShowUpgradeModal(true);
          }
          return null;
        }
        throw error;
      }
    },
    [requireSubscription, isActive, hasTierAccess, options]
  );

  /**
   * Check if action is allowed (non-throwing)
   */
  const isAllowed = useCallback((): boolean => {
    try {
      if (options.feature) {
        requireSubscription(options.feature);
      } else if (!isActive) {
        return false;
      }

      if (options.requiredTier && !hasTierAccess(options.requiredTier)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, [requireSubscription, isActive, hasTierAccess, options]);

  const UpgradeModal = () => (
    <SubscriptionUpgradeModal
      isOpen={showUpgradeModal}
      onClose={() => {
        setShowUpgradeModal(false);
        setErrorMessage(null);
      }}
      feature={options.feature}
      requiredTier={options.requiredTier}
      message={errorMessage || undefined}
      showCreateOption={!subscription}
    />
  );

  return {
    guard,
    isAllowed,
    showUpgradeModal,
    setShowUpgradeModal,
    UpgradeModal,
  };
}

