import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { useCompetitors } from '../hooks/useCompetitors';
import { useFilingTrends } from '../hooks/useFilingTrends';
import { useFilingSummary } from '../hooks/useFilingSummary';
import { FilingSummaryCards } from '../components/competitor/FilingSummaryCards';
import { FilingTimelineChart } from '../components/competitor/FilingTimelineChart';
import { FilingsTable } from '../components/competitor/FilingsTable';
import { AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { competitorAPI } from '../services/competitorAPI';

export function CompetitorAnalyticsPage() {
  const { competitors, isLoading: loadingCompetitors, error: competitorsError, refetch: refetchCompetitors } = useCompetitors();
  const { summary, isLoading: loadingSummary, refetch: refetchSummary } = useFilingSummary();
  const { trends, isLoading: loadingTrends, refetch: refetchTrends } = useFilingTrends('2020-01-01');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSyncMessage(null);
    try {
      // Trigger filing sync
      const syncResult = await competitorAPI.syncFilings('2020-01-01');
      
      // Show success message
      setSyncMessage({
        type: 'success',
        text: `Sync completed: ${syncResult.newFilingsFound} new filings found, ${syncResult.duplicatesSkipped} duplicates skipped`
      });

      // Refetch all data after sync
      await Promise.all([
        refetchCompetitors(),
        refetchSummary(),
        refetchTrends()
      ]);

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync filings';
      setSyncMessage({
        type: 'error',
        text: errorMessage
      });
      console.error('Sync failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <h1 className="text-4xl font-bold text-blue-900">Competitor Analytics</h1>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <p className="text-slate-600">
                Monitor competitor patent filing activity and trends
              </p>
            </div>

            {/* Error State */}
            {competitorsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Error loading competitors</p>
                  <p className="text-red-700 text-sm mt-1">{competitorsError}</p>
                </div>
              </div>
            )}

            {/* Sync Message */}
            {syncMessage && (
              <div className={`border rounded-lg p-4 flex items-start gap-3 ${
                syncMessage.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  syncMessage.type === 'success'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`} />
                <p className={syncMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {syncMessage.text}
                </p>
              </div>
            )}

            {/* Summary Cards */}
            <FilingSummaryCards summary={summary} isLoading={loadingSummary} />

            {/* Filing Timeline Chart */}
            <FilingTimelineChart trends={trends} isLoading={loadingTrends} />

            {/* Filings Table */}
            {!loadingCompetitors && competitors.length > 0 && (
              <FilingsTable competitors={competitors} />
            )}

            {/* No Competitors State */}
            {!loadingCompetitors && competitors.length === 0 && !competitorsError && (
              <div className="bg-white rounded-xl p-12 shadow-md border border-slate-200 text-center">
                <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No Competitors Tracked
                </h3>
                <p className="text-slate-600">
                  Start tracking competitors to see their patent filing activity
                </p>
              </div>
            )}

            {/* Data Source Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Data Source:</strong> All visualizations are based on stored competitor filing data from PatentsView. 
                Data is updated via scheduled jobs and reflects US patent filings only.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
