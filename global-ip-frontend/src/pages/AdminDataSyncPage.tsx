import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";
import { RefreshCw, Database, CheckCircle, XCircle, Clock } from "lucide-react";

interface SyncJob {
  id: string;
  timestamp: string;
  status: "completed" | "failed" | "running";
  duration: string;
  recordsProcessed: number;
  api: string;
}

const syncHistory: SyncJob[] = [
  { id: "1", timestamp: "2025-12-10 14:00:00", status: "completed", duration: "2m 34s", recordsProcessed: 1245, api: "WIPO" },
  { id: "2", timestamp: "2025-12-10 12:00:00", status: "completed", duration: "2m 18s", recordsProcessed: 1189, api: "USPTO" },
  { id: "3", timestamp: "2025-12-10 10:00:00", status: "failed", duration: "45s", recordsProcessed: 0, api: "OpenCorporates" },
  { id: "4", timestamp: "2025-12-10 08:00:00", status: "completed", duration: "2m 56s", recordsProcessed: 1302, api: "EPO" },
  { id: "5", timestamp: "2025-12-10 06:00:00", status: "completed", duration: "1m 42s", recordsProcessed: 987, api: "TMView" },
  { id: "6", timestamp: "2025-12-10 04:00:00", status: "completed", duration: "3m 12s", recordsProcessed: 1456, api: "WIPO" },
  { id: "7", timestamp: "2025-12-10 02:00:00", status: "failed", duration: "1m 05s", recordsProcessed: 0, api: "EPO" },
  { id: "8", timestamp: "2025-12-10 00:00:00", status: "completed", duration: "2m 25s", recordsProcessed: 1123, api: "USPTO" },
];

export function AdminDataSyncPage() {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "running":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "running":
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return null;
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
              <h1 className="text-4xl text-blue-900 mb-2">System Data Sync</h1>
              <p className="text-slate-600">Trigger and monitor database synchronization jobs</p>
            </div>

            {/* Trigger Sync Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl text-slate-900 mb-1">Data Synchronization</h3>
                    <p className="text-slate-600">Sync all IP data from external sources</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Last Sync</div>
                  <div className="text-slate-900">2 minutes ago</div>
                </div>
              </div>
              
              <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6" />
                <span className="text-lg">Trigger Sync Job</span>
              </button>
            </div>

            {/* Sync Statistics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="text-3xl text-blue-900 mb-2">24</div>
                <div className="text-slate-600">Total Syncs Today</div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="text-3xl text-green-600 mb-2">21</div>
                <div className="text-slate-600">Successful</div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="text-3xl text-red-600 mb-2">3</div>
                <div className="text-slate-600">Failed</div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="text-3xl text-blue-900 mb-2">2m 28s</div>
                <div className="text-slate-600">Avg Duration</div>
              </div>
            </div>

            {/* Sync History */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="mb-6">
                <h3 className="text-2xl text-slate-900 mb-1">Recent Sync History</h3>
                <p className="text-slate-600">Latest synchronization job executions</p>
              </div>
              
              <div className="space-y-3">
                {syncHistory.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 bg-white border border-blue-100 rounded-xl hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(job.status)}
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-900">{job.timestamp}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {job.api}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600">
                          {job.recordsProcessed.toLocaleString()} records processed in {job.duration}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync Configuration */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="mb-6">
                <h3 className="text-2xl text-slate-900 mb-1">Sync Configuration</h3>
                <p className="text-slate-600">Configure automatic synchronization settings</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <div>
                    <div className="text-slate-900 mb-1">Auto-sync Enabled</div>
                    <div className="text-sm text-slate-600">Automatically sync data every 2 hours</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer" aria-label="Auto-sync Enabled">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <div>
                    <div className="text-slate-900 mb-1">Sync Interval</div>
                    <div className="text-sm text-slate-600">Time between automatic sync jobs</div>
                  </div>
                  <select className="px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                    <option value="1">Every 1 hour</option>
                    <option value="2" selected>Every 2 hours</option>
                    <option value="4">Every 4 hours</option>
                    <option value="6">Every 6 hours</option>
                    <option value="12">Every 12 hours</option>
                    <option value="24">Every 24 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <div>
                    <div className="text-slate-900 mb-1">Failure Notifications</div>
                    <div className="text-sm text-slate-600">Send alerts when sync jobs fail</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer" aria-label="Failure Notifications">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
