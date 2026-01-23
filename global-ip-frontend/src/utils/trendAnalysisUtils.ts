/**
 * Utility functions for trend analysis and data transformation
 */

import {
  FilingTrendData,
  TechnologyEvolutionData,
  AssigneeTrendData,
  CountryTrendData,
  CitedPatentData,
} from '../types/trends';

/**
 * Calculate year-over-year growth rate
 */
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Identify trend direction based on recent data points
 */
export const identifyTrendDirection = (
  data: Array<{ value: number; year?: number }>,
  periods: number = 3
): 'rising' | 'declining' | 'stable' => {
  if (data.length < 2) return 'stable';

  const recent = data.slice(-periods);
  if (recent.length < 2) return 'stable';

  const avgRecent = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
  const avgPrevious =
    recent.length > 1
      ? recent.slice(0, -1).reduce((sum, d) => sum + d.value, 0) / (recent.length - 1)
      : recent[0].value;

  const growth = calculateGrowthRate(avgRecent, avgPrevious);

  if (Math.abs(growth) < 5) return 'stable';
  return growth > 0 ? 'rising' : 'declining';
};

/**
 * Calculate market concentration index (HHI - Herfindahl-Hirschman Index)
 * Higher value indicates more concentration (max 10,000)
 */
export const calculateMarketConcentration = (
  assignees: AssigneeTrendData[]
): { hhi: number; level: 'high' | 'moderate' | 'competitive' } => {
  if (assignees.length === 0) return { hhi: 0, level: 'competitive' };

  const total = assignees.reduce((sum, a) => sum + a.patentCount, 0);
  const shares = assignees.map(a => ((a.patentCount / total) * 100) ** 2);
  const hhi = shares.reduce((sum, share) => sum + share, 0);

  // Standard FTC thresholds:
  // HHI > 2500 = High concentration
  // HHI 1500-2500 = Moderate concentration
  // HHI < 1500 = Competitive

  let level: 'high' | 'moderate' | 'competitive';
  if (hhi > 2500) level = 'high';
  else if (hhi > 1500) level = 'moderate';
  else level = 'competitive';

  return { hhi, level };
};

/**
 * Calculate geographic dispersion index
 * Higher value indicates more distributed innovation
 */
export const calculateGeographicDispersion = (countries: CountryTrendData[]): number => {
  if (countries.length === 0) return 0;

  const total = countries.reduce((sum, c) => sum + c.patentCount, 0);
  const herfindahl = countries.reduce((sum, c) => {
    const share = c.patentCount / total;
    return sum + share * share;
  }, 0);

  // Normalize to 0-100 scale (where 100 = perfect distribution)
  return (1 - herfindahl) * 100;
};

/**
 * Identify inflection points in trend data
 * Useful for detecting significant changes in activity
 */
export const findInflectionPoints = (
  data: FilingTrendData[],
  threshold: number = 20 // percentage change threshold
): Array<{ year: number; type: 'spike' | 'drop'; change: number }> => {
  const inflections: Array<{ year: number; type: 'spike' | 'drop'; change: number }> = [];

  for (let i = 1; i < data.length; i++) {
    const prevYear = data[i - 1];
    const currYear = data[i];
    const change = calculateGrowthRate(currYear.filingCount, prevYear.filingCount);

    if (Math.abs(change) >= threshold) {
      inflections.push({
        year: currYear.year,
        type: change > 0 ? 'spike' : 'drop',
        change,
      });
    }
  }

  return inflections;
};

/**
 * Calculate technology diversification index
 * Measures how evenly distributed patents are across technology domains
 */
export const calculateTechDiversification = (technologies: TechnologyEvolutionData[]): number => {
  if (technologies.length === 0) return 0;

  const total = technologies.reduce((sum, t) => sum + t.totalCount, 0);
  const herfindahl = technologies.reduce((sum, t) => {
    const share = t.totalCount / total;
    return sum + share * share;
  }, 0);

  // Normalize to 0-100 scale
  return (1 - herfindahl) * 100;
};

/**
 * Identify patent "influencers" - patents with high citation impact
 */
export const identifyInfluencers = (
  patents: CitedPatentData[],
  threshold: number = 75 // percentile
): CitedPatentData[] => {
  if (patents.length === 0) return [];

  const sorted = [...patents].sort((a, b) => b.citationCount - a.citationCount);
  const cutoffIndex = Math.ceil((threshold / 100) * sorted.length);

  return sorted.slice(0, cutoffIndex);
};

/**
 * Calculate citation intensity (citations per patent in field)
 */
export const calculateCitationIntensity = (
  patents: CitedPatentData[]
): { average: number; median: number; max: number } => {
  if (patents.length === 0) {
    return { average: 0, median: 0, max: 0 };
  }

  const citations = patents.map(p => p.citationCount).sort((a, b) => a - b);
  const average = citations.reduce((sum, c) => sum + c, 0) / citations.length;
  const median = citations[Math.floor(citations.length / 2)];
  const max = Math.max(...citations);

  return { average, median, max };
};

/**
 * Categorize countries by development level based on patent activity
 */
