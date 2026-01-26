import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, RefreshCw, Download } from 'lucide-react';
import { useTrademarkTrendAnalysis } from '../../hooks/useTrademarkTrendAnalysis';
import { ExecutiveInsightPanel } from './ExecutiveInsightPanel';
import { TrendInterpretationPanel } from './TrendInterpretationPanel';
import { BusinessImplicationsPanel } from './BusinessImplicationsPanel';
import { VisualizationRecommendationsPanel } from './VisualizationRecommendationsPanel';
import {
  TopClassesTable,
  TopCountriesTable,
  StatusDistributionTable,
} from './DataTable';

interface TrademarkTrendAnalysisDashboardProps {
  title?: string;
  showRawData?: boolean;
  autoRefreshInterval?: number; // milliseconds, 0 = disabled
}

export const TrademarkTrendAnalysisDashboard: React.FC<TrademarkTrendAnalysisDashboardProps> = ({
  title = 'Trademark Trend Analysis',
  showRawData = true,
  autoRefreshInterval = 0,
}) => {
  const { aggregatedData, analysisReport, loading, error, refetch } =
    useTrademarkTrendAnalysis();

  // Auto-refresh
  React.useEffect(() => {
    if (!autoRefreshInterval || autoRefreshInterval <= 0) return;

    const interval = setInterval(() => {
      refetch();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, refetch]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleDownloadReport = () => {
    if (!analysisReport) return;

    const reportJson = JSON.stringify(analysisReport, null, 2);
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trademark-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error && !aggregatedData) {
    return (
      <div className="space-y-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Error Loading Trademark Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-red-100 border-red-300">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error.message}
              </AlertDescription>
            </Alert>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-gray-700 dark:text-gray-200 mt-1 font-medium">
            Business-ready intelligence for IP analysts and legal teams
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {analysisReport && (
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && !analysisReport && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-700 font-medium">Analyzing trademark trends...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {analysisReport && (
        <Card className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-gray-900 dark:text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-semibold text-gray-700">Analysis Period:</span>
                <span className="text-gray-700 dark:text-gray-200 ml-2">{analysisReport.period.timeRange}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Generated:</span>
                <span className="text-gray-600 dark:text-gray-200 ml-2">
                  {new Date(analysisReport.period.generatedAt).toLocaleString()}
                </span>
              </div>
              {aggregatedData && (
                <div>
                  <span className="font-semibold text-gray-700">Total Applications:</span>
                    <span className="text-gray-600 dark:text-gray-200 ml-2">
                    {aggregatedData.summary.totalApplications.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Executive Summary */}
      {analysisReport && (
        <ExecutiveInsightPanel
          insights={analysisReport.executiveSummary}
          loading={loading}
          error={error}
        />
      )}

      {/* Trend Interpretation */}
      {analysisReport && (
        <TrendInterpretationPanel
          interpretation={analysisReport.trendInterpretation}
          loading={loading}
          error={error}
        />
      )}

      {/* Business Implications */}
      {analysisReport && (
        <BusinessImplicationsPanel
          implications={analysisReport.businessImplications}
          loading={loading}
          error={error}
        />
      )}

      {/* Visualization Recommendations */}
      {analysisReport && (
        <VisualizationRecommendationsPanel
          recommendations={analysisReport.visualizationRecommendations}
          loading={loading}
          error={error}
        />
      )}

      {/* Raw Data Tables */}
      {showRawData && analysisReport && (
        <>
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Tables</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Top Classes */}
            <TopClassesTable
              data={analysisReport.rawData.topClasses}
              loading={loading}
              error={error}
              onRefresh={handleRefresh}
            />

            {/* Top Countries */}
            <TopCountriesTable
              data={analysisReport.rawData.topCountries}
              loading={loading}
              error={error}
              onRefresh={handleRefresh}
            />

            {/* Status Distribution */}
            <StatusDistributionTable
              data={analysisReport.rawData.statusDistribution}
              loading={loading}
              error={error}
              onRefresh={handleRefresh}
            />
          </div>
        </>
      )}

      {/* Footer Information */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-xs text-gray-600 space-y-2">
            <p>
              <strong>Data Integrity:</strong> This analysis is based on authoritative data from the
              Trademark Trend Analysis API. All insights are derived exclusively from provided metrics.
            </p>
            <p>
              <strong>Usage Context:</strong> Suitable for academic reviews, internship evaluations,
              and internal IP dashboard presentations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrademarkTrendAnalysisDashboard;
