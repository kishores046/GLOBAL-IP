import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, AlertCircle, Eye, Radio } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { trackingApi, TrackingPreferences } from '../services/trackingAPI';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';

/**
 * Tracked Patents Page - PORTFOLIO VIEW
 * 
 * Purpose: List all patents the user is tracking
 * Shows: Patent list with tracking preferences
 * Actions: Navigate to detail page
 */
export function TrackedPatentsPage() {
  const navigate = useNavigate();

  const [trackedPatents, setTrackedPatents] = useState<TrackingPreferences[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrackedPatents();
  }, []);

  const loadTrackedPatents = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await trackingApi.getAllPreferences();
      setTrackedPatents(data);
    } catch (err) {
      console.error('Error loading tracked patents:', err);
      setError('Failed to load tracked patents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTrackingTypes = (patent: TrackingPreferences): string[] => {
    const types: string[] = [];
    if (patent.trackLifecycleEvents) types.push('Lifecycle');
    if (patent.trackStatusChanges) types.push('Status');
    if (patent.trackRenewalsExpiry) types.push('Renewals');
    return types;
  };

  const getNotificationTypes = (patent: TrackingPreferences): string[] => {
    const types: string[] = [];
    if (patent.enableDashboardAlerts) types.push('Dashboard');
    if (patent.enableEmailNotifications) types.push('Email');
    return types;
  };

  const inAnalystLayout = useContext(AnalystLayoutContext);

  if (loading) {

    const loadingInner = (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading tracked patents...</p>
        </div>
      </div>
    );

    if (inAnalystLayout) {
      return loadingInner;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">{loadingInner}</main>
        </div>
      </div>
    );
  }

  const inner = (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Tracked Patents</h1>
            <p className="text-slate-600">{trackedPatents.length} patent{trackedPatents.length !== 1 ? 's' : ''} in your portfolio</p>
          </div>
          <Radio className="w-12 h-12 text-blue-600" />
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && trackedPatents.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-xl rounded-2xl p-12 border border-slate-200/50 shadow-lg text-center">
          <Radio className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Tracked Patents</h3>
          <p className="text-slate-500 mb-6">You haven't started tracking any patents yet.</p>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg">Go to Dashboard</button>
        </motion.div>
      )}

      {/* Patents List */}
      {trackedPatents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Patent ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tracking Events</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Notifications</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {trackedPatents.map((patent, index) => (
                  <motion.tr key={patent.patentId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4"><span className="font-mono text-sm font-medium text-slate-900">{patent.patentId}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {getTrackingTypes(patent).map((type) => (
                          <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">{type}</span>
                        ))}
                        {getTrackingTypes(patent).length === 0 && <span className="text-xs text-slate-400">No events tracked</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {getNotificationTypes(patent).map((type) => (
                          <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">{type}</span>
                        ))}
                        {getNotificationTypes(patent).length === 0 && <span className="text-xs text-slate-400">No notifications</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => navigate(`/patents/${patent.patentId}`)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View details"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => navigate(`/patents/${patent.patentId}/track`)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Configure tracking"><Radio className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      {trackedPatents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-900"><strong>Tip:</strong> Click the eye icon to view patent details, or the radio icon to configure tracking preferences.</p>
        </motion.div>
      )}
    </div>
  );

  if (inAnalystLayout) {
    return inner;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">{inner}</main>
      </div>
    </div>
  );
}