export const categorizeCountriesByActivity = (
  countries: CountryTrendData[]
): {
  leaders: CountryTrendData[];
  emerging: CountryTrendData[];
  developing: CountryTrendData[];
} => {
  const sorted = [...countries].sort((a, b) => b.patentCount - a.patentCount);
  const total = sorted.reduce((sum, c) => sum + c.patentCount, 0);

  const leaders: CountryTrendData[] = [];
  const emerging: CountryTrendData[] = [];
  const developing: CountryTrendData[] = [];

  let cumulativeShare = 0;

  for (const country of sorted) {
    const share = country.patentCount / total;
    cumulativeShare += share;

    if (cumulativeShare <= 0.7) {
      // Top 70% are leaders
      leaders.push(country);
    } else if (cumulativeShare <= 0.9) {
      // Next 20% are emerging
      emerging.push(country);
    } else {
      // Bottom 10% are developing
      developing.push(country);
    }
  }

  return { leaders, emerging, developing };
};

/**
 * Calculate patent productivity ratio (grants / filings)
 */
export const calculateProductivityRatio = (filingData: FilingTrendData[]): number => {
  if (filingData.length === 0) return 0;

  const totalGrants = filingData.reduce((sum, d) => sum + d.grantCount, 0);
  const totalFilings = filingData.reduce((sum, d) => sum + d.filingCount, 0);

  return totalFilings > 0 ? totalGrants / totalFilings : 0;
};

/**
 * Estimate time-to-market impact based on grant lag
 */
export const assessTimeToMarketImpact = (
  avgDaysToGrant: number
): { impact: 'low' | 'moderate' | 'high'; interpretation: string } => {
  const yearsToGrant = avgDaysToGrant / 365;

  if (yearsToGrant < 2) {
    return {
      impact: 'low',
      interpretation: 'Fast examination enables quick market entry with patent protection',
    };
  } else if (yearsToGrant < 3.5) {
    return {
      impact: 'moderate',
      interpretation: 'Moderate examination time may require interim trade secret protection',
    };
  } else {
    return {
      impact: 'high',
      interpretation: 'Extended examination time significantly impacts time-to-market strategies',
    };
  }
};

/**
 * Identify technology transition periods
 * Where one technology rises as another declines
 */
export const identifyTechTransitions = (
  technologies: TechnologyEvolutionData[],
  crossoverThreshold: number = 10 // percentage points of difference
): Array<{
  risingTech: TechnologyEvolutionData;
  decliningTech: TechnologyEvolutionData;
  year?: number;
}> => {
  const transitions: Array<{
    risingTech: TechnologyEvolutionData;
    decliningTech: TechnologyEvolutionData;
  }> = [];

  const rising = technologies.filter(t => t.trend === 'rising');
  const declining = technologies.filter(t => t.trend === 'declining');

  for (const rise of rising) {
    for (const decline of declining) {
      // Check if they have significant growth/decline pattern
      if (
        rise.yearData &&
        decline.yearData &&
        rise.yearData.length > 0 &&
        decline.yearData.length > 0
      ) {
        const recentRise = rise.yearData[rise.yearData.length - 1]?.count || 0;
        const recentDecline = decline.yearData[decline.yearData.length - 1]?.count || 0;
        const diff = recentRise - recentDecline;

        if (diff > 0 && Math.abs(diff / Math.max(recentRise, recentDecline)) > crossoverThreshold / 100) {
          transitions.push({
            risingTech: rise,
            decliningTech: decline,
          });
        }
      }
    }
  }

  return transitions;
};

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 */
export const formatNumber = (num: number, decimals: number = 1): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
  return num.toFixed(0);
};

/**
 * Generate strategic recommendations based on trend analysis
 */
export const generateStrategicRecommendations = (
  trendDirection: 'rising' | 'declining' | 'stable',
  marketConcentration: 'high' | 'moderate' | 'competitive',
  citationIntensity: number
): string[] => {
  const recommendations: string[] = [];

  // Trend-based recommendations
  if (trendDirection === 'rising') {
    recommendations.push('Increase R&D investment in rising technologies');
    recommendations.push('Monitor competitive landscape for emerging players');
  } else if (trendDirection === 'declining') {
    recommendations.push('Review portfolio adequacy in core technologies');
    recommendations.push('Consider strategic partnerships or acquisitions');
  } else {
    recommendations.push('Maintain steady innovation pace in stable domains');
  }

  // Concentration-based recommendations
  if (marketConcentration === 'high') {
    recommendations.push('Identify licensing opportunities with market leaders');
    recommendations.push('Consider defensive patent strategies');
  } else if (marketConcentration === 'competitive') {
    recommendations.push('Differentiate through niche innovation leadership');
    recommendations.push('Build robust patent portfolio for competitive advantage');
  }

  // Citation-based recommendations
  if (citationIntensity > 50) {
    recommendations.push('Focus on foundational patents for technology control');
  } else if (citationIntensity < 10) {
    recommendations.push('Explore licensing of highly-cited patents in field');
  }

  return recommendations;
};
