import {
  AggregatedTrademarkTrendData,
  ExecutiveInsight,
  TrendInterpretation,
  BusinessImplication,
  VisualizationRecommendation,
  TrademarkTrendAnalysisReport,
  SimpleCountDto,
  CodeDistributionDto,
} from '../types/trademark-trends';

/**
 * Trademark Trend Analysis Intelligence Engine
 * Converts raw trademark data into business-ready analyst insights
 */
export class TrademarkTrendAnalyzer {
  private data: AggregatedTrademarkTrendData;

  constructor(data: AggregatedTrademarkTrendData) {
    this.data = data;
  }

  /**
   * Generate executive summary insights
   * High-level findings suitable for quick review
   */
  generateExecutiveSummary(): ExecutiveInsight[] {
    const insights: ExecutiveInsight[] = [];

    // Insight 1: Overall filing activity
    const summary = this.data.summary;
    if (summary.filingsByYear && summary.filingsByYear.length > 1) {
      const latestYear = summary.filingsByYear[summary.filingsByYear.length - 1];
      const previousYear = summary.filingsByYear[summary.filingsByYear.length - 2];
      const growthPercent = ((latestYear.count - previousYear.count) / previousYear.count) * 100;

      if (growthPercent > 10) {
        insights.push({
          title: 'Strong Filing Growth',
          content: `Trademark filings show sustained growth with a ${growthPercent.toFixed(1)}% increase year-over-year, indicating robust brand creation activity across the market.`,
          severity: 'high',
        });
      } else if (growthPercent < -10) {
        insights.push({
          title: 'Filing Activity Decline',
          content: `Trademark filings have declined by ${Math.abs(growthPercent).toFixed(1)}% compared to the previous year, suggesting market caution or saturation effects.`,
          severity: 'high',
        });
      } else {
        insights.push({
          title: 'Stable Filing Activity',
          content: `Trademark filings remain relatively stable with a ${growthPercent > 0 ? '+' : ''}${growthPercent.toFixed(1)}% change, indicating consistent brand protection strategy.`,
          severity: 'medium',
        });
      }
    }

    // Insight 2: Class concentration
    if (this.data.topClasses && this.data.topClasses.length > 0) {
      const topClass = this.data.topClasses[0];
      const concentration = topClass.percentage;

      if (concentration > 25) {
        insights.push({
          title: 'High Class Concentration',
          content: `International Class ${topClass.code} dominates with ${concentration.toFixed(1)}% of filings, indicating intense competition in this specific business sector. Higher brand conflict risk expected.`,
          severity: 'high',
        });
      } else if (concentration > 15) {
        insights.push({
          title: 'Moderate Class Concentration',
          content: `International Class ${topClass.code} represents ${concentration.toFixed(1)}% of filings, showing moderate branding activity concentration in this sector.`,
          severity: 'medium',
        });
      } else {
        insights.push({
          title: 'Diversified Class Portfolio',
          content: `Trademark filings are well-distributed across classes with no single class exceeding ${concentration.toFixed(1)}%, indicating broad branding strategy diversification.`,
          severity: 'low',
        });
      }
    }

    // Insight 3: Geographic focus
    if (this.data.topCountries && this.data.topCountries.length > 0) {
      const topCountry = this.data.topCountries[0];
      const topCountryShare = (topCountry.count / this.data.summary.totalApplications) * 100;

      if (topCountryShare > 40) {
        insights.push({
          title: 'Strong Geographic Concentration',
          content: `${topCountry.label} accounts for ${topCountryShare.toFixed(1)}% of trademark applications, indicating significant market dominance and strategic geographic focus.`,
          severity: 'high',
        });
      } else if (topCountryShare > 25) {
        insights.push({
          title: 'Moderate Geographic Focus',
          content: `${topCountry.label} leads with ${topCountryShare.toFixed(1)}% of filings, indicating a primary market for brand protection efforts.`,
          severity: 'medium',
        });
      } else {
        insights.push({
          title: 'Geographically Distributed',
          content: `Trademark filings are dispersed across multiple regions with ${topCountry.label} leading at ${topCountryShare.toFixed(1)}%, suggesting globally-oriented branding strategy.`,
          severity: 'low',
        });
      }
    }

    // Insight 4: Brand lifecycle health
    if (this.data.statusDistribution && this.data.statusDistribution.length > 0) {
      const liveStatus = this.data.statusDistribution.find(s => s.label.toUpperCase() === 'LIVE');
      const deadStatus = this.data.statusDistribution.find(s => s.label.toUpperCase() === 'DEAD');

      if (liveStatus && deadStatus) {
        const deadRatio = (deadStatus.count / (liveStatus.count + deadStatus.count)) * 100;

        if (deadRatio > 30) {
          insights.push({
            title: 'Brand Longevity Concern',
            content: `${deadRatio.toFixed(1)}% of trademarks are inactive/cancelled, indicating potential weak brand longevity or market consolidation.`,
            severity: 'high',
          });
        } else if (deadRatio > 15) {
          insights.push({
            title: 'Moderate Brand Churn',
            content: `${deadRatio.toFixed(1)}% of trademarks are inactive, which is within normal range but warrants monitoring for brand lifecycle trends.`,
            severity: 'medium',
          });
        } else {
          insights.push({
            title: 'Strong Brand Longevity',
            content: `${(100 - deadRatio).toFixed(1)}% of trademarks remain active, indicating strong brand sustainability and effective protection strategies.`,
            severity: 'low',
          });
        }
      }
    }

    return insights;
  }

