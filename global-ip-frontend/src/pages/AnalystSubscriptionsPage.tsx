/**
 * Analyst Subscriptions Page
 * Shows what the analyst is subscribed to.
 */

import { useState, useEffect, useContext } from 'react';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { AnalystSidebar } from '../components/dashboard/AnalystSidebar';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';
import subscriptionApi from '../services/subscriptionApi';
import type { Subscription } from '../types/subscription';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routeConfig';
import { toast } from 'sonner';

export function AnalystSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const inAnalystLayout = useContext(AnalystLayoutContext);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.getActiveSubscriptions();
      setSubscriptions(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subscriptions';
      console.error('Failed to load subscriptions:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatType = (type: string): string => {
    return type
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const inner = (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">My Subscriptions</h1>
        <p className="text-slate-600">View your active IP tracking subscriptions</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading subscriptions...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Error loading subscriptions</p>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && subscriptions.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-700 mb-2">No active subscriptions</p>
          <p className="text-slate-600 mb-6">Create a subscription to start tracking patents, competitors, and trademarks.</p>
          <button 
            onClick={() => navigate(ROUTES.ANALYST_CREATE_SUBSCRIPTION)} 
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Subscription
          </button>
        </div>
      )}

      {/* Subscriptions Table */}
      {!loading && !error && subscriptions.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">Tier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">Alert Frequency</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">Created At</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr 
                    key={sub.id} 
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                      {formatType(sub.type)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {sub.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {sub.alertFrequency.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          sub.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(sub.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button 
              onClick={() => navigate(ROUTES.ANALYST_CREATE_SUBSCRIPTION)} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Another Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // If rendered inside the AnalystLayout, just return the inner content
  if (inAnalystLayout) {
    return inner;
  }

  // Otherwise render the page with the analyst sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        <AnalystSidebar />
        <main className="flex-1 p-8 overflow-y-auto">{inner}</main>
      </div>
    </div>
  );
}

export default AnalystSubscriptionsPage;