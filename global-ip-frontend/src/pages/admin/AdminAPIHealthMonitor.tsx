/**
 * API Health Monitor Page - Admin Monitoring Dashboard
 * Phase 1: MVP Implementation
 */

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { HealthStatusCard } from '../../components/admin/HealthStatusCard';
import { LoadingSkeleton } from '../../components/admin/LoadingSkeleton';
import { Activity, RefreshCw, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useApiHealth, useHealthSummary } from '../../hooks/useAdminQueries';

export function AdminAPIHealthMonitor() {
  const {
    data: healthData,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth,
    dataUpdatedAt,
  } = useApiHealth();

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useHealthSummary();

  const handleRefresh = async () => {
    await Promise.all([refetchHealth(), refetchSummary()]);
  };

  const getLastUpdated = () => {
    if (!dataUpdatedAt) return 'Never';
    const seconds = Math.floor((Date.now() - dataUpdatedAt) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  const getOverallHealthColor = (health?: string) => {
    switch (health) {
      case 'Excellent':
        return 'text-green-700 bg-green-100';
      case 'Good':
        return 'text-blue-700 bg-blue-100';
      case 'Degraded':
        return 'text-yellow-700 bg-yellow-100';
      case 'Critical':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Admin" />

      <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-blue-900 mb-2">API Health Monitor</h1>
                <p className="text-slate-600">Real-time status of all integrated IP data sources</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-xl rounded-lg border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-md hover:shadow-lg text-slate-700 hover:text-blue-900"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Error State */}
            {(healthError || summaryError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">Failed to load health data</p>
                  <p className="text-red-600 text-sm">Please try refreshing the page</p>
                </div>
              </div>
            )}

            {/* Overall Health Summary */}
            {summaryLoading ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-48"></div>
              </div>
            ) : summary ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Overall Health Status</h2>
                      <p className="text-slate-600">{summary.operationalStatus}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getOverallHealthColor(summary.overallHealth)}`}>
                    {summary.overallHealth}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-slate-600">Avg Latency</p>
                      <p className="text-xl font-semibold text-slate-900">{summary.avgLatency}ms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Total Requests</p>
                      <p className="text-xl font-semibold text-slate-900">{summary.totalRequests.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-slate-600">Last Updated</p>
                      <p className="text-xl font-semibold text-slate-900">{getLastUpdated()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* API Health Cards */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Individual API Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {healthLoading ? (
                  <LoadingSkeleton count={4} />
                ) : healthData ? (
                  healthData.map((api) => (
                    <HealthStatusCard
                      key={api.service}
                      service={api.service}
                      status={api.status}
                      uptime={api.uptime}
                      latency={api.avgLatencyMs}
                      lastSync={api.lastSync}
                      errorRate={api.errorRate}
                      onClick={() => {
                        // Future: Open detailed metrics modal
                        console.log('View details for:', api.service);
                      }}
                    />
                  ))
                ) : null}
              </div>
            </div>

            {/* Status Legend */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Legend</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium text-slate-900">Healthy</p>
                    <p className="text-sm text-slate-600">Operating normally</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div>
                    <p className="font-medium text-slate-900">Warning</p>
                    <p className="text-sm text-slate-600">Degraded performance</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div>
                    <p className="font-medium text-slate-900">Error</p>
                    <p className="text-sm text-slate-600">Service unavailable</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <div>
                    <p className="font-medium text-slate-900">Unknown</p>
                    <p className="text-sm text-slate-600">Status unavailable</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-refresh indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Auto-refreshing every 15 seconds
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
