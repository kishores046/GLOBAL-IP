import { useState, useEffect } from 'react';
import { Sidebar } from '../dashboard/Sidebar';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { competitorFilingApi } from './competitorFilingApi';
import { FilingSummaryDTO, FilingTrendDTO, MonthlyTrendsMap, SyncResultDTO } from './types';
import { FilingSummaryCards } from './FilingSummaryCards';
import { FilingTrendChart } from './FilingTrendChart';
import { MonthlyTrendHeatmap } from './MonthlyTrendHeatmap';
import { Calendar, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export function CompetitorFilingDashboard() {
  const [fromDate, setFromDate] = useState('2020-01-01');
  const [summary, setSummary] = useState<FilingSummaryDTO | null>(null);
  const [trends, setTrends] = useState<FilingTrendDTO[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrendsMap | null>(null);
  
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResultDTO | null>(null);
  const [showSyncResult, setShowSyncResult] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchTrends();
    fetchMonthlyTrends();
  }, [fromDate]);

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      setError(null);
      const data = await competitorFilingApi.getFilingSummary();
      setSummary(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        setSummary({
          totalFilings: 0,
          oldestFiling: null,
          newestFiling: null,
          competitorsTracked: 0,
          byCompetitor: []
        });
      } else {
        const message = err instanceof Error ? err.message : 'Failed to load filing summary';
        setError(message);
      }
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchTrends = async () => {
    try {
      setLoadingTrends(true);
      const data = await competitorFilingApi.getFilingTrends(fromDate);
      setTrends(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load filing trends';
      setError(message);
      setTrends([]);
    } finally {
      setLoadingTrends(false);
    }
  };

  const fetchMonthlyTrends = async () => {
    try {
      setLoadingMonthly(true);
      const data = await competitorFilingApi.getMonthlyTrends(fromDate);
      setMonthlyTrends(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load monthly trends';
      setError(message);
    } finally {
      setLoadingMonthly(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      const result = await competitorFilingApi.syncLatestFilings(fromDate);
      setSyncResult(result);
      setShowSyncResult(true);
      
      await fetchSummary();
      await fetchTrends();
      await fetchMonthlyTrends();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sync filings';
      setError(message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-blue-900 mb-2">Competitor Filing Trends</h1>
                <p className="text-slate-600">Analyze patent filing patterns and activity</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Filings'}
                </button>
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="w-4 h-4" />
                    From Date:
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {showSyncResult && syncResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-green-800 font-medium">Sync Completed Successfully</p>
                    <div className="text-green-700 text-sm mt-2 space-y-1">
                      <p>Competitors Processed: {syncResult.competitorsProcessed}</p>
                      <p>New Filings Found: {syncResult.newFilingsFound}</p>
                      <p>Duplicates Skipped: {syncResult.duplicatesSkipped}</p>
                    </div>
                    {syncResult.details && syncResult.details.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {syncResult.details.map((detail) => (
                          <p key={detail.competitorCode} className="text-xs text-green-600">
                            {detail.competitorCode}: {detail.newFilings} new, {detail.duplicates} duplicates
                            {detail.status === 'FAILED' && <span className="text-red-600"> - {detail.errorMessage}</span>}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowSyncResult(false)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Error loading data</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <FilingSummaryCards summary={summary} isLoading={loadingSummary} />

            <FilingTrendChart trends={trends} isLoading={loadingTrends} />

            <MonthlyTrendHeatmap trends={monthlyTrends} isLoading={loadingMonthly} />
          </div>
        </main>
      </div>
    </div>
  );
}
