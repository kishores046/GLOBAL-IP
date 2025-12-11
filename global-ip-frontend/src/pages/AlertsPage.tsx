import { useState } from "react";
import { Bell, AlertTriangle, Settings } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { motion } from "motion/react";

interface Alert {
  id: string;
  product: string;
  date: string;
  status: "Overdue" | "Resolved" | "Unresolved" | "Resondue";
}

const mockAlerts: Alert[] = [
  {
    id: "Alert 1",
    product: "Patt Search",
    date: "19 Jan 1",
    status: "Overdue",
  },
  {
    id: "Alert 2",
    product: "Filing Tracker",
    date: "29 Jan",
    status: "Resolved",
  },
  {
    id: "Alert 3",
    product: "Trademark Tracker",
    date: "23 Feb",
    status: "Unresolved",
  },
  {
    id: "Alert 4",
    product: "Legal Status Monitor",
    date: "30 Mar",
    status: "Resolved",
  },
  {
    id: "Alert 5",
    product: "Subscription Usage",
    date: "22 Nov",
    status: "Resondue",
  },
];

export function AlertsPage() {
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [showManageRulesModal, setShowManageRulesModal] = useState(false);
  const [showNotificationSettingsModal, setShowNotificationSettingsModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Unresolved":
        return "bg-yellow-100 text-yellow-700";
      case "Resondue":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl text-blue-900 mb-2">Alerts</h1>
              <p className="text-slate-600">View and manage your subscription alerts</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl text-blue-900">120</div>
                </div>
                <div className="text-slate-900">Total Alerts</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl text-blue-900">16</div>
                </div>
                <div className="text-slate-900">Unresolved Alerts</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setDoNotDisturb(!doNotDisturb)}
                      className={`relative w-16 h-8 rounded-full transition-all shadow-lg ${
                        doNotDisturb
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          doNotDisturb ? "translate-x-9" : "translate-x-1"
                        }`}
                      ></div>
                    </button>
                    <div className="text-2xl text-blue-900">
                      {doNotDisturb ? "ON" : "OFF"}
                    </div>
                  </div>
                </div>
                <div className="text-slate-900">Do Not Disturb</div>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Alerts Table */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
                >
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-blue-200">
                          <th className="text-left py-4 px-4 text-slate-700">Alert</th>
                          <th className="text-left py-4 px-4 text-slate-700">Product</th>
                          <th className="text-left py-4 px-4 text-slate-700">Date</th>
                          <th className="text-left py-4 px-4 text-slate-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.map((alert, index) => (
                          <motion.tr
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className="border-b border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer"
                          >
                            <td className="py-4 px-4 text-slate-900">{alert.id}</td>
                            <td className="py-4 px-4 text-slate-900">{alert.product}</td>
                            <td className="py-4 px-4 text-slate-700">{alert.date}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs inline-block ${getStatusColor(alert.status)}`}>
                                {alert.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Action Buttons */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-6"
                >
                  {/* Manage Rules */}
                  <div 
                    onClick={() => setShowManageRulesModal(true)}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="w-full text-center">
                      <div className="text-2xl text-slate-900 mb-2">Manage Rules</div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div 
                    onClick={() => setShowNotificationSettingsModal(true)}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="w-full text-center">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Settings className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-xl text-slate-900">Notification</div>
                      <div className="text-xl text-slate-900">Settings</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Manage Rules Modal */}
      {showManageRulesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h3 className="text-2xl text-blue-900 mb-6">Manage Alert Rules</h3>
            
            <div className="space-y-4 mb-6">
              {[
                { name: "Patent Filing Status Change", enabled: true },
                { name: "Trademark Opposition", enabled: true },
                { name: "Legal Deadline Approaching", enabled: true },
                { name: "Competitor Activity", enabled: false },
                { name: "Citation Alerts", enabled: true },
              ].map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="text-slate-900">{rule.name}</div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={rule.enabled} />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                Save Changes
              </button>
              <button 
                onClick={() => setShowManageRulesModal(false)}
                className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showNotificationSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl text-blue-900 mb-6">Notification Settings</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-slate-900 mb-1">Email Notifications</div>
                  <div className="text-sm text-slate-600">Receive alerts via email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-slate-900 mb-1">Push Notifications</div>
                  <div className="text-sm text-slate-600">Browser push alerts</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="text-slate-700 mb-2 block">Alert Frequency</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly Digest</option>
                  <option value="daily">Daily Summary</option>
                  <option value="weekly">Weekly Report</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 mb-2 block">Quiet Hours</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    defaultValue="22:00"
                    className="flex-1 px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  />
                  <span className="self-center text-slate-600">to</span>
                  <input
                    type="time"
                    defaultValue="08:00"
                    className="flex-1 px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                Save Settings
              </button>
              <button 
                onClick={() => setShowNotificationSettingsModal(false)}
                className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}