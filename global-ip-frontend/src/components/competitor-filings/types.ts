export interface FilingSummaryDTO {
  totalFilings: number;
  oldestFiling: string | null;
  newestFiling: string | null;
  competitorsTracked: number;
  byCompetitor: CompetitorFilingSummary[];
}

export interface CompetitorFilingSummary {
  competitorCode: string;
  competitorName: string;
  filingCount: number;
  latestFiling: string;
}

export interface FilingTrendDTO {
  competitorCode: string;
  competitorName: string;
  count: number;
  periodStart: string;
  periodEnd: string;
}

export interface MonthlyTrendsMap {
  [competitorCode: string]: {
    [month: string]: number;
  };
}

export interface CompetitorFilingDTO {
  id: number;
  competitorId: number;
  competitorCode: string;
  competitorName: string;
  patentId: string;
  title: string;
  publicationDate: string;
  jurisdiction: string;
  assignee: string;
  filingType: string;
  status: string;
  fetchedAt: string;
}

export interface FilingSearchRequest {
  competitorIds?: number[];
  fromDate?: string;
  toDate?: string;
  jurisdiction?: string;
  page?: number;
  size?: number;
}

export interface SyncResultDTO {
  syncStarted: string;
  syncCompleted: string;
  competitorsProcessed: number;
  newFilingsFound: number;
  duplicatesSkipped: number;
  details: CompetitorSyncResult[];
}

export interface CompetitorSyncResult {
  competitorCode: string;
  newFilings: number;
  duplicates: number;
  status: string;
  errorMessage?: string;
}
