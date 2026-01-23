import { useState, useEffect } from 'react';
import { RefreshCw, Calendar, BarChart3, AlertCircle, Loader } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { motion } from 'motion/react';
import { filingApi } from '../features/competitors/api/filingApi';
import type { 
  FilingSummaryDTO, 
  FilingTrendDTO, 
  SyncResultDTO 
} from '../features/competitors/types/competitor.types';

interface FilingTrackerState {
  summary: FilingSummaryDTO | null;
  trends: FilingTrendDTO[];
  monthlyTrends: Record<string, Record<string, number>>;
  syncResult: SyncResultDTO | null;
  loading: boolean;
  syncing: boolean;
  error: string | null;
}

export function FilingTrackerPage() {
  const [state, setState] = useState<FilingTrackerState>({
    summary: null,
    trends: [],
    monthlyTrends: {},
    syncResult: null,
    loading: true,
    syncing: false,
    error: null,
  });

  const [fromDate, setFromDate] = useState<string>(
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [summary, trends, monthlyTrends] = await Promise.all([
        filingApi.getSummary(),
        filingApi.getTrends(fromDate),
        filingApi.getMonthlyTrends(fromDate),
      ]);

      setState((prev) => ({
        ...prev,
        summary,
        trends,
        monthlyTrends,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load data',
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
      // Reload data after sync
      await loadAllData();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sync failed',
        syncing: false,
      }));
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Filing Analytics</h1>
              <p className="text-slate-600">
                Monitor and analyze competitor patent filings across jurisdictions
              </p>
            </motion.div>

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

            {/* Sync Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
                    onClick={loadAllData}
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

            {/* Loading State */}
            {state.loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center">
                  <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-slate-600">Loading filing data...</p>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Summary Cards */}
                {state.summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                  >
                    <motion.div
                      whileHover={{ translateY: -5 }}
                      className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold opacity-90">Total Filings</h3>
                        <BarChart3 className="w-5 h-5 opacity-70" />
                      </div>
                      <p className="text-3xl font-bold">{state.summary.totalFilings || 0}</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ translateY: -5 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold opacity-90">Competitors Tracked</h3>
                        <BarChart3 className="w-5 h-5 opacity-70" />
                      </div>
                      <p className="text-3xl font-bold">{state.summary.competitorsTracked || 0}</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ translateY: -5 }}
                      className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
                    >
                      <h3 className="text-sm font-semibold opacity-90 mb-2">Oldest Filing</h3>
                      <p className="text-lg font-bold">
                        {formatDate(state.summary.oldestFiling)}
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ translateY: -5 }}
                      className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
                    >
                      <h3 className="text-sm font-semibold opacity-90 mb-2">Newest Filing</h3>
                      <p className="text-lg font-bold">
                        {formatDate(state.summary.newestFiling)}
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Filing Trends */}
                {state.trends.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 border border-slate-200 mb-8 shadow-sm"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Filing Trends</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-slate-200">
                            <th className="text-left py-3 px-4 text-slate-700 font-semibold">
                              Competitor
                            </th>
                            <th className="text-left py-3 px-4 text-slate-700 font-semibold">
                              Code
                            </th>
                            <th className="text-left py-3 px-4 text-slate-700 font-semibold">
                              Filing Count
                            </th>
                            <th className="text-left py-3 px-4 text-slate-700 font-semibold">
                              Period
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.trends.map((trend, index) => (
                            <motion.tr
                              key={`${trend.competitorCode}-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.05 }}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-4 px-4 text-slate-900 font-medium">
                                {trend.competitorName}
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                  {trend.competitorCode}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-lg font-bold text-slate-900">
                                  {trend.count}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-slate-600 text-sm">
                                {formatDate(trend.periodStart)} to{' '}
                                {formatDate(trend.periodEnd)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* Competitor Filing Summary */}
                {state.summary?.byCompetitor && state.summary.byCompetitor.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Filing Summary by Competitor
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {state.summary.byCompetitor.map((comp, index) => (
                        <motion.div
                          key={`${comp.competitorCode}-${index}`}
                          whileHover={{ translateY: -3 }}
                          className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-slate-900">
                                {comp.competitorName}
                              </h3>
                              <p className="text-xs text-slate-500">{comp.competitorCode}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Total Filings</span>
                              <span className="text-lg font-bold text-slate-900">
                                {comp.filingCount}
                              </span>
                            </div>
                            {comp.latestFiling && (
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600">Latest</span>
                                <span className="text-slate-700">
                                  {formatDate(comp.latestFiling)}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}