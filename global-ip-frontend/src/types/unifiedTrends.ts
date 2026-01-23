/**
 * Unified Trends Types
 * Backend API response contracts for visualization data
 */

export interface FilingTrendData {
  year: number;
  patentsViewCount: number;
  epoCount: number;
}

export interface CountryTrendData {
  country: string; // ISO-2 or ISO-3 code
  patentsViewCount: number;
  epoCount: number;
}
