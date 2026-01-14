import { useState, useEffect, useCallback } from 'react';
import {
  FilingTrendResponse,
  TechnologyTrendResponse,
  AssigneeTrendResponse,
  CountryTrendResponse,
  CitationTrendResponse,
  PatentQualityResponse,
  TrendAnalysisReport,
  TrendFilterOptions,
  InsightSummary,
} from '../types/trends';
import trendAnalysisAPI from '../services/trendAnalysisAPI';

interface UseTrendReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Generic trend hook
const useTrendData = <T,>(
  fetchFunction: (filters?: TrendFilterOptions) => Promise<T>,
  filters?: TrendFilterOptions,
  enabled: boolean = true
): UseTrendReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching trend data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, filters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Filing Trends Hook
export const useFilingTrends = (
  filters?: TrendFilterOptions,
  enabled: boolean = true
): UseTrendReturn<FilingTrendResponse> => {
  return useTrendData(trendAnalysisAPI.getFilingTrends, filters, enabled);
};

// Technology Trends Hook
export const useTechnologyTrends = (
  filters?: TrendFilterOptions,
  enabled: boolean = true
): UseTrendReturn<TechnologyTrendResponse> => {
  return useTrendData(trendAnalysisAPI.getTechnologyEvolution, filters, enabled);
};

// Assignee Trends Hook
export const useAssigneeTrends = (
  filters?: TrendFilterOptions,
  enabled: boolean = true
): UseTrendReturn<AssigneeTrendResponse> => {
  return useTrendData(trendAnalysisAPI.getTopAssignees, filters, enabled);
};

// Country Trends Hook
export const useCountryTrends = (
  filters?: TrendFilterOptions,
  enabled: boolean = true
): UseTrendReturn<CountryTrendResponse> => {
  return useTrendData(trendAnalysisAPI.getCountryTrends, filters, enabled);
};

// Citation Trends Hook
export const useCitationAnalytics = (
  filters?: TrendFilterOptions,
  enabled: boolean = true
): UseTrendReturn<CitationTrendResponse> => {
  return useTrendData(trendAnalysisAPI.getCitationTrends, filters, enabled);
};

// Patent Quality Hook
export const usePatentQuality = (
  filters?: TrendFilterOptions,
  enabled: boolean = true
): UseTrendReturn<PatentQualityResponse> => {
  return useTrendData(trendAnalysisAPI.getPatentQuality, filters, enabled);
};

// Helper functions to reduce cognitive complexity
const getTrendDescription = (trend: string): string => {
  const trendMap: Record<string, string> = {
    'growing': 'accelerating',
    'declining': 'slowing',
    'stable': 'steady',
  };
  return `Current filing trend is ${trend}, suggesting ${trendMap[trend] || 'steady'} innovation pace`;
};

const getBusinessImplications = (trend: string): string[] => {
  const firstItem = trend === 'growing' 
    ? 'Increased competition - monitor filing strategies of key competitors' 
    : 'Market slowdown - review portfolio adequacy and R&D focus';
  return [
    firstItem,
    'Grant delays impact time-to-market strategies and competitive advantage windows',
    'High-complexity patents take longer to grant - factor into product launch planning',
  ];
};

const getTechList = (techs: any[]): string => {
  return techs.map(t => `${t.cpcGroup} (${t.cpcDescription})`).join(', ') || 'None identified';
};

const getDeclinningTechList = (techs: any[]): string => {
  return techs.map(t => t.cpcGroup).join(', ') || 'Core technologies remain stable';
};

// Full Report Hook
export const useTrendAnalysisReport = (
  filters?: TrendFilterOptions,
  enabled: boolean = true
): UseTrendReturn<TrendAnalysisReport> => {
  return useTrendData(trendAnalysisAPI.getFullTrendReport, filters, enabled);
};

