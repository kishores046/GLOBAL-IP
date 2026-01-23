/**
 * Subscription Types and Interfaces
 * Defines the subscription system types matching backend structure
 */

export type SubscriptionTier = 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED';
export type MonitoringType = 'LEGAL_STATUS' | 'COMPETITOR_FILING';
export type AlertFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ON_DEMAND';

export interface Subscription {
  id: string;
  type: MonitoringType;
  tier: SubscriptionTier;
  alertFrequency: AlertFrequency;
  status: SubscriptionStatus;
  emailAlertsEnabled?: boolean;
  dashboardAlertsEnabled?: boolean;
  createdAt?: string;
  expiresAt?: string;
}

export interface TierLimits {
  maxCompetitors: number | 'unlimited';
  maxPatentsTracked: number | 'unlimited';
  filingSyncFrequency: 'WEEKLY' | 'DAILY' | '6_HOUR';
  lifecycleCheckFrequency: 'WEEKLY' | 'DAILY' | '6_HOUR';
  realTimeAlerts: boolean;
  analyticsDashboards: boolean;
}

export interface SubscriptionFeatureMatrix {
  BASIC: TierLimits;
  PRO: TierLimits;
  ENTERPRISE: TierLimits;
}

export interface SubscriptionUsage {
  competitorsUsed: number;
  patentsTracked: number;
  maxCompetitors: number | 'unlimited';
  maxPatentsTracked: number | 'unlimited';
}

export interface CreateSubscriptionRequest {
  type: MonitoringType;
  tier: SubscriptionTier;
  alertFrequency: AlertFrequency;
  emailAlertsEnabled: boolean;
  dashboardAlertsEnabled: boolean;
}

export class SubscriptionRequiredError extends Error {
  constructor(message: string = 'This feature requires an active subscription.') {
    super(message);
    this.name = 'SubscriptionRequiredError';
  }
}

export class TierLimitExceededError extends Error {
  constructor(message: string = 'You have reached your plan limit.') {
    super(message);
    this.name = 'TierLimitExceededError';
  }
}

/**
 * Feature matrix based on tier limits
 */
export const FEATURE_MATRIX: SubscriptionFeatureMatrix = {
  BASIC: {
    maxCompetitors: 3,
    maxPatentsTracked: 10,
    filingSyncFrequency: 'WEEKLY',
    lifecycleCheckFrequency: 'WEEKLY',
    realTimeAlerts: false,
    analyticsDashboards: false,
  },
  PRO: {
    maxCompetitors: 20,
    maxPatentsTracked: 100,
    filingSyncFrequency: 'DAILY',
    lifecycleCheckFrequency: 'DAILY',
    realTimeAlerts: true,
    analyticsDashboards: true,
  },
  ENTERPRISE: {
    maxCompetitors: 'unlimited',
    maxPatentsTracked: 'unlimited',
    filingSyncFrequency: '6_HOUR',
    lifecycleCheckFrequency: '6_HOUR',
    realTimeAlerts: true,
    analyticsDashboards: true,
  },
};

/**
 * Get tier limits for a given tier
 */
export function getTierLimits(tier: SubscriptionTier): TierLimits {
  return FEATURE_MATRIX[tier];
}

/**
 * Check if a value exceeds the limit
 */
export function isLimitExceeded(used: number, limit: number | 'unlimited'): boolean {
  if (limit === 'unlimited') return false;
  return used >= limit;
}

/**
 * Format limit display
 */
export function formatLimit(limit: number | 'unlimited'): string {
  return limit === 'unlimited' ? 'Unlimited' : limit.toString();
}

