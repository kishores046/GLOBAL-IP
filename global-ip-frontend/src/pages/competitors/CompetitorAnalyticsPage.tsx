/**
 * Competitor Analytics Dashboard Page
 * Visualizations and analytics for competitor filings
 */

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Calendar, RefreshCw, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'motion/react';
import { filingApi } from '../../features/competitors/api/filingApi';
import type { FilingSummaryDTO, FilingTrendDTO, SyncResultDTO } from '../../features/competitors/types/competitor.types';
import { PerCompetitorSummaryTable } from '../../features/competitors/components/PerCompetitorSummaryTable';
import { CompetitorFilingsView } from '../../features/competitors/components/CompetitorFilingsView';
import { formatDate } from '../../features/competitors/utils/competitorHelpers';

interface AnalyticsState {
  summary: FilingSummaryDTO | null;
  trends: FilingTrendDTO[];
  syncResult: SyncResultDTO | null;
  loading: boolean;
  syncing: boolean;
  error: string | null;
}

export function CompetitorAnalyticsPage() {
  const [state, setState] = useState<AnalyticsState>({
    summary: null,
    trends: [],
    syncResult: null,
    loading: true,
    syncing: false,
    error: null,
  });

  const [selectedCompetitor, setSelectedCompetitor] = useState<{
    id: number;
    name: string;
    code: string;
  } | null>(null);

  const [fromDate, setFromDate] = useState<string>(
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  useEffect(() => {
    loadAnalytics();
  }, [fromDate]);

  const loadAnalytics = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [summary, trends] = await Promise.all([
        filingApi.getSummary(),
        filingApi.getTrends(fromDate),
      ]);

      setState((prev) => ({
        ...prev,
        summary,
        trends,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load analytics',
        loading: false,
      }));
    }
  };

  const handleSync = async () => {
    setState((prev) => ({ ...prev, syncing: true, error: null }));
    try {
      const result = await filingApi.sync(fromDate);
      setState((prev) => ({
        ...prev,
        syncResult: result,
        syncing: false,
      }));
      // Reload analytics after sync
      await loadAnalytics();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sync failed',
        syncing: false,
      }));
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="text-center py-16">
          <div className="inline-block">
            <Loader className="w-12 h-12 animate-spin text-blue-600" />
          </div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            Competitor Analytics
          </h1>
          <p className="text-slate-600 mt-2">Real-time filing trends and competitive intelligence</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Error Alert */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm">{state.error}</p>
            </div>
          </motion.div>
        )}

        {/* Sync Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200 mb-8 shadow-sm"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Sync From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2 self-end">
              <button
                onClick={handleSync}
                disabled={state.syncing || state.loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 transition-all font-semibold"
              >
                {state.syncing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Sync Filings
                  </>
                )}
              </button>
              <button
                onClick={loadAnalytics}
                disabled={state.loading}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 rounded-lg flex items-center gap-2 transition-all font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sync Results */}
        {state.syncResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-green-900 mb-4">Last Sync Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-600">Competitors Processed</p>
                <p className="text-2xl font-bold text-slate-900">
                  {state.syncResult.competitorsProcessed}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-600">New Filings Found</p>
                <p className="text-2xl font-bold text-green-600">
                  {state.syncResult.newFilingsFound}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-600">Duplicates Skipped</p>
                <p className="text-2xl font-bold text-slate-900">
                  {state.syncResult.duplicatesSkipped}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-600">Sync Status</p>
                <p
                  className={`text-lg font-bold ${
                    state.syncResult.details.every((d) => d.status === 'SUCCESS')
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}
                >
                  {state.syncResult.details.every((d) => d.status === 'SUCCESS')
                    ? 'Success'
                    : 'Partial'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Filings Card */}
          <motion.div
            whileHover={{ translateY: -5 }}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Filings</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {state.summary?.totalFilings || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Across all tracked competitors</p>
          </motion.div>

          {/* Competitors Tracked Card */}
          <motion.div
            whileHover={{ translateY: -5 }}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Competitors</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {state.summary?.competitorsTracked || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Active in database</p>
          </motion.div>

          {/* Newest Filing Card */}
          <motion.div
            whileHover={{ translateY: -5 }}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Newest Filing</p>
                <p className="text-lg font-bold text-slate-900 mt-2 font-mono">
                  {state.summary?.newestFiling ? formatDate(state.summary.newestFiling) : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Most recent entry</p>
          </motion.div>

          {/* Oldest Filing Card */}
          <motion.div
            whileHover={{ translateY: -5 }}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Oldest Filing</p>
                <p className="text-lg font-bold text-slate-900 mt-2 font-mono">
                  {state.summary?.oldestFiling ? formatDate(state.summary.oldestFiling) : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Earliest entry</p>
          </motion.div>
        </div>

        {/* Per-Competitor Summary Table */}
        {state.summary?.byCompetitor && state.summary.byCompetitor.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Filing Summary by Competitor</h2>
                <p className="text-sm text-slate-600 mt-1">Detailed breakdown of filings for each competitor • Click on a competitor to view all filings</p>
              </div>
              <PerCompetitorSummaryTable
                summaries={state.summary.byCompetitor}
                loading={state.loading}
                onSelectCompetitor={(competitorId, competitorName, competitorCode) => {
                  setSelectedCompetitor({ id: competitorId, name: competitorName, code: competitorCode });
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Competitor Filings Details View */}
        {selectedCompetitor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Viewing Filings for {selectedCompetitor.name}</h2>
              <button
                onClick={() => setSelectedCompetitor(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-medium"
              >
                Close
              </button>
            </div>
            <CompetitorFilingsView
              competitorId={selectedCompetitor.id}
              competitorName={selectedCompetitor.name}
              competitorCode={selectedCompetitor.code}
            />
          </motion.div>
        )}

        {/* Filing Trends Table */}
        {state.trends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Filing Trends
              </h3>
              <p className="text-sm text-slate-600 mt-1">Historical filing patterns and trends</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-6 text-slate-700 font-semibold">Competitor</th>
                    <th className="text-left py-3 px-6 text-slate-700 font-semibold">Code</th>
                    <th className="text-left py-3 px-6 text-slate-700 font-semibold">Filing Count</th>
                    <th className="text-left py-3 px-6 text-slate-700 font-semibold">Period</th>
                  </tr>
                </thead>
                <tbody>
                  {state.trends.map((trend, index) => (
                    <motion.tr
                      key={`${trend.competitorCode}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-slate-900 font-medium">{trend.competitorName}</td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {trend.competitorCode}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold text-slate-900">{trend.count}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">
                        {trend.periodStart ? formatDate(trend.periodStart) : 'N/A'} to {trend.periodEnd ? formatDate(trend.periodEnd) : 'N/A'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CompetitorAnalyticsPage;
