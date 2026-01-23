/**
 * Lifecycle Type Definitions
 * Represents patent and trademark application lifecycles
 */

export type PatentLifecycleStatus = 'PENDING' | 'GRANTED' | 'EXPIRED' | 'WITHDRAWN' | 'UNKNOWN';
export type TrademarkLifecycleStatus = 'FILED' | 'PUBLISHED' | 'REGISTERED' | 'CANCELLED';

/**
 * Patent Application Lifecycle DTO
 * Matches backend ApplicationLifecycleDto
 */
export interface ApplicationLifecycleDto {
  publicationNumber: string;
  filingDate: string | null;
  grantDate: string | null;
  expirationDate: string | null;
  status: PatentLifecycleStatus;
}

/**
 * Trademark Application Lifecycle DTO
 * Matches backend TrademarkLifecycleDto
 */
export interface TrademarkLifecycleDto {
  trademarkId: string;
  filingDate: string;
  status: TrademarkLifecycleStatus;
  rawStatusCode: string;
}

/**
 * Lifecycle Timeline Step
 * Represents a single step in the lifecycle journey
 */
export interface LifecycleStep {
  key: string;
  label: string;
  date: string | null;
  isCompleted: boolean;
  isCurrent: boolean;
  description?: string;
}

/**
 * Patent Lifecycle State
 * Used in UI state management
 */
export interface PatentLifecycleState {
  publicationNumber: string;
  status: PatentLifecycleStatus;
  filingDate: string | null;
  grantDate: string | null;
  expirationDate: string | null;
  steps: LifecycleStep[];
  loading: boolean;
  error: Error | null;
}

/**
 * Trademark Lifecycle State
 * Used in UI state management
 */
export interface TrademarkLifecycleState {
  trademarkId: string;
  status: TrademarkLifecycleStatus;
  filingDate: string;
  rawStatusCode: string;
  steps: LifecycleStep[];
  loading: boolean;
  error: Error | null;
}