// Insight Generation Hook
export const useGenerateTrendInsights = (data: TrendAnalysisReport | null): InsightSummary[] => {
  const [insights, setInsights] = useState<InsightSummary[]>([]);

  useEffect(() => {
    if (!data) {
      setInsights([]);
      return;
    }

    const generatedInsights: InsightSummary[] = [];

    // Filing Trends Insight
    if (data.filingTrends?.data?.length) {
      const trends = data.filingTrends.data;
      const latestYear = trends[trends.length - 1];
      const previousYear = trends[trends.length - 2];

      let trend = 'stable';
      if (latestYear && previousYear && latestYear.filingCount > previousYear.filingCount * 1.1) {
        trend = 'growing';
      } else if (latestYear && previousYear && latestYear.filingCount < previousYear.filingCount * 0.9) {
        trend = 'declining';
      }

      const peakYear = trends.reduce((max, curr) =>
        curr.filingCount > max.filingCount ? curr : max
      , trends[0]);

      generatedInsights.push({
        title: 'Filing & Grant Activity',
        bullets: [
          `Patent filings peaked in ${peakYear.year} with ${peakYear.filingCount} filings, indicating strong innovation activity`,
          getTrendDescription(trend),
          `Average grant rate: ${(data.filingTrends.data.reduce((sum, d) => sum + d.grantRate, 0) / data.filingTrends.data.length).toFixed(1)}%, reflecting examination efficiency`,
        ],
        interpretation: trend === 'growing'
          ? 'The sustained growth in filings indicates strong R&D investment and competitive innovation activity. The rising trend suggests companies are actively protecting new intellectual property.'
          : trend === 'declining'
            ? 'Declining filing activity may indicate market consolidation, resource constraints, or a shift in R&D priorities. This warrants deeper analysis into industry-specific factors.'
            : 'Stable filing volumes suggest mature innovation cycles. Consistency in grant rates indicates predictable examination timelines.',
        businessImplications: getBusinessImplications(trend),
        suggestedVisualizations: [
          {
            type: 'line',
            title: 'Filing & Grant Trends Over Time',
            description: 'Line chart showing filing volume and grant count side-by-side to identify divergence patterns',
            dataSource: 'Filing Trends Data',
          },
          {
            type: 'area',
            title: 'Grant Rate Evolution',
            description: 'Area chart showing grant rate changes year-over-year to identify examination complexity trends',
            dataSource: 'Grant Rate by Year',
          },
        ],
      });
    }

    // Technology Trends Insight
    if (data.technologyTrends?.evolutionData?.length) {
      const topTechs = data.technologyTrends.evolutionData
        .toSorted((a, b) => b.totalCount - a.totalCount)
        .slice(0, 5);

      const risingTechs = topTechs.filter(t => t.trend === 'rising');
      const decliningTechs = topTechs.filter(t => t.trend === 'declining');
      
      const risingTechsList = getTechList(risingTechs);
      const decliningTechsList = getDeclinningTechList(decliningTechs);

      generatedInsights.push({
        title: 'Technology Domain Evolution',
        bullets: [
          `Top 5 technologies account for significant share: ${topTechs.map(t => t.cpcGroup).join(', ')}`,
          `Rising technologies: ${risingTechsList}`,
          `Declining interest in: ${decliningTechsList}`,
        ],
        interpretation: `Technology landscape shows clear shift toward ${risingTechs[0]?.cpcDescription || 'emerging fields'}. This reflects industry-wide adoption of new innovations and represents key strategic opportunities.`,
        businessImplications: [
          'Rising technologies present growth opportunities - consider expanding portfolio coverage',
          'Declining tech areas may indicate market saturation or technological obsolescence',
          'Diversification across emerging domains reduces innovation risk',
        ],
        suggestedVisualizations: [
          {
            type: 'line',
            title: 'Technology Adoption Curves',
            description: 'Multi-line chart tracking evolution of top 5 technology domains over time',
            dataSource: 'Technology Evolution Data',
          },
          {
            type: 'bar',
            title: 'Technology Domain Ranking',
            description: 'Bar chart showing patent count distribution across CPC groups',
            dataSource: 'Top Technologies',
          },
        ],
      });
    }

    // Assignee Trends Insight
    if (data.assigneeTrends?.topAssignees?.length) {
      const top3 = data.assigneeTrends.topAssignees.slice(0, 3);
      const marketShare = (top3.reduce((sum, a) => sum + (a.marketShare || 0), 0) / data.assigneeTrends.topAssignees.length * 100).toFixed(1);

      generatedInsights.push({
        title: 'Innovation Leadership & Market Concentration',
        bullets: [
          `Market concentration: Top 3 assignees (${top3.map(a => a.assigneeName).join(', ')}) control significant patent portfolio`,
          `Top innovator: ${top3[0]?.assigneeName || 'N/A'} with ${top3[0]?.patentCount || 0} patents`,
          `Market demonstrates ${parseFloat(marketShare) > 40 ? 'high concentration' : 'distributed innovation'} - ${marketShare}% from top players`,
        ],
        interpretation: parseFloat(marketShare) > 40
          ? 'High market concentration indicates dominant players controlling key technologies. This creates competitive challenges for smaller players.'
          : 'Distributed innovation landscape shows diverse R&D across multiple players, indicating healthy competition and reduced single-source dependency.',
        businessImplications: [
          parseFloat(marketShare) > 40 ? 'Monitor dominant players closely for technology trends and licensing opportunities' : 'Opportunity exists for niche innovation leadership',
          'Patent clustering around specific assignees suggests technology partnerships or M&A targets',
          'Portfolio gaps relative to leaders identify areas for strategic acquisition',
        ],
        suggestedVisualizations: [
          {
            type: 'bar',
            title: 'Top Patent Assignees',
            description: 'Horizontal bar chart showing patent count distribution among leading companies',
            dataSource: 'Top Assignees Data',
          },
          {
            type: 'pie',
            title: 'Market Share Distribution',
            description: 'Pie chart visualizing patent portfolio concentration',
            dataSource: 'Assignee Market Share',
          },
        ],
      });
    }

    // Geographic Trends Insight
    if (data.countryTrends?.countries?.length) {
      const top5Countries = data.countryTrends.countries
        .toSorted((a, b) => b.patentCount - a.patentCount)
        .slice(0, 5);
      const totalCount = data.countryTrends.countries.reduce((sum, c) => sum + c.patentCount, 0);
      const top5Share = (top5Countries.reduce((sum, c) => sum + c.patentCount, 0) / totalCount * 100).toFixed(1);

      generatedInsights.push({
        title: 'Geographic Innovation Concentration',
        bullets: [
          `Top 5 geographic regions: ${top5Countries.map(c => c.countryName).join(', ')}`,
          `Geographic concentration: Top 5 regions account for ${top5Share}% of all patents`,
          `Leader: ${top5Countries[0]?.countryName} with ${top5Countries[0]?.patentCount} patents`,
        ],
        interpretation: `Innovation activity is heavily concentrated in ${top5Countries[0]?.countryName} and select developed economies. This reflects advanced R&D infrastructure and strong IP protection frameworks in these regions.`,
        businessImplications: [
          'R&D resources concentrated in specific geographies - consider localization strategies',
          'Market access requires understanding regional IP landscapes',
          'Emerging markets show growing but still limited patent activity',
        ],
        suggestedVisualizations: [
          {
            type: 'bar',
            title: 'Patent Volume by Country',
            description: 'Bar chart showing patent count distribution across leading countries',
            dataSource: 'Country Trends Data',
          },
          {
            type: 'heatmap',
            title: 'Geographic Innovation Heatmap',
            description: 'Geographic heatmap showing patent density by region over time',
            dataSource: 'Country Year Distribution',
          },
        ],
      });
    }

    // Citation Analytics Insight
    if (data.citationTrends?.topCited?.length) {
      const topCited = data.citationTrends.topCited.slice(0, 3);
      const avgCitations = data.citationTrends.topCited.reduce((sum, p) => sum + p.citationCount, 0) / data.citationTrends.topCited.length;
      const citationList = topCited.map(p => `${p.patentId} (${p.citationCount} citations)`).join(', ');
      const citationType = avgCitations > 50 ? 'pioneering technologies' : 'niche innovations';

      generatedInsights.push({
        title: 'Citation Analytics & Technological Influence',
        bullets: [
          `Most influential patents: ${citationList}`,
          `Average citations per highly-cited patent: ${avgCitations.toFixed(0)}, indicating foundational technology value`,
          `Citation density suggests ${citationType} in the patent landscape`,
        ],
        interpretation: `Highly-cited patents represent foundational technologies that other inventors build upon. These patents have disproportionate influence on the technology landscape and may indicate market-defining innovations.`,
        businessImplications: [
          'Highly-cited patents represent core technologies - strong licensing and litigation targets',
          'Patents rarely cited may indicate niche applications or obsolete technology',
          'Citation analysis reveals technology dependencies and innovation relationships',
        ],
        suggestedVisualizations: [
          {
            type: 'network',
            title: 'Citation Network Graph',
            description: 'Network visualization showing citation relationships between patents',
            dataSource: 'Citation Relationships',
          },
          {
            type: 'bar',
            title: 'Most-Cited Patents',
            description: 'Bar chart ranking patents by citation count',
            dataSource: 'Top Cited Patents',
          },
        ],
      });
    }

    // Patent Quality Insight
    if (data.qualityTrends?.claimComplexity?.length) {
      const latestQuality = data.qualityTrends.claimComplexity[data.qualityTrends.claimComplexity.length - 1];
      const earliestQuality = data.qualityTrends.claimComplexity[0];
      const complexityTrend = latestQuality.averageClaimCount > earliestQuality.averageClaimCount ? 'increasing' : 'decreasing';

      generatedInsights.push({
        title: 'Patent Quality & Legal Strength',
        bullets: [
          `Average claim complexity: ${latestQuality.averageClaimCount.toFixed(1)} claims per patent (trend: ${complexityTrend})`,
          `Patent examination takes an average of ${data.qualityTrends.timeToGrant[data.qualityTrends.timeToGrant.length - 1]?.averageDaysToGrant.toFixed(0) || 'N/A'} days to grant`,
          `${complexityTrend === 'increasing' ? 'Rising claim counts indicate more robust legal protection' : 'Simplified claims suggest streamlined prosecution strategies'}`,
        ],
        interpretation: complexityTrend === 'increasing'
          ? 'Increasing claim complexity reflects stronger legal protection strategies and more comprehensive technology coverage. Examiners may require more time to evaluate complex applications.'
          : 'Streamlined claims suggest focus on clear, defensible inventions. May indicate faster prosecution but potentially narrower protection.',
        businessImplications: [
          complexityTrend === 'increasing' ? 'More complex patents offer broader legal protection but increase enforcement costs' : 'Simpler patents faster to obtain but may have narrower scope',
          'Long grant times suggest detailed examination - valuable for legal defensibility',
          'Claim complexity correlates with patent value and enforcement potential',
        ],
        suggestedVisualizations: [
          {
            type: 'line',
            title: 'Claim Complexity Trend',
            description: 'Line chart showing average claim count evolution over time',
            dataSource: 'Claim Complexity Data',
          },
          {
            type: 'line',
            title: 'Time to Grant Evolution',
            description: 'Line chart showing examination duration trends',
            dataSource: 'Time to Grant Data',
          },
        ],
      });
    }

    setInsights(generatedInsights);
  }, [data]);

  return insights;
};
