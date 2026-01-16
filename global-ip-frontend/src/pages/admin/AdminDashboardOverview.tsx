/**
 * Dashboard Overview Page - Admin Monitoring Dashboard
 * Phase 1: MVP Implementation
 */

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { MetricCard } from '../../components/admin/MetricCard';
import { LoadingSkeleton } from '../../components/admin/LoadingSkeleton';
import { Users, Activity, AlertCircle, RefreshCw, Target, UserX } from 'lucide-react';
import { useAdminOverview } from '../../hooks/useAdminQueries';
import { useDashboardCounts } from '../../hooks/useUsers';
import { useState } from 'react';

export function AdminDashboardOverview() {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');
  const { data: overview, isLoading, error, refetch } = useAdminOverview();
  const { data: userCounts, isLoading: isLoadingUsers } = useDashboardCounts();

  const getErrorColor = (errors: number): 'red' | 'yellow' | 'green' => {
    if (errors > 50) return 'red';
    if (errors > 20) return 'yellow';
    return 'green';
  };

  const handleRefresh = () => {
    refetch();
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
                <h1 className="text-4xl font-bold text-blue-900 mb-2">Dashboard Overview</h1>
                <p className="text-slate-600">Real-time system metrics and analytics</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Time Range Selector */}
                <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl rounded-lg p-1 border border-blue-200/50">
                  <button
                    onClick={() => setTimeRange('today')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      timeRange === 'today'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-slate-600 hover:text-blue-900'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setTimeRange('7days')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      timeRange === '7days'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-slate-600 hover:text-blue-900'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setTimeRange('30days')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      timeRange === '30days'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-slate-600 hover:text-blue-900'
                    }`}
                  >
                    Last 30 Days
                  </button>
                </div>

                {/* Refresh Button */}
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
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">Failed to load dashboard data</p>
                  <p className="text-red-600 text-sm">Please try refreshing the page</p>
                </div>
              </div>
            )}

            {/* High-Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(isLoading || isLoadingUsers) && <LoadingSkeleton count={4} />}
              
              {!isLoading && !isLoadingUsers && overview && userCounts && (
                <>
                  <MetricCard
                    icon={<Users className="w-6 h-6 text-white" />}
                    label="Total Users"
                    value={userCounts.totalUsers}
                    color="blue"
                  />
                  <MetricCard
                    icon={<Activity className="w-6 h-6 text-white" />}
                    label="Active Users"
                    value={userCounts.activeUsers}
                    color="green"
                  />
                  <MetricCard
                    icon={<UserX className="w-6 h-6 text-white" />}
                    label="Inactive Users"
                    value={userCounts.inactiveUsers}
                    color="yellow"
                  />
                  <MetricCard
                    icon={<AlertCircle className="w-6 h-6 text-white" />}
                    label="Errors Today"
                    value={overview.errorsToday}
                    color={getErrorColor(overview.errorsToday)}
                  />
                </>
              )}
            </div>

            {/* Top Service and Action */}
            {overview && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Top Service</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{overview.topService}</div>
                  <p className="text-slate-600">Most requested API service</p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Top Action</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{overview.topAction}</div>
                  <p className="text-slate-600">Most performed action</p>
                </div>
              </div>
            )}

            {/* Auto-refresh indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Auto-refreshing every 30 seconds
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
