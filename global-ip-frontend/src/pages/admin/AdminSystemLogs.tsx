/**
 * System Logs Page - Admin Monitoring Dashboard
 * Phase 1: MVP Implementation with advanced filtering
 */

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ServiceBadge } from '../../components/admin/ServiceBadge';
import { TableLoadingSkeleton } from '../../components/admin/LoadingSkeleton';
import { Search, Download, ChevronLeft, ChevronRight, AlertCircle, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUsageLogs } from '../../hooks/useAdminQueries';
import { formatTimestamp } from '../../utils/dateUtils';
import { downloadLogsCSV } from '../../utils/exportUtils';
import type { LogFilters } from '../../types/admin';

export function AdminSystemLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<LogFilters>({
    page: 0,
    size: 20,
    sort: 'timestamp,desc',
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      action: debouncedSearch || undefined,
      page: 0, // Reset to first page on search
    }));
  }, [debouncedSearch]);

  const { data, isLoading, error } = useUsageLogs(filters);

  const handleServiceFilter = (service: string) => {
    setFilters((prev) => ({
      ...prev,
      service: service === 'all' ? undefined : service,
      page: 0,
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 0,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleExport = async () => {
    await downloadLogsCSV({
      service: filters.service,
      status: filters.status,
      action: filters.action,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
  };

  const getResponseTimeColor = (timeMs: number) => {
    if (timeMs < 200) return 'text-green-700';
    if (timeMs < 500) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Admin" />

      <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-blue-900 mb-2">System Logs</h1>
              <p className="text-slate-600">Monitor all API requests and system activity</p>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">Failed to load logs</p>
                  <p className="text-red-600 text-sm">Please try refreshing the page</p>
                </div>
              </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs by action, API, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Filters:</span>
                </div>

                <select
                  value={filters.service || 'all'}
                  onChange={(e) => handleServiceFilter(e.target.value)}
                  className="px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 text-sm"
                >
                  <option value="all">All APIs</option>
                  <option value="EPO">EPO</option>
                  <option value="USPTO">USPTO</option>
                  <option value="TRADEMARK">TRADEMARK</option>
                  <option value="TRENDS">TRENDS</option>
                </select>

                <select
                  value={filters.status || 'all'}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="ERROR">ERROR</option>
                </select>

                {/* Active Filters Badge */}
                {(filters.service || filters.status || filters.action) && (
                  <button
                    onClick={() => {
                      setFilters({ page: 0, size: 20, sort: 'timestamp,desc' });
                      setSearchQuery('');
                    }}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden">
              {isLoading ? (
                <div className="p-6">
                  <TableLoadingSkeleton rows={10} />
                </div>
              ) : data && data.content.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            API Source
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Response Time
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            User ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {data.content.map((log) => (
                          <tr
                            key={log.id}
                            className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                            onClick={() => {
                              // Future: Open log details modal
                              console.log('View log details:', log);
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              {formatTimestamp(log.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <ServiceBadge service={log.service} size="sm" />
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900">
                              {log.action}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={log.status} size="sm" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${getResponseTimeColor(log.responseTimeMs)}`}>
                                {log.responseTimeMs}ms
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {log.userId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Showing {data.number * data.size + 1} to{' '}
                      {Math.min((data.number + 1) * data.size, data.totalElements)} of{' '}
                      {data.totalElements} results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(data.number - 1)}
                        disabled={data.number === 0}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      <span className="px-4 py-2 text-sm text-slate-700">
                        Page {data.number + 1} of {data.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(data.number + 1)}
                        disabled={data.number >= data.totalPages - 1}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium mb-1">No logs found</p>
                  <p className="text-slate-500 text-sm">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
