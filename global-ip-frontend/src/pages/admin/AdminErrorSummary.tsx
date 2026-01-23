/**
 * Error Summary Page - Admin Monitoring Dashboard
 * Phase 2: Error analytics and visualization
 */

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { LoadingSkeleton } from '../../components/admin/LoadingSkeleton';
import { AlertCircle, TrendingDown, RefreshCw } from 'lucide-react';
import { useErrorSummary } from '../../hooks/useAdminQueries';

export function AdminErrorSummary() {
  const { data: errorData, isLoading, error, refetch } = useErrorSummary();

  const getErrorRateColor = (rate: number) => {
    if (rate < 0.01) return 'text-green-700 bg-green-100';
    if (rate < 0.05) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const getProgressBarColor = (rate: number) => {
    if (rate < 0.01) return 'bg-green-500';
    if (rate < 0.05) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Admin" />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-blue-900 mb-2">Error Summary</h1>
                <p className="text-slate-600">Error analytics and trends across all services</p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-xl rounded-lg border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-md hover:shadow-lg text-slate-700 hover:text-blue-900"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">Failed to load error summary</p>
                  <p className="text-red-600 text-sm">Please try refreshing the page</p>
                </div>
              </div>
            )}

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Error Statistics (Last 24 Hours)
                </h3>
              </div>

              {isLoading ? (
                <div className="p-6">
                  <LoadingSkeleton count={4} />
                </div>
              ) : errorData && errorData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Total Requests
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Errors
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Error Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {errorData.map((item, index) => {
                        const service = item?.service || 'Unknown';
                        const total = item?.total ?? 0;
                        const errors = item?.errors ?? 0;
                        const rate = item?.rate ?? 0;
                        
                        return (
                          <tr
                            key={item?.service || index}
                            className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                            onClick={() => console.log('View errors for:', service)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-slate-900">{service}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900">
                              {total.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className={`text-sm font-semibold ${errors > 100 ? 'text-red-700' : 'text-slate-900'}`}>
                                {errors.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getErrorRateColor(rate)}`}>
                                  {(rate * 100).toFixed(1)}%
                                </span>
                                <div className="flex-1 max-w-xs">
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${getProgressBarColor(rate)}`}
                                      style={{ width: `${Math.min(rate * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <TrendingDown className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium mb-1">No error data available</p>
                  <p className="text-slate-500 text-sm">System is running smoothly!</p>
                </div>
              )}
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Error Rate Thresholds</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium text-green-900">Healthy</p>
                    <p className="text-sm text-green-700">&lt; 1% error rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div>
                    <p className="font-medium text-yellow-900">Warning</p>
                    <p className="text-sm text-yellow-700">1-5% error rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div>
                    <p className="font-medium text-red-900">Critical</p>
                    <p className="text-sm text-red-700">&gt; 5% error rate</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Auto-refreshing every 60 seconds
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
