import React, { useState, useCallback } from 'react';
import { Filter, RefreshCw, Download, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { TrendCard } from './TrendCard';
import { EnhancedTrendViewer } from './EnhancedTrendViewer';
import { TREND_CARDS, TrendCardConfig } from './trendCardConfig';
import { TrendFilterOptions } from '../../types/trends';

interface ActivTrendState {
  trendId: string;
  data: any;
  loading: boolean;
  error: Error | null;
}

export const TrendDashboard: React.FC = () => {
  const [filters, setFilters] = useState<TrendFilterOptions>({
    startYear: new Date().getFullYear() - 10,
    endYear: new Date().getFullYear(),
  });

  const [limit, setLimit] = useState(10);
  // Per-card filters: key is card.id
  const [perCardFilters, setPerCardFilters] = useState<Record<string, { startYear?: number; endYear?: number; limit?: number }>>({});
  const [activeTrend, setActiveTrend] = useState<ActivTrendState | null>(null);

  // Map to store per-card loading and error states
  const [trendStates, setTrendStates] = useState<
    Record<string, { loading: boolean; error: Error | null; data: any }>
  >({});

  const handleTrendCardClick = useCallback(
    async (card: TrendCardConfig) => {
      // Check if already loaded and cached
      if (trendStates[card.id]?.data && !trendStates[card.id]?.loading) {
        setActiveTrend({
          trendId: card.id,
          data: trendStates[card.id].data,
          loading: false,
          error: trendStates[card.id].error,
        });
        return;
      }

      // Mark as loading
      setTrendStates((prev) => ({
        ...prev,
        [card.id]: { loading: true, error: null, data: null },
      }));

      setActiveTrend({
        trendId: card.id,
        data: null,
        loading: true,
        error: null,
      });

      try {
        // Determine per-card filters (if any) and pass only for this card
        const pf = perCardFilters[card.id] || {};
        const data = await card.fetchFunction(
          { startYear: pf.startYear, endYear: pf.endYear },
          pf.limit ?? limit
        );
        console.debug(`[TrendDashboard] Fetched data for ${card.id}:`, data);
        setTrendStates((prev) => ({
          ...prev,
          [card.id]: { loading: false, error: null, data },
        }));
        setActiveTrend({
          trendId: card.id,
          data,
          loading: false,
          error: null,
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        console.error(`[TrendDashboard] Error fetching ${card.id}:`, err);
        setTrendStates((prev) => ({
          ...prev,
          [card.id]: { loading: false, error: err, data: null },
        }));
        setActiveTrend({
          trendId: card.id,
          data: null,
          loading: false,
          error: err,
        });
      }
    },
    [perCardFilters, limit, trendStates]
  );

  const applyPerCardFilters = useCallback(
    async (card: TrendCardConfig, newFilters: { startYear?: number; endYear?: number; limit?: number }) => {
      setPerCardFilters((prev) => ({ ...prev, [card.id]: newFilters }));
      setTrendStates((prev) => ({ ...prev, [card.id]: { loading: true, error: null, data: null } }));
      setActiveTrend({ trendId: card.id, data: null, loading: true, error: null });
      try {
        const data = await card.fetchFunction({ startYear: newFilters.startYear, endYear: newFilters.endYear }, newFilters.limit);
        setTrendStates((prev) => ({ ...prev, [card.id]: { loading: false, error: null, data } }));
        setActiveTrend({ trendId: card.id, data, loading: false, error: null });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setTrendStates((prev) => ({ ...prev, [card.id]: { loading: false, error: err, data: null } }));
        setActiveTrend({ trendId: card.id, data: null, loading: false, error: err });
      }
    },
    []
  );

  const handleExport = useCallback(() => {
    if (!activeTrend?.data) return;

    const exportData = {
      trendId: activeTrend.trendId,
      filters,
      data: activeTrend.data,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trend-analysis-${activeTrend.trendId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [activeTrend, filters]);

  const handleCloseTrendViewer = useCallback(() => {
    setActiveTrend(null);
  }, []);

  const activeTrendCard = TREND_CARDS.find((card) => card.id === activeTrend?.trendId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">📊 Trend Analysis Dashboard</h1>
              <p className="text-slate-700 mt-2 text-base font-medium">
                Explore comprehensive trend insights. Click any card to dive into detailed analysis with interactive visualizations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {activeTrend?.data && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-2 border-green-300 text-green-700 hover:bg-green-50 font-medium"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}
            </div>
          </div>

          {/* Per-card filter controls appear when a card is active (no global filters) */}
        </div>

        {/* Trend Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {TREND_CARDS.map((card) => (
            <TrendCard
              key={card.id}
              id={card.id}
              title={card.title}
              icon={card.icon}
              description={card.description}
              isActive={activeTrend?.trendId === card.id}
              isLoading={trendStates[card.id]?.loading || false}
              onClick={() => handleTrendCardClick(card)}
            />
          ))}
        </div>

        {/* Trend Viewer Panel */}
        {activeTrend && activeTrendCard && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">{activeTrendCard.title}</h2>
              </div>
              <button
                onClick={handleCloseTrendViewer}
                className="px-4 py-2 text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md"
              >
                ✕ Close
              </button>
            </div>
            {/* Per-card filter controls (scoped to the active card only) */}
            <Card className="p-4 mb-4">
              {activeTrendCard && activeTrendCard.acceptsFilters && Object.keys(activeTrendCard.acceptsFilters).length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center text-blue-600 font-bold">F</div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Card Filters</div>
                        <div className="text-xs text-slate-500">These filters apply only to this card.</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">Server-supported filters: Result Limit (1–100)</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                    {activeTrendCard.acceptsFilters.startYear && (
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Start Year</label>
                        <input
                          type="number"
                          value={perCardFilters[activeTrendCard.id]?.startYear ?? new Date().getFullYear() - 10}
                          onChange={(e) => setPerCardFilters((prev) => ({
                            ...prev,
                            [activeTrendCard.id]: { ...(prev[activeTrendCard.id] || {}), startYear: parseInt(e.target.value) }
                          }))}
                          placeholder="e.g. 2016"
                          className="w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                      </div>
                    )}

                    {activeTrendCard.acceptsFilters.endYear && (
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">End Year</label>
                        <input
                          type="number"
                          value={perCardFilters[activeTrendCard.id]?.endYear ?? new Date().getFullYear()}
                          onChange={(e) => setPerCardFilters((prev) => ({
                            ...prev,
                            [activeTrendCard.id]: { ...(prev[activeTrendCard.id] || {}), endYear: parseInt(e.target.value) }
                          }))}
                          placeholder="e.g. 2025"
                          className="w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                      </div>
                    )}

                    {activeTrendCard.acceptsFilters.limit && (
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Limit</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={perCardFilters[activeTrendCard.id]?.limit ?? limit}
                          onChange={(e) => setPerCardFilters((prev) => ({
                            ...prev,
                            [activeTrendCard.id]: { ...(prev[activeTrendCard.id] || {}), limit: Math.min(100, Math.max(1, parseInt(e.target.value) || 10)) }
                          }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                      </div>
                    )}

                    <div className="md:col-span-2 flex gap-2 items-center">
                      <Button
                        className="bg-blue-600 text-white px-4 py-2"
                        onClick={() => applyPerCardFilters(activeTrendCard, perCardFilters[activeTrendCard.id] || { startYear: undefined, endYear: undefined, limit })}
                      >
                        Apply
                      </Button>
                      <div className="text-sm text-slate-500">Adjust and click Apply to refresh this card only.</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-600">This card displays full historical data; filters are not applied.</div>
              )}
            </Card>

            <EnhancedTrendViewer
              trendId={activeTrend.trendId}
              data={activeTrend.data}
              loading={activeTrend.loading}
              error={activeTrend.error}
              clientFilters={perCardFilters[activeTrendCard.id]}
            />
          </div>
        )}

        {/* Empty State */}
        {!activeTrend && (
          <Card className="p-12 text-center bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-lg">
            <div className="text-blue-300 mb-4">
              <RefreshCw className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">📈 No Trend Selected</h3>
            <p className="text-slate-700 font-medium">
              Click on any card above to explore detailed trend analysis with interactive charts.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrendDashboard;