  /**
   * Generate trend interpretation
   * Analyzes growth, concentration, and stability patterns
   */
  generateTrendInterpretation(): TrendInterpretation {
    // Growth Analysis
    const summary = this.data.summary;
    let growthAnalysis = '';

    if (summary.filingsByYear && summary.filingsByYear.length > 2) {
      const recentYears = summary.filingsByYear.slice(-3);
      const trend = recentYears.map(y => y.count);
      const isIncreasing = trend[1] >= trend[0] && trend[2] >= trend[1];
      const isDecreasing = trend[1] <= trend[0] && trend[2] <= trend[1];

      if (isIncreasing) {
        growthAnalysis = 'Filing volumes show consistent upward trajectory across the past three years, reflecting sustained brand creation momentum and market expansion.';
      } else if (isDecreasing) {
        growthAnalysis = 'Filing volumes exhibit declining trend over the past three years, potentially indicating market maturation, economic headwinds, or strategic consolidation.';
      } else {
        growthAnalysis = 'Filing volumes fluctuate within a range, suggesting cyclical market behavior with neither clear growth nor decline.';
      }
    }

    // Concentration Analysis
    let concentrationAnalysis = '';
    if (this.data.topClasses && this.data.topClasses.length > 0) {
      const topThreeShare = this.data.topClasses.slice(0, 3).reduce((sum, c) => sum + c.percentage, 0);

      if (topThreeShare > 60) {
        concentrationAnalysis = `Top three classes account for ${topThreeShare.toFixed(1)}% of filings, indicating high market concentration and competitive saturation in specific sectors.`;
      } else if (topThreeShare > 40) {
        concentrationAnalysis = `Top three classes represent ${topThreeShare.toFixed(1)}% of filings, showing moderate concentration with reasonable diversification across sectors.`;
      } else {
        concentrationAnalysis = `Top three classes comprise only ${topThreeShare.toFixed(1)}% of filings, indicating healthy diversification across multiple business sectors.`;
      }
    }

    // Stability Analysis
    let stabilityAnalysis = '';
    if (this.data.statusDistribution && this.data.statusDistribution.length > 0) {
      const liveStatus = this.data.statusDistribution.find(s => s.label.toUpperCase() === 'LIVE');
      const activeRate = liveStatus ? (liveStatus.count / this.data.summary.totalApplications) * 100 : 0;

      if (activeRate > 85) {
        stabilityAnalysis = `Portfolio stability is strong with ${activeRate.toFixed(1)}% active brands, reflecting effective brand protection and maintenance.`;
      } else if (activeRate > 70) {
        stabilityAnalysis = `Portfolio maintains moderate stability with ${activeRate.toFixed(1)}% active trademarks, with expected natural brand lifecycle transitions.`;
      } else {
        stabilityAnalysis = `Portfolio stability is lower with only ${activeRate.toFixed(1)}% active trademarks, suggesting either recent consolidation or maintenance challenges.`;
      }
    }

    return {
      growthAnalysis,
      concentrationAnalysis,
      stabilityAnalysis,
    };
  }

