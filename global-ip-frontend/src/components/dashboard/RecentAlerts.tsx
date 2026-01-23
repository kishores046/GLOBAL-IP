import { CheckCircle, AlertTriangle, RefreshCw, FileText } from "lucide-react";

interface Alert {
  id: string;
  type: "grant" | "expiry" | "renewal" | "publication";
  title: string;
  patent: string;
  time: string;
}

export function RecentAlerts() {
  const alerts: Alert[] = [
    { id: "1", type: "grant", title: "Patent Granted", patent: "US-2024-001234", time: "2 hours ago" },
    { id: "2", type: "publication", title: "New Publication", patent: "EP-2024-005678", time: "5 hours ago" },
    { id: "3", type: "renewal", title: "Renewal Due", patent: "CN-2023-009876", time: "1 day ago" },
    { id: "4", type: "expiry", title: "Expiry Warning", patent: "JP-2020-004321", time: "2 days ago" },
    { id: "5", type: "grant", title: "Trademark Granted", patent: "TM-US-2024-111", time: "3 days ago" },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "grant":
        return "from-green-500/30 to-emerald-500/30 border-green-500/40 text-green-700";
      case "expiry":
        return "from-red-500/30 to-pink-500/30 border-red-500/40 text-red-700";
      case "renewal":
        return "from-yellow-500/30 to-orange-500/30 border-yellow-500/40 text-yellow-700";
      case "publication":
        return "from-blue-500/30 to-cyan-500/30 border-blue-500/40 text-cyan-700";
      default:
        return "from-gray-500/30 to-slate-500/30 border-gray-500/40 text-gray-700";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "grant":
        return CheckCircle;
      case "expiry":
        return AlertTriangle;
      case "renewal":
        return RefreshCw;
      case "publication":
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl text-slate-900 mb-2">Recent Alerts</h3>
        <p className="text-slate-600">Latest IP activity notifications</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = getIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`flex items-center gap-4 p-4 bg-gradient-to-r ${getAlertColor(alert.type)} backdrop-blur-sm rounded-xl border transition-all hover:scale-102 cursor-pointer group animate-slide-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 group-hover:text-slate-900 transition-colors">
                  {alert.title}
                </div>
                <div className="text-slate-600 text-sm truncate">{alert.patent}</div>
              </div>
              
              <div className="text-slate-500 text-xs whitespace-nowrap">
                {alert.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}