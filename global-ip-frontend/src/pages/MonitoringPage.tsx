import { useState, useEffect, useContext } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { monitoringApi, MonitoringAsset } from '../services/monitoringApi';
import { Loader2, AlertCircle, Trash2, Plus, CheckCircle, Radio, Crown } from 'lucide-react';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';

export function MonitoringPage() {
  const [monitoringList, setMonitoringList] = useState<MonitoringAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patentInput, setPatentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadMonitoringList();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadMonitoringList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await monitoringApi.getMonitoringIps();
      setMonitoringList(data);
    } catch (err: any) {
      console.error('Error loading monitoring list:', err);
      setError('Failed to load monitoring list');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleAddPatent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patentInput.trim()) {
      showToast('Please enter a Patent ID', 'error');
      return;
    }

    setSubmitting(true);
    setShowUpgradeBanner(false);
    
    try {
      const message = await monitoringApi.addMonitoringIp(patentInput.trim());
      showToast(message, 'success');
      setPatentInput('');
      await loadMonitoringList();
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Failed to add patent';
      
      // Map backend messages to user-friendly errors
      if (errorMessage.includes('No active subscription')) {
        showToast("You don't have an active subscription", 'error');
      } else if (errorMessage.includes('Upgrade plan')) {
        showToast("You've reached your monitoring limit", 'error');
        setShowUpgradeBanner(true);
      } else if (errorMessage.includes('already monitored')) {
        showToast('This patent is already being monitored', 'error');
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePatent = async (patentId: string) => {
    setSubmitting(true);
    try {
      const message = await monitoringApi.removeMonitoringIp(patentId);
      showToast(message, 'success');
      await loadMonitoringList();
      setConfirmDelete(null);
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Failed to remove patent';
      
      if (errorMessage.includes('not found')) {
        showToast('Patent not found in monitoring list', 'error');
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderMonitoringCount = () => {
    const patentText = monitoringList.length !== 1 ? 'patents' : 'patent';
    return `${monitoringList.length} ${patentText} monitored`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <p className="text-slate-700 mb-4">{error}</p>
          <button
            onClick={loadMonitoringList}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (monitoringList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Radio className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-600">No patents monitored yet</p>
          <p className="text-sm text-slate-500 mt-1">Add a Patent ID above to start monitoring</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Patent ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Added Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {monitoringList.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono font-medium text-slate-900">{asset.ipAddress}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {new Date(asset.addedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {confirmDelete === asset.ipAddress ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-slate-600">Remove this patent?</span>
                      <button
                        onClick={() => handleRemovePatent(asset.ipAddress)}
                        disabled={submitting}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-slate-300"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        disabled={submitting}
                        className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(asset.ipAddress)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Remove</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const inAnalystLayout = useContext(AnalystLayoutContext);

  const inner = (
    <>
      {!inAnalystLayout && <DashboardHeader userName="Analyst" />}
      <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Patent Monitoring</h1>
                <p className="text-slate-600 mt-1">Track and monitor patents based on your subscription plan</p>
              </div>
            </div>
          </div>

          {/* Upgrade Banner */}
          {showUpgradeBanner && (
            <div className="mb-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Crown className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-lg">You've reached your monitoring limit</h3>
                    <p className="text-purple-100 mt-1">Upgrade your plan to monitor more patents</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}

          {/* Add Patent Form */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Patent ID</h2>
            <form onSubmit={handleAddPatent} className="flex gap-3">
              <input
                type="text"
                value={patentInput}
                onChange={(e) => setPatentInput(e.target.value)}
                placeholder="Enter Patent ID"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Monitoring
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Monitoring List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Monitored Patents</h2>
              <p className="text-sm text-slate-600 mt-1">
                {loading ? 'Loading...' : renderMonitoringCount()}
              </p>
            </div>

            {renderContent()}
          </div>
      </main>
    </>
  );

  if (inAnalystLayout) {
    return (
      <div className="flex-1">
        {inner}
        {/* Toast Notification */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        {inner}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonitoringPage;