  /**
   * Generate business implications
   * Strategic recommendations based on data patterns
   */
  generateBusinessImplications(): BusinessImplication[] {
    const implications: BusinessImplication[] = [];

    // Market Saturation Analysis
    if (this.data.topClasses && this.data.topClasses[0]?.percentage > 20) {
      implications.push({
        category: 'Market Saturation',
        insight: `Class ${this.data.topClasses[0].code} shows high saturation levels, indicating increased brand conflict risk and higher costs for enforcement.`,
        recommendation: 'Consider niche market segments with lower concentration for new brand launches to reduce conflict probability.',
      });
    }

    // Geographic Strategy
    const topCountry = this.data.topCountries?.[0];
    if (topCountry) {
      const countryShare = (topCountry.count / this.data.summary.totalApplications) * 100;
      if (countryShare > 35) {
        implications.push({
          category: 'Geographic Focus',
          insight: `${topCountry.label} dominates the trademark portfolio at ${countryShare.toFixed(1)}%, indicating concentrated market exposure.`,
          recommendation: 'Evaluate opportunities to expand brand presence in underrepresented regions to reduce geographic concentration risk.',
        });
      }
    }

    // Brand Lifecycle Management
    const liveStatus = this.data.statusDistribution?.find(s => s.label.toUpperCase() === 'LIVE');
    const deadStatus = this.data.statusDistribution?.find(s => s.label.toUpperCase() === 'DEAD');

    if (liveStatus && deadStatus) {
      const activeRate = (liveStatus.count / (liveStatus.count + deadStatus.count)) * 100;
      if (activeRate < 80) {
        implications.push({
          category: 'Brand Lifecycle',
          insight: `Only ${activeRate.toFixed(1)}% of trademarks remain active, suggesting potential portfolio optimization opportunities.`,
          recommendation: 'Conduct portfolio review to assess value of inactive marks and consider maintenance strategy adjustments.',
        });
      } else {
        implications.push({
          category: 'Brand Lifecycle',
          insight: `${activeRate.toFixed(1)}% active rate indicates strong portfolio health and effective brand maintenance.`,
          recommendation: 'Continue current maintenance practices while monitoring for emerging brand lifecycle changes.',
        });
      }
    }

    // Competitive Intelligence
    const diversityScore = this.data.topClasses?.length ?? 0;
    if (diversityScore < 5) {
      implications.push({
        category: 'Competitive Intelligence',
        insight: 'Trademark portfolio shows concentration in fewer classes, potentially limiting competitive coverage.',
        recommendation: 'Analyze adjacent class categories for strategic brand extension opportunities.',
      });
    } else if (diversityScore > 15) {
      implications.push({
        category: 'Competitive Intelligence',
        insight: `Portfolio spans ${diversityScore} significant classes, indicating diverse competitive positioning across sectors.`,
        recommendation: 'Leverage this diversification advantage to cross-pollinate brand strategies across sectors.',
      });
    }

    return implications;
  }

  /**
   * Generate visualization recommendations
   * Suggests optimal chart types for each data dimension
   */
  generateVisualizationRecommendations(): VisualizationRecommendation[] {
    const recommendations: VisualizationRecommendation[] = [];

    // Filing trends over time
    if (this.data.summary.filingsByYear && this.data.summary.filingsByYear.length > 1) {
      recommendations.push({
        type: 'line',
        title: 'Trademark Filings Trend',
        description: 'Year-over-year filing volume trends to identify growth or decline patterns.',
        dataSource: 'summary',
      });
    }

    // Class distribution
    if (this.data.topClasses && this.data.topClasses.length > 0) {
      recommendations.push({
        type: 'bar',
        title: 'Top Trademark Classes',
        description: 'International class distribution showing business sector concentration.',
        dataSource: 'classes',
      });

      if (this.data.topClasses.length > 3) {
        recommendations.push({
          type: 'pie',
          title: 'Class Market Share',
          description: 'Percentage distribution of top classes relative to total portfolio.',
          dataSource: 'classes',
        });
      }
    }

    // Geographic distribution
    if (this.data.topCountries && this.data.topCountries.length > 0) {
      recommendations.push({
        type: 'map',
        title: 'Geographic Trademark Concentration',
        description: 'World map showing filing distribution by country and regional focus.',
        dataSource: 'countries',
      });

      if (this.data.topCountries.length > 1) {
        recommendations.push({
          type: 'bar',
          title: 'Top Countries by Filings',
          description: 'Ranked comparison of leading markets for trademark protection.',
          dataSource: 'countries',
        });
      }
    }

    // Status distribution
    if (this.data.statusDistribution && this.data.statusDistribution.length > 0) {
      recommendations.push({
        type: 'pie',
        title: 'Trademark Status Distribution',
        description: 'Active vs inactive trademark portfolio health indicator.',
        dataSource: 'status',
      });
    }

    return recommendations;
  }

  /**
   * Generate complete analysis report
   * Comprehensive output with all intelligence components
   */
  generateFullReport(): TrademarkTrendAnalysisReport {
    return {
      period: {
        generatedAt: new Date().toISOString(),
        timeRange: this.getTimeRange(),
      },
      executiveSummary: this.generateExecutiveSummary(),
      trendInterpretation: this.generateTrendInterpretation(),
      businessImplications: this.generateBusinessImplications(),
      visualizationRecommendations: this.generateVisualizationRecommendations(),
      rawData: {
        summary: this.data.summary,
        topClasses: this.data.topClasses,
        topCountries: this.data.topCountries,
        statusDistribution: this.data.statusDistribution,
      },
    };
  }

  /**
   * Helper: Get time range string from summary data
   */
  private getTimeRange(): string {
    const years = this.data.summary.filingsByYear;
    if (!years || years.length === 0) {
      return 'Current Period';
    }

    const startYear = years[0].year;
    const endYear = years[years.length - 1].year;

    if (startYear === endYear) {
      return `${startYear}`;
    }

    return `${startYear} - ${endYear}`;
  }

  /**
   * Helper: Calculate percentage change between two numbers
   */
  private calculatePercentChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
}

/**
 * Convenience function to analyze trademark data
 */
export function analyzeTrademarkTrends(data: AggregatedTrademarkTrendData): TrademarkTrendAnalysisReport {
  const analyzer = new TrademarkTrendAnalyzer(data);
  return analyzer.generateFullReport();
}
