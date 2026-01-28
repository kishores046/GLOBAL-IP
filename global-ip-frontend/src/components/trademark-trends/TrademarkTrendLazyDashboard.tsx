import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { TRADEMARK_CARDS, TrademarkCardConfig } from './trademarkCardConfig';
import { TrademarkCardView } from './TrademarkCardView';
import { TrademarkViewer } from './TrademarkViewer';

export const TrademarkTrendLazyDashboard: React.FC = () => {
  const [activeTrademark, setActiveTrademark] = useState<{
    cardId: string;
    title: string;
    data: any;
    loading: boolean;
    error: Error | null;
  } | null>(null);

  const [trademarkStates, setTrademarkStates] = useState<
    Record<string, { loading: boolean; error: Error | null; data: any }>
  >({});
  

  const handleCardClick = useCallback(async (card: TrademarkCardConfig) => {
    // Check if already loaded and cached
    if (trademarkStates[card.id]?.data && !trademarkStates[card.id]?.loading) {
      setActiveTrademark({
        cardId: card.id,
        title: card.title,
        data: trademarkStates[card.id].data,
        loading: false,
        error: trademarkStates[card.id].error,
      });
      return;
    }

    // Mark as loading
    setTrademarkStates((prev) => ({
      ...prev,
      [card.id]: { loading: true, error: null, data: null },
    }));

    setActiveTrademark({
      cardId: card.id,
      title: card.title,
      data: null,
      loading: true,
      error: null,
    });

    try {
      // Fetch only this specific trademark card (lazy load)
      console.log(`[TrademarkDashboard] Fetching card: ${card.id}...`);
      const data = await card.fetchFunction();
      console.debug(`[TrademarkDashboard] ✅ Fetched data for ${card.id}:`, data);
      
      // Validate we got some data
      if (!data) {
        throw new Error(`No data returned from ${card.id} endpoint`);
      }
      
      setTrademarkStates((prev) => ({
        ...prev,
        [card.id]: { loading: false, error: null, data },
      }));
      setActiveTrademark({
        cardId: card.id,
        title: card.title,
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error occurred');
      console.error(`[TrademarkDashboard] ❌ Error fetching ${card.id}:`, err);
      setTrademarkStates((prev) => ({
        ...prev,
        [card.id]: { loading: false, error: err, data: null },
      }));
      setActiveTrademark({
        cardId: card.id,
        title: card.title,
        data: null,
        loading: false,
        error: err,
      });
    }
  }, [trademarkStates]);

  const handleExport = useCallback(() => {
    if (!activeTrademark?.data) return;

    const exportData = {
      cardId: activeTrademark.cardId,
      title: activeTrademark.title,
      data: activeTrademark.data,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trademark-${activeTrademark.cardId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [activeTrademark]);

  const handleCloseTrademark = useCallback(() => {
    setActiveTrademark(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Trademark Trend Analysis</h1>
              <p className="text-gray-700 mt-2 font-medium">
                Click any card to explore detailed trademark trends. Data loads on-demand for optimal performance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeTrademark?.data && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Trademark Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TRADEMARK_CARDS.map((card) => (
            <TrademarkCardView
              key={card.id}
              card={card}
              isActive={activeTrademark?.cardId === card.id}
              isLoading={trademarkStates[card.id]?.loading || false}
              hasError={!!trademarkStates[card.id]?.error}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>

        {/* Active Trademark Viewer */}
        {activeTrademark && (
          <div className="mb-8">
            <TrademarkViewer
              cardId={activeTrademark.cardId}
              title={activeTrademark.title}
              data={activeTrademark.data}
              loading={activeTrademark.loading}
              error={activeTrademark.error}
              onClose={handleCloseTrademark}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrademarkTrendLazyDashboard;
