import { useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { motion } from "motion/react";

interface FilingItem {
  assetId: string;
  title: string;
  status: "Application" | "Granted" | "Pending" | "Rejected";
  lastUpdate: string;
  nextActionDate: string;
}

const mockFilingData: FilingItem[] = [
  {
    assetId: "WO2023071234",
    title: "Quantum-Resistant Cryptography Method",
    status: "Application",
    lastUpdate: "2024-07-10",
    nextActionDate: "2024-09-15",
  },
  {
    assetId: "EP3456789A1",
    title: "Method for Manufacturing Graphene Supercapacitors",
    status: "Application",
    lastUpdate: "2024-07-18",
    nextActionDate: "2025-02-01",
  },
  {
    assetId: "US11234567B2",
    title: "AI-Powered Drug Discovery Platform",
    status: "Granted",
    lastUpdate: "2024-06-22",
    nextActionDate: "2024-12-22",
  },
  {
    assetId: "TM018765432",
    title: "Synergy AI",
    status: "Granted",
    lastUpdate: "2024-05-15",
    nextActionDate: "2025-05-15",
  },
];

export function FilingTrackerPage() {
  const [filings, setFilings] = useState<FilingItem[]>(mockFilingData);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddSubscription = () => {
    setShowAddDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Granted":
        return "bg-green-100 text-green-700";
      case "Application":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
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
              <h1 className="text-4xl text-blue-900 mb-2">Tracker</h1>
              <p className="text-slate-600">Monitor filings and legal status changes for your subscribed IP assets</p>
            </motion.div>

            {/* Filing Tracker Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
            >
              {/* Header with Add Subscription Button */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl text-slate-900 mb-1">Filing Tracker</h2>
                  <p className="text-slate-600">
                    Monitor filings and legal status changes for your subscribed IP assets.
                  </p>
                </div>
                <button
                  onClick={handleAddSubscription}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subscription</span>
                </button>
              </div>

              {/* Filing Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-200">
                      <th className="text-left py-4 px-4 text-slate-700">Asset ID</th>
                      <th className="text-left py-4 px-4 text-slate-700">Title</th>
                      <th className="text-left py-4 px-4 text-slate-700">Status</th>
                      <th className="text-left py-4 px-4 text-slate-700">Last Update</th>
                      <th className="text-left py-4 px-4 text-slate-700">Next Action Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filings.map((filing, index) => (
                      <motion.tr
                        key={filing.assetId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="border-b border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer"
                      >
                        <td className="py-4 px-4 text-slate-900">{filing.assetId}</td>
                        <td className="py-4 px-4 text-slate-900">{filing.title}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs inline-block ${getStatusColor(
                              filing.status
                            )}`}
                          >
                            {filing.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-700">{filing.lastUpdate}</td>
                        <td className="py-4 px-4 text-slate-700">{filing.nextActionDate}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Add Subscription Modal */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl text-blue-900 mb-6">Add New Subscription</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-700 mb-2 block">Asset ID or Patent Number</label>
                <input
                  type="text"
                  placeholder="Enter asset ID (e.g., WO2023071234)"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Jurisdiction</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="">Select jurisdiction</option>
                  <option value="USPTO">USPTO</option>
                  <option value="EPO">EPO</option>
                  <option value="WIPO">WIPO</option>
                  <option value="TMView">TMView</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Alert Frequency</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Add Subscription
                </button>
                <button 
                  onClick={() => setShowAddDialog(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}