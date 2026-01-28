import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { useContext } from 'react';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';
import { TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const portfolioGrowthData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 145 },
  { month: 'Mar', value: 160 },
  { month: 'Apr', value: 155 },
  { month: 'May', value: 180 },
  { month: 'Jun', value: 200 },
  { month: 'Jul', value: 210 },
  { month: 'Aug', value: 225 },
  { month: 'Sep', value: 240 },
  { month: 'Oct', value: 260 },
  { month: 'Nov', value: 275 },
  { month: 'Dec', value: 290 },
];

export function PortfolioTrackerPage() {
  const inAnalystLayout = useContext(AnalystLayoutContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {!inAnalystLayout && <DashboardHeader userName="Analyst" />}
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Portfolio Tracker</h1>
              <p className="text-slate-600">Track competitor portfolio changes & trends</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Portfolio Count Card */}
                  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-5xl text-blue-900 mb-2">860</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Portfolio Count</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>

                  {/* Decreased Card */}
                  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl">
                    <div className="text-5xl text-blue-900 mb-2">620</div>
                    <div className="text-slate-600">
                      Decreased by <span className="text-red-500">5 %</span>
                    </div>
                  </div>
                </div>

                {/* Portfolio Growth Trends Chart */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl">
                  <h3 className="text-xl text-slate-900 mb-6">Portfolio Growth Trends</h3>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={portfolioGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#64748b"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#64748b"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        domain={[0, 300]}
                        ticks={[100, 200, 300]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Line 
                        type="natural" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#3b82f6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Alerts - Right Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl">
                  <div className="flex items-center gap-2 mb-6">
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl text-slate-900">Recent Alerts</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Alert 1 */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 mb-1">AI Patents Surge</div>
                        <div className="text-xs text-slate-500">2h ago</div>
                      </div>
                    </div>

                    {/* Alert 2 */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 mb-1">Key Filing Deadline</div>
                        <div className="text-xs text-slate-500">1 day</div>
                      </div>
                    </div>

                    {/* Alert 3 */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 mb-1">New Competitor</div>
                        <div className="text-slate-700">SurgeTech</div>
                        <div className="text-xs text-slate-500">3 days</div>
                      </div>
                    </div>
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
