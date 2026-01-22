/**
 * Competitor Analytics Page (Refactored)
 * 
 * Primary view: List of competitors for filing analysis
 * Features:
 * - Subscription-gated access (COMPETITOR_FILING required)
 * - Competitor list with sorting
 * - On-demand sync with result panel
 * - Summary KPIs
 * 
 * Entry point for competitor filing analytics workflow
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCompetitors,
  useSyncLatestFilings,
  useFilingSummary,
  useHasCompetitorFilingSubscription,
} from '../../hooks/useCompetitorAnalytics';
import { SyncResultPanel } from '../../components/competitors/SyncResultPanel';
import { ROUTES } from '../../routes/routeConfig';
import {
  RefreshCw,
  Lock,
  Loader2,
  AlertCircle,
  Calendar,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { SyncResultDTO } from '../../services/competitorFilingApi';
import { format } from 'date-fns';

export function CompetitorAnalyticsPage() {
  const navigate = useNavigate();

  // Permission check
  const { data: hasSubscription, isLoading: checkingSubscription, refetch: refetchSubscription } =
    useHasCompetitorFilingSubscription();

  // Refresh subscription check when page becomes visible (tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetchSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetchSubscription]);

  // Data fetching (only after subscription verified)
  const { data: competitors, isLoading: competitorsLoading, error: competitorsError } =
    useCompetitors(!!hasSubscription);
  const { data: summary, error: summaryError } =
    useFilingSummary(!!hasSubscription);

  // Sync mutation
  const { mutate: performSync, isPending: syncing } = useSyncLatestFilings();

  // UI state
  const [syncFromDate, setSyncFromDate] = useState<string>(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1); // 1 year ago
    return date.toISOString().split('T')[0];
  });
  const [syncResult, setSyncResult] = useState<SyncResultDTO | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'code'>('name');

  // Check authorization
  if (checkingSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8 max-w-md w-full text-center">
          <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Premium Feature</h2>
          <p className="text-slate-600 mb-6">
            Competitor Filing Analytics requires an active subscription to COMPETITOR_FILING
            monitoring type.
          </p>
          <button
            onClick={() => navigate(ROUTES.CREATE_SUBSCRIPTION)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  // Handle sync
  const handleSync = () => {
    if (!syncFromDate) {
      toast.error('Please select a date');
      return;
    }

    console.log('🔄 Starting sync from:', syncFromDate);
    performSync(
      { fromDate: syncFromDate },
      {
        onSuccess: (result) => {
          console.log('✅ Sync completed:', result);
          setSyncResult(result);
          toast.success(`Sync complete: ${result.newFilingsFound} new filings found`);
        },
        onError: (error: any) => {
          console.error('❌ Sync failed:', error);
          const statusCode = error.response?.status;
          const errorMsg = error.response?.data?.error ?? error.message;

          if (statusCode === 403) {
            toast.error('Access denied: Check your subscription status');
          } else if (statusCode === 500) {
            toast.error(`Server error: ${errorMsg}`);
          } else {
            toast.error('Failed to sync filings. Please try again.');
          }
        },
      }
    );
  };

  // Sort competitors
  const sortedCompetitors = [...(competitors || [])].sort((a, b) => {
    if (sortBy === 'name') {
      return a.displayName.localeCompare(b.displayName);
    }
    return a.code.localeCompare(b.code);
  });

  // Loading state
  if (competitorsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading competitors...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (competitorsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Failed to Load Competitors</h3>
                <p className="text-red-800 text-sm mb-4">
                  {competitorsError instanceof Error ? competitorsError.message : 'Unknown error'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded font-medium transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Competitor Analytics</h1>
          <p className="text-slate-600">
            Monitor competitor patent filings and track competitive intelligence
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Total Filings</p>
                  <p className="text-3xl font-bold text-blue-600">{summary.totalFilings}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Oldest Filing</p>
                  <p className="text-sm text-slate-900 font-mono">
                    {summary.oldestFilingDate
                      ? format(new Date(summary.oldestFilingDate), 'MMM yyyy')
                      : '—'}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-slate-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Newest Filing</p>
                  <p className="text-sm text-slate-900 font-mono">
                    {summary.newestFilingDate
                      ? format(new Date(summary.newestFilingDate), 'MMM yyyy')
                      : '—'}
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-slate-200" />
              </div>
            </div>
          </div>
        )}

        {summaryError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Summary data unavailable. Competitor list is still accessible.
            </p>
          </div>
        )}

        {/* Sync Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            On-Demand Sync
          </h2>

          <p className="text-slate-600 text-sm mb-4">
            Fetch latest patent filings from competitors starting from a specific date.
          </p>

          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="sync-date" className="block text-sm font-medium text-slate-700 mb-2">
                From Date
              </label>
              <input
                id="sync-date"
                type="date"
                value={syncFromDate}
                onChange={(e) => setSyncFromDate(e.target.value)}
                disabled={syncing}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />
            </div>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400 transition flex items-center gap-2"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sync Latest Filings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sync Result */}
        {syncResult && <SyncResultPanel result={syncResult} />}

        {/* Competitors List */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Competitors ({sortedCompetitors.length})
            </h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'code')}
              className="px-3 py-1 border border-slate-300 rounded text-sm bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="code">Sort by Code</option>
            </select>
          </div>

          {sortedCompetitors.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No competitors configured yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Code</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Name</th>
                    <th className="px-6 py-3 text-center font-semibold text-slate-700">
                      Filings
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCompetitors.map((competitor) => (
                    <tr
                      key={competitor.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4">
                        <code className="text-sm font-mono text-slate-900">{competitor.code}</code>
                      </td>
                      <td className="px-6 py-4 text-slate-900">{competitor.displayName}</td>
                      <td className="px-6 py-4 text-center">
                        {competitor.totalFilings !== undefined ? (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {competitor.totalFilings}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            navigate(`${ROUTES.COMPETITOR_FILINGS}?competitorId=${competitor.id}`)
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                        >
                          View Filings →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
