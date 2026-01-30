import trendAnalysisAPI from '../../services/trendAnalysisAPI';
import { TrendFilterOptions } from '../../types/trends';

export interface TrendCardConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  fetchFunction: (filters?: TrendFilterOptions, limit?: number) => Promise<any>;
  // Optional hint for the UI which filters this card accepts (client-only)
  acceptsFilters?: {
    startYear?: boolean;
    endYear?: boolean;
    limit?: boolean;
    clientSlice?: boolean; // e.g. technology evolution can be client-sliced by year
  };
}

export const TREND_CARDS: TrendCardConfig[] = [
  {
    id: 'filing-trends',
    title: 'Filing Trends',
    icon: '📈',
    description: 'Patent filing volume over time',
    fetchFunction: (filters) => trendAnalysisAPI.getFilingTrends(filters),
    // Filing trends show full historical data on the viewer — do not expose per-card filters
    acceptsFilters: {},
  },
  {
    id: 'grant-trends',
    title: 'Grant Trends',
    icon: '🏆',
    description: 'Grant approval trends and rates',
    fetchFunction: (filters) => trendAnalysisAPI.getGrantTrends(filters),
  },
  {
    id: 'top-technologies',
    title: 'Top Technologies',
    icon: '🧠',
    description: 'Leading technology domains',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getTechnologyTrends(filters, limit || 10),
    acceptsFilters: { limit: true },
  },
  {
    id: 'top-assignees',
    title: 'Top Assignees',
    icon: '🏢',
    description: 'Leading patent assignees',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getTopAssignees(filters, limit || 10),
    acceptsFilters: { limit: true },
  },
  {
    id: 'country-distribution',
    title: 'Country Distribution',
    icon: '🌍',
    description: 'Geographic patent distribution',
    // Use country trends endpoint and allow client-specified start year + limit
    fetchFunction: (filters, limit) => trendAnalysisAPI.getCountryTrends(filters, limit || 10),
    acceptsFilters: { startYear: true, limit: true },
  },
  {
    id: 'top-cited-patents',
    title: 'Top Cited Patents',
    icon: '🔗',
    description: 'Most frequently cited patents',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getCitationTrends(filters, limit || 10),
    acceptsFilters: { limit: true },
  },
  {
    id: 'top-citing-patents',
    title: 'Top Citing Patents',
    icon: '🧷',
    description: 'Patents that cite the most',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getCitationTrends(filters, limit || 10),
    acceptsFilters: { limit: true },
  },
  {
    id: 'patent-type-distribution',
    title: 'Patent Type Distribution',
    icon: '📊',
    description: 'Detailed breakdown of all patent types',
    fetchFunction: () => trendAnalysisAPI.getPatentTypeDistribution(),
  },
  {
    id: 'claim-complexity',
    title: 'Claim Complexity',
    icon: '🧩',
    description: 'Patent claim complexity metrics',
    fetchFunction: () => trendAnalysisAPI.getClaimComplexity(),
  },
  {
    id: 'time-to-grant',
    title: 'Time to Grant',
    icon: '⏱️',
    description: 'Average time from filing to grant',
    fetchFunction: () => trendAnalysisAPI.getTimeToGrant(),
  },
  {
    id: 'epo-family-trends',
    title: 'EPO Family Trends',
    icon: '👨‍👩‍👧‍👦',
    description: 'Patent family size distribution from EPO',
    fetchFunction: () => trendAnalysisAPI.getEpoFamilyTrends(),
    acceptsFilters: {},
  },
  // European (frontend) cards — labelled "European ..." per UX guidance
  {
    id: 'european-filings',
    title: 'European Filing Trends',
    icon: '🇪🇺',
    description: 'Patent filing volume for European jurisdictions',
    fetchFunction: (filters) => trendAnalysisAPI.getEpoFilings(filters),
    acceptsFilters: { startYear: true, endYear: true },
  },
  {
    id: 'european-country-distribution',
    title: 'European Country Distribution',
    icon: '🗺️',
    description: 'Country distribution for European filings',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getEpoCountries(filters, limit || 10),
    acceptsFilters: { startYear: true, limit: true },
  },
  {
    id: 'european-top-assignees',
    title: 'European Top Assignees',
    icon: '🏛️',
    description: 'Leading assignees in Europe',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getEpoAssignees(filters, limit || 10),
    acceptsFilters: { limit: true },
  },
];

export default TREND_CARDS;
