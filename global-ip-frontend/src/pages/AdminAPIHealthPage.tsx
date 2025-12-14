import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";

interface APIStatus {
  name: string;
  status: "healthy" | "warning" | "error";
  uptime: string;
  latency: string;
  lastSync: string;
}

const apiStatusData: APIStatus[] = [
  { name: "WIPO", status: "healthy", uptime: "99.8%", latency: "120ms", lastSync: "2 mins ago" },
  { name: "USPTO", status: "healthy", uptime: "99.5%", latency: "145ms", lastSync: "5 mins ago" },
  { name: "EPO", status: "warning", uptime: "97.2%", latency: "320ms", lastSync: "15 mins ago" },
  { name: "TMView", status: "healthy", uptime: "99.9%", latency: "95ms", lastSync: "1 min ago" },
  { name: "OpenCorporates", status: "error", uptime: "85.3%", latency: "890ms", lastSync: "2 hours ago" },
];

export function AdminAPIHealthPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "healthy":
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
              <h1 className="text-4xl text-blue-900 mb-2">API Health Monitor</h1>
              <p className="text-slate-600">Real-time status of all integrated IP data sources</p>
            </div>

            {/* API Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiStatusData.map((api) => (
                <div
                  key={api.name}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(api.status)} animate-pulse`}></div>
                      <h3 className="text-xl text-slate-900">{api.name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeColor(api.status)}`}>
                      {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm">Uptime</span>
                      <span className="text-slate-900">{api.uptime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm">Latency</span>
                      <span className="text-slate-900">{api.latency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm">Last Sync</span>
                      <span className="text-slate-900">{api.lastSync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-900">Overall Health</h4>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Good</span>
                </div>
                <p className="text-slate-600 text-sm">4 out of 5 APIs operational</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-900">Average Latency</h4>
                  <span className="text-2xl text-blue-900">314ms</span>
                </div>
                <p className="text-slate-600 text-sm">Across all active endpoints</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-900">Total Requests</h4>
                  <span className="text-2xl text-blue-900">12,450</span>
                </div>
                <p className="text-slate-600 text-sm">In the last 24 hours</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
