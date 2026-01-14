/**
 * Trademark Card Configuration for Lazy-Loading Dashboard
 * Similar to patent trends - each card loads on demand
 */

import trademarkTrendAPI from '../../services/trademarkTrendAPI';

export interface TrademarkCardConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  fetchFunction: () => Promise<any>;
}

export const TRADEMARK_CARDS: TrademarkCardConfig[] = [
  {
    id: 'summary',
    title: 'Summary Metrics',
    icon: '📊',
    description: 'Total applications, filings by year, recent activity',
    fetchFunction: () => trademarkTrendAPI.getSummary().then(r => r.data),
  },
  {
    id: 'top-classes',
    title: 'Top Classes',
    icon: '🏷️',
    description: 'International classes with highest branding activity',
    fetchFunction: () => trademarkTrendAPI.getTopClasses().then(r => r.data),
  },
  {
    id: 'top-countries',
    title: 'Top Countries',
    icon: '🌍',
    description: 'Geographic distribution of trademark ownership',
    fetchFunction: () => trademarkTrendAPI.getTopCountries().then(r => r.data),
  },
  {
    id: 'status-distribution',
    title: 'Status Distribution',
    icon: '✅',
    description: 'Brand lifecycle: LIVE, DEAD, and other statuses',
    fetchFunction: () => trademarkTrendAPI.getStatusDistribution().then(r => r.data),
  },
];

export default TRADEMARK_CARDS;
