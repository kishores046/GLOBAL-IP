// Patent Trend Analysis Types

// Filing & Grant Trends
export interface FilingTrendData {
  year: number;
  filingCount: number;
  grantCount: number;
  grantRate: number; // percentage of filings granted
}

export interface FilingTrendResponse {
  data: FilingTrendData[];
  period: {
    startYear: number;
    endYear: number;
  };
}

// Technology Trends
export interface TechnologyTrendData {
  cpcGroup: string;
  cpcDescription: string;
  count: number;
  year?: number;
  growthRate?: number;
}

export interface TechnologyEvolutionData {
  cpcGroup: string;
  cpcDescription: string;
  yearData: Array<{
    year: number;
    count: number;
  }>;
  totalCount: number;
  trend: 'rising' | 'declining' | 'stable';
}

export interface TechnologyTrendResponse {
  topTechnologies: TechnologyTrendData[];
  evolutionData: TechnologyEvolutionData[];
}

// Assignee Trends
export interface AssigneeTrendData {
  assigneeId: string;
  assigneeName: string;
  patentCount: number;
  yearData?: Array<{
    year: number;
    count: number;
  }>;
  marketShare?: number;
}

export interface AssigneeTrendResponse {
  topAssignees: AssigneeTrendData[];
  totalAssignees: number;
}

// Geographic Trends
export interface CountryTrendData {
  countryCode: string;
  countryName: string;
  patentCount: number;
  filingCount: number;
  grantCount: number;
  yearData?: Array<{
    year: number;
    count: number;
  }>;
}

export interface CountryTrendResponse {
  countries: CountryTrendData[];
  totalCountries: number;
}

// Citation Analytics
export interface CitedPatentData {
  patentId: string;
  title: string;
  assignee: string;
  citationCount: number;
  citedByCount: number;
  claimComplexity?: number;
  technologicalField?: string;
}

export interface CitationTrendResponse {
  topCited: CitedPatentData[];
  topCiting: CitedPatentData[];
}

// Patent Quality & Complexity
export interface PatentTypeDistributionData {
  type: string;
  count: number;
  percentage: number;
}

export interface ClaimComplexityData {
  year: number;
  averageClaimCount: number;
  averageCombinationCount: number;
  averageClaimLength: number;
}

export interface TimeToGrantData {
  year: number;
  averageDaysToGrant: number;
  medianDaysToGrant: number;
  percentile90DaysToGrant: number;
}

export interface PatentQualityResponse {
  typeDistribution: PatentTypeDistributionData[];
  claimComplexity: ClaimComplexityData[];
  timeToGrant: TimeToGrantData[];
}

// Composite Trend Analysis
export interface TrendAnalysisReport {
  reportDate: string;
  filingTrends: FilingTrendResponse;
  technologyTrends: TechnologyTrendResponse;
  assigneeTrends: AssigneeTrendResponse;
  countryTrends: CountryTrendResponse;
  citationTrends: CitationTrendResponse;
  qualityTrends: PatentQualityResponse;
}

// Insight Summary
export interface InsightSummary {
  title: string;
  bullets: string[];
  interpretation: string;
  businessImplications: string[];
  suggestedVisualizations: VisualizationRecommendation[];
}

export interface VisualizationRecommendation {
  type: 'line' | 'bar' | 'heatmap' | 'network' | 'pie' | 'area' | 'scatter';
  title: string;
  description: string;
  dataSource: string;
}

// Analysis Filter Options
export interface TrendFilterOptions {
  startYear?: number;
  endYear?: number;
  startDate?: string; // YYYY-MM-DD format
  limit?: number;
  technologies?: string[];
  countries?: string[];
  assignees?: string[];
  patentTypes?: string[];
  minCitations?: number;
}

// Cache key interface
export interface TrendCacheKey {
  endpoint: string;
  filters: TrendFilterOptions;
  timestamp?: number;
}
