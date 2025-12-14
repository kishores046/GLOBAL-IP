import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { StatCard } from "../components/dashboard/StatCard";
import { TrendChart } from "../components/dashboard/TrendChart";
import { GlobalHeatmap } from "../components/dashboard/GlobalHeatmap";
import { RecentAlerts } from "../components/dashboard/RecentAlerts";
import { RecommendedAssets } from "../components/dashboard/RecommendedAssets";
import { FileText, Award, TrendingUp, Bell, Search, Filter, Eye, Plus, X, Shield, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../routes/routeConfig";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface SearchResult {
  id: string;
  title: string;
  applicant: string;
  status: "Granted" | "Application" | "Published";
  filingDate: string;
  jurisdiction: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "US11234567B2",
    title: "AI-Powered Drug Discovery Platform",
    applicant: "BioInnovate LLC",
    status: "Granted",
    filingDate: "2021-11-20",
    jurisdiction: "USPTO"
  },
  {
    id: "EP3456789A1",
    title: "Method for Manufacturing Graphene Supercapacitors",
    applicant: "NanoMaterials AG",
    status: "Application",
    filingDate: "2022-08-01",
    jurisdiction: "EPO"
  },
  {
    id: "WO2023071234",
    title: "Quantum-Resistant Cryptography Method",
    applicant: "Future Tech Inc.",
    status: "Published",
    filingDate: "2023-05-15",
    jurisdiction: "WIPO"
  }
];

const legalMilestones = [
  { label: "Filed", date: "2023-01-15", completed: true },
  { label: "Published", date: "2023-07-20", completed: true },
  { label: "Examination", date: "2024-03-10", completed: true },
  { label: "Grant", date: "2025-01-05", completed: false },
];

