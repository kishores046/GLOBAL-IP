import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";
import { Search, Filter, Download } from "lucide-react";
import { useState } from "react";

interface ActivityLog {
  id: string;
  timestamp: string;
  apiSource: string;
  action: string;
  status: "success" | "error" | "warning";
  responseTime: string;
}

const activityLogs: ActivityLog[] = [
  { id: "1", timestamp: "2025-12-10 14:32:15", apiSource: "WIPO", action: "Patent Search Query", status: "success", responseTime: "120ms" },
  { id: "2", timestamp: "2025-12-10 14:30:45", apiSource: "USPTO", action: "Trademark Lookup", status: "success", responseTime: "145ms" },
  { id: "3", timestamp: "2025-12-10 14:28:22", apiSource: "EPO", action: "Patent Status Check", status: "warning", responseTime: "320ms" },
  { id: "4", timestamp: "2025-12-10 14:25:10", apiSource: "TMView", action: "Data Sync", status: "success", responseTime: "95ms" },
  { id: "5", timestamp: "2025-12-10 14:20:33", apiSource: "OpenCorporates", action: "Company Search", status: "error", responseTime: "890ms" },
  { id: "6", timestamp: "2025-12-10 14:15:28", apiSource: "WIPO", action: "International Patent Filing", status: "success", responseTime: "156ms" },
  { id: "7", timestamp: "2025-12-10 14:10:19", apiSource: "USPTO", action: "Patent Classification", status: "success", responseTime: "98ms" },
  { id: "8", timestamp: "2025-12-10 14:05:42", apiSource: "EPO", action: "European Patent Search", status: "warning", responseTime: "412ms" },
  { id: "9", timestamp: "2025-12-10 14:00:55", apiSource: "TMView", action: "Trademark Status Update", status: "success", responseTime: "87ms" },
  { id: "10", timestamp: "2025-12-10 13:58:12", apiSource: "OpenCorporates", action: "Corporate Entity Search", status: "error", responseTime: "1200ms" },
];

export function AdminUsageLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAPI, setSelectedAPI] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
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
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Usage & Activity Logs</h1>
              <p className="text-slate-600">Monitor all API requests and system activity</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
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
                
                <button className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg">
                  <Download className="w-4 h-4" />
                  Export Logs
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedAPI}
                  onChange={(e) => setSelectedAPI(e.target.value)}
                  className="px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                >
                  <option value="">All APIs</option>
                  <option value="WIPO">WIPO</option>
                  <option value="USPTO">USPTO</option>
                  <option value="EPO">EPO</option>
                  <option value="TMView">TMView</option>
                  <option value="OpenCorporates">OpenCorporates</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                >
                  <option value="">All Status</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>

                <button className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Date Range
                </button>

                <button className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Error Level
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-200">
                      <th className="text-left py-3 px-4 text-slate-700">Timestamp</th>
                      <th className="text-left py-3 px-4 text-slate-700">API Source</th>
                      <th className="text-left py-3 px-4 text-slate-700">Action</th>
                      <th className="text-left py-3 px-4 text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 text-slate-700">Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-blue-100 hover:bg-blue-50/50 transition-all"
                      >
                        <td className="py-3 px-4 text-slate-700 text-sm">{log.timestamp}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                            {log.apiSource}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-900">{log.action}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeColor(log.status)}`}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{log.responseTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="text-3xl text-blue-900 mb-2">12,450</div>
                <div className="text-slate-600">Total Requests</div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="text-3xl text-green-600 mb-2">11,892</div>
                <div className="text-slate-600">Successful</div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="text-3xl text-yellow-600 mb-2">412</div>
                <div className="text-slate-600">Warnings</div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="text-3xl text-red-600 mb-2">146</div>
                <div className="text-slate-600">Errors</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
