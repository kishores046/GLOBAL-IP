import trendAnalysisAPI from '../../services/trendAnalysisAPI';
import { TrendFilterOptions } from '../../types/trends';

export interface TrendCardConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  fetchFunction: (filters?: TrendFilterOptions, limit?: number) => Promise<any>;
}

export const TREND_CARDS: TrendCardConfig[] = [
  {
    id: 'filing-trends',
    title: 'Filing Trends',
    icon: '📈',
    description: 'Patent filing volume over time',
    fetchFunction: (filters) => trendAnalysisAPI.getFilingTrends(filters),
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
  },
  {
    id: 'top-assignees',
    title: 'Top Assignees',
    icon: '🏢',
    description: 'Leading patent assignees',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getTopAssignees(filters, limit || 10),
  },
  {
    id: 'country-distribution',
    title: 'Country Distribution',
    icon: '🌍',
    description: 'Geographic patent distribution',
    fetchFunction: () => trendAnalysisAPI.getUnifiedCountryTrends(),
  },
  {
    id: 'top-cited-patents',
    title: 'Top Cited Patents',
    icon: '🔗',
    description: 'Most frequently cited patents',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getCitationTrends(filters, limit || 10),
  },
  {
    id: 'top-citing-patents',
    title: 'Top Citing Patents',
    icon: '🧷',
    description: 'Patents that cite the most',
    fetchFunction: (filters, limit) => trendAnalysisAPI.getCitationTrends(filters, limit || 10),
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
  },
];

export default TREND_CARDS;