export function UserDashboard() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showSetAlertModal, setShowSetAlertModal] = useState(false);
  const [showViewReportsModal, setShowViewReportsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  
  // Analytics data
  const filingsByYearData = [
    { year: '2020', patents: 245, trademarks: 156 },
    { year: '2021', patents: 312, trademarks: 198 },
    { year: '2022', patents: 428, trademarks: 234 },
    { year: '2023', patents: 587, trademarks: 289 },
    { year: '2024', patents: 734, trademarks: 342 },
  ];

  const jurisdictionData = [
    { name: 'USPTO', value: 456, color: '#3b82f6' },
    { name: 'EPO', value: 342, color: '#06b6d4' },
    { name: 'WIPO', value: 289, color: '#8b5cf6' },
    { name: 'JPO', value: 178, color: '#10b981' },
    { name: 'Other', value: 145, color: '#f59e0b' },
  ];

  const statusDistributionData = [
    { status: 'Granted', count: 856 },
    { status: 'Pending', count: 423 },
    { status: 'Rejected', count: 142 },
    { status: 'Abandoned', count: 89 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', filings: 45, grants: 32 },
    { month: 'Feb', filings: 52, grants: 38 },
    { month: 'Mar', filings: 67, grants: 45 },
    { month: 'Apr', filings: 78, grants: 52 },
    { month: 'May', filings: 89, grants: 61 },
    { month: 'Jun', filings: 95, grants: 67 },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="User" />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Overview of your IP intelligence activity</p>
            </div>

            {/* Search + Filters Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="mb-4">
                <h3 className="text-2xl text-slate-900 mb-1">Quick IP Search</h3>
                <p className="text-slate-600">Search your tracked patents and trademarks</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title, applicant, or asset ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                
                <div className="flex gap-3">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  >
                    <option value="">All Countries</option>
                    <option value="US">United States</option>
                    <option value="EP">Europe</option>
                    <option value="CN">China</option>
                    <option value="JP">Japan</option>
                  </select>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  >
                    <option value="">All Status</option>
                    <option value="granted">Granted</option>
                    <option value="application">Application</option>
                    <option value="published">Published</option>
                  </select>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl">
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
              
              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-all">
                  <Filter className="w-3 h-3 inline mr-1" />
                  Technology
                </button>
                <button className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-all">
                  <Filter className="w-3 h-3 inline mr-1" />
                  Filing Year
                </button>
                <button className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-all">
                  <Filter className="w-3 h-3 inline mr-1" />
                  Category
                </button>
              </div>
            </div>

            {/* Hero Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Tracked Patents"
                value="1,284"
                icon={FileText}
                gradient="from-blue-500 to-blue-600"
                delay={0}
              />
              <StatCard
                title="Tracked Trademarks"
                value="856"
                icon={Award}
                gradient="from-blue-500 to-blue-600"
                delay={100}
              />
              <StatCard
                title="New Filings This Week"
                value="142"
                icon={TrendingUp}
                gradient="from-blue-500 to-blue-600"
                delay={200}
              />
              <StatCard
                title="Live Alerts"
                value="23"
                icon={Bell}
                gradient="from-blue-500 to-blue-600"
                delay={300}
              />
            </div>

            {/* Quick Actions Card */}
            {/* Only show admin request banner if user doesn't have admin role */}
            {!hasRole(ROLES.ADMIN) && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 border border-blue-400 shadow-xl text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Need Admin Access?</h3>
                      <p className="text-blue-100">Request elevated permissions to access advanced features</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/request-admin')}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    Request Admin Access
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Search Results Preview */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl text-slate-900 mb-1">Recent Assets</h3>
                  <p className="text-slate-600">Your latest tracked IP assets</p>
                </div>
                <button className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-200">
                      <th className="text-left py-3 px-4 text-slate-700">Asset ID</th>
                      <th className="text-left py-3 px-4 text-slate-700">Title</th>
                      <th className="text-left py-3 px-4 text-slate-700">Applicant</th>
                      <th className="text-left py-3 px-4 text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 text-slate-700">Filing Date</th>
                      <th className="text-left py-3 px-4 text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSearchResults.map((result) => (
                      <tr
                        key={result.id}
                        className="border-b border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer"
                      >
                        <td className="py-3 px-4 text-slate-900">{result.id}</td>
                        <td className="py-3 px-4 text-slate-900 max-w-xs truncate">{result.title}</td>
                        <td className="py-3 px-4 text-slate-700">{result.applicant}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-sm inline-block ${
                              result.status === "Granted"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : result.status === "Application"
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                : "bg-gradient-to-r from-purple-500 to-indigo-500"
                            }`}
                          >
                            {result.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{result.filingDate}</td>
                        <td className="py-3 px-4">
                          <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all">
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legal Status Timeline & Trend Chart Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Legal Status Timeline */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="mb-6">
                  <h3 className="text-2xl text-slate-900 mb-1">Legal Status Timeline</h3>
                  <p className="text-slate-600">Track key patent milestones</p>
                </div>
                
                <div className="relative">
                  {/* Timeline */}
                  <div className="space-y-6">
                    {legalMilestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            milestone.completed 
                              ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                              : "bg-slate-300"
                          }`}>
                            {milestone.completed ? (
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>
                          {index < legalMilestones.length - 1 && (
                            <div className={`w-0.5 h-8 ${milestone.completed ? "bg-green-500" : "bg-slate-300"}`}></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-slate-900">{milestone.label}</div>
                          <div className="text-sm text-slate-500">{milestone.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="mb-6">
                  <h3 className="text-2xl text-slate-900 mb-1">Quick Actions</h3>
                  <p className="text-slate-600">Frequently used tools and features</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex flex-col items-center gap-2 group" onClick={() => setShowAddAssetModal(true)}>
                    <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Add Asset</span>
                  </button>
                  
                  <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex flex-col items-center gap-2 group" onClick={() => setShowSetAlertModal(true)}>
                    <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Set Alert</span>
                  </button>
                  
                  <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex flex-col items-center gap-2 group" onClick={() => setShowViewReportsModal(true)}>
                    <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">View Reports</span>
                  </button>
                  
                  <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex flex-col items-center gap-2 group" onClick={() => setShowAnalyticsModal(true)}>
                    <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Analytics</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trend Graph */}
            <TrendChart />

            {/* Global Heatmap */}
            <GlobalHeatmap />

            {/* Bottom Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              <RecentAlerts />
              <RecommendedAssets />
            </div>
          </div>
        </main>
      </div>

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">Add New Asset</h3>
              <button onClick={() => setShowAddAssetModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-700 mb-2 block">Asset Type</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="">Select type</option>
                  <option value="patent">Patent</option>
                  <option value="trademark">Trademark</option>
                  <option value="design">Design</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Asset ID or Number</label>
                <input
                  type="text"
                  placeholder="e.g., US11234567B2"
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
                  <option value="JPO">JPO</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Notes (Optional)</label>
                <textarea
                  placeholder="Add any notes about this asset..."
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 h-24 resize-none"
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Add Asset
                </button>
                <button 
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set Alert Modal */}
      {showSetAlertModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">Set New Alert</h3>
              <button onClick={() => setShowSetAlertModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-700 mb-2 block">Alert Type</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="">Select alert type</option>
                  <option value="status">Status Change</option>
                  <option value="deadline">Legal Deadline</option>
                  <option value="opposition">Opposition Filed</option>
                  <option value="citation">New Citation</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Asset ID</label>
                <input
                  type="text"
                  placeholder="Enter asset ID to track"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Notification Method</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    <span className="text-slate-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-700">In-App Notification</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Frequency</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Create Alert
                </button>
                <button 
                  onClick={() => setShowSetAlertModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Reports Modal */}
      {showViewReportsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">Generate Report</h3>
              <button onClick={() => setShowViewReportsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer hover:bg-blue-50">
                  <h4 className="text-slate-900 mb-2">Portfolio Summary</h4>
                  <p className="text-sm text-slate-600">Complete overview of all tracked assets</p>
                </div>
                
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer hover:bg-blue-50">
                  <h4 className="text-slate-900 mb-2">Filing Analysis</h4>
                  <p className="text-sm text-slate-600">Detailed filing trends and statistics</p>
                </div>
                
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer hover:bg-blue-50">
                  <h4 className="text-slate-900 mb-2">Status Report</h4>
                  <p className="text-sm text-slate-600">Current legal status of all assets</p>
                </div>
                
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer hover:bg-blue-50">
                  <h4 className="text-slate-900 mb-2">Alert History</h4>
                  <p className="text-sm text-slate-600">Past alerts and notifications</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-slate-700 mb-2 block">Date Range</label>
                  <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-slate-700 mb-2 block">Format</label>
                  <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel (XLSX)</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Generate Report
                </button>
                <button 
                  onClick={() => setShowViewReportsModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-6xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">IP Analytics Dashboard</h3>
              <button onClick={() => setShowAnalyticsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Filings by Year - Bar Chart */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-slate-900 mb-4">Filings by Year</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filingsByYearData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="patents" fill="#3b82f6" name="Patents" />
                    <Bar dataKey="trademarks" fill="#06b6d4" name="Trademarks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trends - Line Chart */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-slate-900 mb-4">Monthly Filing &amp; Grant Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="filings" stroke="#3b82f6" strokeWidth={3} name="Filings" />
                    <Line type="monotone" dataKey="grants" stroke="#10b981" strokeWidth={3} name="Grants" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Grid of Pie Chart and Area Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Jurisdiction Distribution - Pie Chart */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-slate-900 mb-4">Distribution by Jurisdiction</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={jurisdictionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {jurisdictionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Distribution - Bar Chart */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-slate-900 mb-4">Status Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusDistributionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis type="number" stroke="#64748b" />
                      <YAxis dataKey="status" type="category" stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Chart */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-slate-900 mb-4">Cumulative Growth Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={filingsByYearData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="patents" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Patents" />
                    <Area type="monotone" dataKey="trademarks" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} name="Trademarks" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="w-full px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}