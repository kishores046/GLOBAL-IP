import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { User, ChevronDown, Lightbulb, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function CompetitorAnalyticsPage() {
  // Mock data for filing activity chart
  const filingData = [
    { year: "2017", value: 320 },
    { year: "2018", value: 380 },
    { year: "2019", value: 420 },
    { year: "2020", value: 450 },
    { year: "2021", value: 520 },
    { year: "2022", value: 580 },
    { year: "2023", value: 650 },
    { year: "2024", value: 720 },
    { year: "2024", value: 580 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Competitor Analytics</h1>
              <p className="text-slate-600">Compare competitor activity over time and ad across technology domains</p>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-4 mb-8">
              <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-slate-700">
                <span>Compare Companies</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-slate-700">
                <span>Filter Technology Categor</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-slate-700">
                <span>Filter Jurisdiction</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Column - Metrics */}
              <div className="lg:col-span-2 space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Patents Filed Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4 mx-auto">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-4xl text-blue-900 mb-2">792</div>
                      <div className="text-slate-600">Patents Filed</div>
                    </div>
                  </div>

                  {/* Top Owner Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4 mx-auto">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-4xl text-blue-900 mb-2">715</div>
                      <div className="text-slate-600">Top Owncer</div>
                    </div>
                  </div>

                  {/* Patents Filed with Pie Chart */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 mx-auto">
                      {/* Pie Chart SVG */}
                      <svg width="48" height="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="#3b82f6" />
                        <path
                          d="M 24 24 L 24 4 A 20 20 0 0 1 44 24 Z"
                          fill="#a855f7"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl text-blue-900 mb-2">683</div>
                      <div className="text-slate-600">Pstents Filed</div>
                    </div>
                  </div>
                </div>

                {/* Filing Activity Over Time Chart */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                  <h2 className="text-2xl text-blue-900 mb-6">Filing Activity Over Time</h2>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="year" 
                          stroke="#6b7280"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          style={{ fontSize: '12px' }}
                          domain={[0, 750]}
                          ticks={[250, 500, 750]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Column - Insights & Export */}
              <div className="space-y-6">
                {/* Insights Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl text-blue-900">Iitsignts</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <p className="text-slate-700">
                        Filing activity in AI/ML increased 33% over last five years
                      </p>
                    </div>
                  </div>
                </div>

                {/* Export Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl text-blue-900">Export</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all text-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Filing Heatmap (*.6 PBF)</span>
                    </button>
                    
                    <button className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-all text-slate-700">
                      Export Data (CSV)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
