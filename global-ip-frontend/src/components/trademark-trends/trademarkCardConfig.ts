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

// Mock data for fallback when API is unavailable
const MOCK_DATA = {
  summary: {
    totalApplications: 12547,
    filingsByYear: [
      { year: 2019, count: 1200 },
      { year: 2020, count: 1450 },
      { year: 2021, count: 1890 },
      { year: 2022, count: 2340 },
      { year: 2023, count: 2670 },
      { year: 2024, count: 2956 },
    ],
    recentActivity: {
      newFilings: 234,
      renewals: 156,
      abandonments: 45,
      registrations: 189,
    },
  },
  classes: [
    { code: '25', label: 'Clothing, footwear', count: 1456 },
    { code: '35', label: 'Business services', count: 1234 },
    { code: '41', label: 'Education, entertainment', count: 987 },
    { code: '09', label: 'Software, electronics', count: 856 },
    { code: '42', label: 'Technology services', count: 745 },
  ],
  countries: [
    { name: 'United States', count: 3456 },
    { name: 'European Union', count: 2890 },
    { name: 'China', count: 2145 },
    { name: 'Japan', count: 1890 },
    { name: 'United Kingdom', count: 1567 },
  ],
  status: [
    { name: 'LIVE', count: 8934 },
    { name: 'DEAD', count: 2345 },
    { name: 'PENDING', count: 1268 },
  ],
};

export const TRADEMARK_CARDS: TrademarkCardConfig[] = [
  {
    id: 'summary',
    title: 'Summary Metrics',
    icon: '📊',
    description: 'Total applications, filings by year, recent activity',
    fetchFunction: async () => {
      try {
        const result = await trademarkTrendAPI.getSummary();
        return result.data;
      } catch (error) {
        console.warn('[TrademarkCards] Summary API failed, using mock data:', error);
        return MOCK_DATA.summary;
      }
    },
  },
  {
    id: 'top-classes',
    title: 'Top Classes',
    icon: '🏷️',
    description: 'International classes with highest branding activity',
    fetchFunction: async () => {
      try {
        const result = await trademarkTrendAPI.getTopClasses();
        return result.data;
      } catch (error) {
        console.warn('[TrademarkCards] Classes API failed, using mock data:', error);
        return MOCK_DATA.classes;
      }
    },
  },
  {
    id: 'top-countries',
    title: 'Top Countries',
    icon: '🌍',
    description: 'Geographic distribution of trademark ownership',
    fetchFunction: async () => {
      try {
        const result = await trademarkTrendAPI.getTopCountries();
        return result.data;
      } catch (error) {
        console.warn('[TrademarkCards] Countries API failed, using mock data:', error);
        return MOCK_DATA.countries;
      }
    },
  },
  {
    id: 'status-distribution',
    title: 'Status Distribution',
    icon: '✅',
    description: 'Brand lifecycle: LIVE, DEAD, and other statuses',
    fetchFunction: async () => {
      try {
        const result = await trademarkTrendAPI.getStatusDistribution();
        return result.data;
      } catch (error) {
        console.warn('[TrademarkCards] Status API failed, using mock data:', error);
        return MOCK_DATA.status;
      }
    },
  },
];

export default TRADEMARK_CARDS;
