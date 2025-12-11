import { useState } from "react";
import { Star, AlertTriangle, Bell, Plus, TrendingUp, FileText, Download } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Subscription {
  product: string;
  jurisdiction: string;
  status: "Active" | "Expiring Soon";
  renewalDate: string;
}

const mockSubscriptions: Subscription[] = [
  {
    product: "Patent Search",
    jurisdiction: "US, EP",
    status: "Active",
    renewalDate: "12 Jan 2026",
  },
  {
    product: "Trademark Tracker",
    jurisdiction: "Global",
    status: "Expiring Soon",
    renewalDate: "05 Feb 2026",
  },
  {
    product: "Legal Status Monitor",
    jurisdiction: "IN",
    status: "Active",
    renewalDate: "30 Mar 2026",
  },
];

const usageTrendData = [
  { month: "Jul", usage: 45 },
  { month: "Aug", usage: 52 },
  { month: "Sep", usage: 78 },
  { month: "Oct", usage: 65 },
  { month: "Nov", usage: 89 },
  { month: "Dec", usage: 95 },
];

export function SubscriptionsPage() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-700";
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
              <h1 className="text-4xl text-blue-900 mb-2">My Subscriptions</h1>
              <p className="text-slate-600">Manage your IP tracking & intelligence subscriptions</p>
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
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl text-blue-900">12</div>
                </div>
                <div className="text-slate-900 mb-1">Active Subscriptions</div>
                <div className="text-slate-600">12 Active</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl text-blue-900">3</div>
                </div>
                <div className="text-slate-900 mb-1">Expiring Soon</div>
                <div className="text-slate-600">3 Expiring in 7 days</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl text-blue-900">42</div>
                </div>
                <div className="text-slate-900 mb-1">Alerts Enabled</div>
                <div className="text-slate-600">42 Alerts Active</div>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Subscriptions Table & Chart */}
              <div className="lg:col-span-2 space-y-6">
                {/* Subscriptions Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl text-slate-900 mb-1">Current Subscriptions</h2>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-blue-200">
                          <th className="text-left py-4 px-4 text-slate-700">Product</th>
                          <th className="text-left py-4 px-4 text-slate-700">Jurisdiction</th>
                          <th className="text-left py-4 px-4 text-slate-700">Status</th>
                          <th className="text-left py-4 px-4 text-slate-700">Renewal Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((sub, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className="border-b border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer"
                          >
                            <td className="py-4 px-4 text-slate-900">{sub.product}</td>
                            <td className="py-4 px-4 text-slate-700">{sub.jurisdiction}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs inline-block ${getStatusColor(sub.status)}`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-700">{sub.renewalDate}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Usage Trends Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
                >
                  <h2 className="text-2xl text-slate-900 mb-6">Subscription Usage Trends</h2>
                  
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={usageTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, fill: "#2563eb" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Right Column - Action Buttons */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  {/* Add New Subscription */}
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="w-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-lg">Add New Subscription</span>
                  </button>

                  {/* Upgrade Plan */}
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full p-5 bg-white/70 backdrop-blur-xl hover:bg-white text-blue-700 rounded-2xl shadow-lg border border-blue-200/50 hover:border-blue-300 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Upgrade Plan</span>
                  </button>

                  {/* Billing & Invoices */}
                  <button 
                    onClick={() => setShowBillingModal(true)}
                    className="w-full p-5 bg-white/70 backdrop-blur-xl hover:bg-white text-blue-700 rounded-2xl shadow-lg border border-blue-200/50 hover:border-blue-300 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Billing & Invoices</span>
                  </button>

                  {/* Download Activity Reports */}
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="w-full p-5 bg-white/70 backdrop-blur-xl hover:bg-white text-blue-700 rounded-2xl shadow-lg border border-blue-200/50 hover:border-blue-300 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Activity Reports</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add New Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl text-blue-900 mb-6">Add New Subscription</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-700 mb-2 block">Subscription Type</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="">Select type</option>
                  <option value="patent">Patent Search</option>
                  <option value="trademark">Trademark Tracker</option>
                  <option value="legal">Legal Status Monitor</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Jurisdiction</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="">Select jurisdiction</option>
                  <option value="us">United States</option>
                  <option value="ep">Europe</option>
                  <option value="global">Global</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Add Subscription
                </button>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h3 className="text-2xl text-blue-900 mb-6">Upgrade Your Plan</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer">
                <h4 className="text-xl text-slate-900 mb-2">Professional</h4>
                <p className="text-3xl text-blue-900 mb-4">$99<span className="text-sm text-slate-600">/month</span></p>
                <ul className="space-y-2 text-slate-600">
                  <li>✓ 50 Tracked Patents</li>
                  <li>✓ Advanced Analytics</li>
                  <li>✓ Priority Support</li>
                </ul>
              </div>
              
              <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded-xl cursor-pointer">
                <div className="text-xs text-blue-600 mb-2">RECOMMENDED</div>
                <h4 className="text-xl text-slate-900 mb-2">Enterprise</h4>
                <p className="text-3xl text-blue-900 mb-4">$299<span className="text-sm text-slate-600">/month</span></p>
                <ul className="space-y-2 text-slate-600">
                  <li>✓ Unlimited Tracking</li>
                  <li>✓ API Access</li>
                  <li>✓ Dedicated Account Manager</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                Upgrade Now
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing & Invoices Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h3 className="text-2xl text-blue-900 mb-6">Billing & Invoices</h3>
            
            <div className="space-y-3 mb-6">
              {[
                { date: "Dec 2025", amount: "$299.00", status: "Paid" },
                { date: "Nov 2025", amount: "$299.00", status: "Paid" },
                { date: "Oct 2025", amount: "$299.00", status: "Paid" },
              ].map((invoice, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-slate-900">{invoice.date}</div>
                    <div className="text-sm text-slate-600">{invoice.status}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-blue-900">{invoice.amount}</div>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowBillingModal(false)}
              className="w-full px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Download Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl text-blue-900 mb-6">Download Activity Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-700 mb-2 block">Report Type</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="usage">Usage Summary</option>
                  <option value="alerts">Alerts Report</option>
                  <option value="subscription">Subscription History</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Date Range</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Download Report
                </button>
                <button 
                  onClick={() => setShowReportModal(false)}
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