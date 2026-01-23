import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { InsightSummary, VisualizationRecommendation } from '../../types/trends';

interface TrendInsightCardProps {
  insight: InsightSummary;
}

export const TrendInsightCard: React.FC<TrendInsightCardProps> = ({ insight }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{insight.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Findings */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">Key Findings</h4>
          <ul className="space-y-2">
            {insight.bullets.map((bullet, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700">
                <span className="text-blue-600 font-bold min-w-5">{idx + 1}.</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interpretation */}
        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-900">Trend Interpretation</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{insight.interpretation}</p>
        </div>

        {/* Business Implications */}
        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-900">Business & Research Implications</h4>
          <ul className="space-y-2">
            {insight.businessImplications.map((implication, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700">
                <span className="text-green-600 font-bold min-w-5">•</span>
                <span>{implication}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visualization Recommendations */}
        {insight.suggestedVisualizations && insight.suggestedVisualizations.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-900">Recommended Visualizations</h4>
            <div className="space-y-2">
              {insight.suggestedVisualizations.map((viz, idx) => (
                <VisualizationRecommendationBadge key={idx} recommendation={viz} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface VisualizationRecommendationBadgeProps {
  recommendation: VisualizationRecommendation;
}

const VisualizationRecommendationBadge: React.FC<VisualizationRecommendationBadgeProps> = ({
  recommendation,
}) => {
  const getChartIcon = (type: string): string => {
    switch (type) {
      case 'line':
        return '📈';
      case 'bar':
        return '📊';
      case 'heatmap':
        return '🔥';
      case 'network':
        return '🕸️';
      case 'pie':
        return '🥧';
      case 'area':
        return '📉';
      case 'scatter':
        return '⚫';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-blue-50 rounded p-3 space-y-1 border border-blue-200">
      <div className="flex items-start gap-2">
        <span className="text-lg min-w-6">{getChartIcon(recommendation.type)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-900">{recommendation.title}</p>
          <p className="text-xs text-blue-800 line-clamp-2">{recommendation.description}</p>
        </div>
      </div>
      <p className="text-xs text-blue-700 pl-8">
        <span className="font-semibold">Data Source:</span> {recommendation.dataSource}
      </p>
    </div>
  );
};

interface TrendInsightPanelProps {
  insights: InsightSummary[];
  loading?: boolean;
  error?: Error | null;
}

export const TrendInsightPanel: React.FC<TrendInsightPanelProps> = ({
  insights,
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Error loading insights: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded h-32" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Insights</CardTitle>
          <CardDescription>
            Automated analysis of patent trends and patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No insights available yet. Load trend data to generate insights.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trend Analysis Insights</h2>
        <p className="text-sm text-gray-600 mt-1">
          Business-ready analysis of patent trends with strategic recommendations
        </p>
      </div>

      {insights.map((insight, idx) => (
        <TrendInsightCard key={idx} insight={insight} />
      ))}
    </div>
  );
};
