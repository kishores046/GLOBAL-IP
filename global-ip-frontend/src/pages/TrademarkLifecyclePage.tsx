import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { TrademarkLifecyclePanel } from '../trends/trademark-lifecycle/TrademarkLifecyclePanel';
import { Search, AlertCircle } from 'lucide-react';

export function TrademarkLifecyclePage() {
  const [trademarkId, setTrademarkId] = useState<string>('');
  const [searchedTrademarkId, setSearchedTrademarkId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trademarkId.trim()) {
      setError('Please enter a trademark ID');
      return;
    }
    setError(null);
    setSearchedTrademarkId(trademarkId.trim());
  };

  const handleReset = () => {
    setTrademarkId('');
    setSearchedTrademarkId('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-purple-100">
      <DashboardHeader userName="Analyst" />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-purple-900 mb-2">Trademark Lifecycle</h1>
              <p className="text-slate-600">
                Track the journey of a trademark from filing to registration
              </p>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Trademark ID
                    </label>
                    <input
                      type="text"
                      value={trademarkId}
                      onChange={(e) => setTrademarkId(e.target.value)}
                      placeholder="e.g., 87123456"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    />
                    {error && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </button>
                    {searchedTrademarkId && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Lifecycle Panel */}
            {searchedTrademarkId && (
              <TrademarkLifecyclePanel trademarkId={searchedTrademarkId} />
            )}

            {!searchedTrademarkId && (
              <div className="bg-white rounded-xl p-12 shadow-md border border-slate-200 text-center">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Search for a Trademark
                </h3>
                <p className="text-slate-600">
                  Enter a trademark ID to view its complete lifecycle
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-2">About Trademark Lifecycle</h3>
              <ul className="text-purple-800 space-y-2 text-sm">
                <li>• <strong>Filed:</strong> When the trademark application is submitted</li>
                <li>• <strong>Published:</strong> When the application is published for opposition</li>
                <li>• <strong>Registered:</strong> When the trademark is officially registered</li>
                <li>• <strong>Cancelled:</strong> When the trademark registration is cancelled</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
