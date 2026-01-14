// Trademark Trend Analysis Types

// Code Distribution (International Classification)
export interface CodeDistributionDto {
  code: string;
  count: number;
  percentage: number;
}

// Simple Count Distribution (Countries, Status)
export interface SimpleCountDto {
  label: string;
  count: number;
}

// Summary Metrics
export interface TrademarkSummaryMetrics {
  totalApplications: number;
  filingsByYear: Array<{
    year: number;
    count: number;
  }>;
  recentFilingActivity: {
    period: string;
    count: number;
    changePercent: number;
  };
}

// Trademark Summary Response
export interface TrademarkSummaryResponse {
  data: TrademarkSummaryMetrics;
}

// Classification Trends Response
export interface ClassificationTrendsResponse {
  data: CodeDistributionDto[];
}

// Geographic Trends Response
export interface GeographicTrendsResponse {
  data: SimpleCountDto[];
}

// Status Distribution Response
export interface StatusDistributionResponse {
  data: SimpleCountDto[];
}

// Aggregated Trademark Trend Data (for dashboard)
export interface AggregatedTrademarkTrendData {
  summary: TrademarkSummaryMetrics;
  topClasses: CodeDistributionDto[];
  topCountries: SimpleCountDto[];
  statusDistribution: SimpleCountDto[];
  timestamp: string;
}

// Executive Insight
export interface ExecutiveInsight {
  title: string;
  content: string;
  severity: 'high' | 'medium' | 'low'; // high = significant finding, low = minor trend
}

// Trend Interpretation
export interface TrendInterpretation {
  growthAnalysis: string;
  concentrationAnalysis: string;
  stabilityAnalysis: string;
}

// Business Implication
export interface BusinessImplication {
  category: string; // e.g., "Market Saturation", "Geographic Focus", "Brand Lifecycle"
  insight: string;
  recommendation?: string;
}

// Visualization Recommendation
export interface VisualizationRecommendation {
  type: 'line' | 'bar' | 'pie' | 'map' | 'heatmap';
  title: string;
  description: string;
  dataSource: 'summary' | 'classes' | 'countries' | 'status';
}

// Complete Trademark Trend Analysis Report
export interface TrademarkTrendAnalysisReport {
  period: {
    generatedAt: string;
    timeRange: string;
  };
  executiveSummary: ExecutiveInsight[];
  trendInterpretation: TrendInterpretation;
  businessImplications: BusinessImplication[];
  visualizationRecommendations: VisualizationRecommendation[];
  rawData: {
    summary: TrademarkSummaryMetrics;
    topClasses: CodeDistributionDto[];
    topCountries: SimpleCountDto[];
    statusDistribution: SimpleCountDto[];
  };
}

// Filter Options for trademark trends
export interface TrademarkTrendFilterOptions {
  startYear?: number;
  endYear?: number;
  countries?: string[];
  status?: string[];
}
