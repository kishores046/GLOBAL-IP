import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Search, Network, Flag, FileText } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AnalystDashboard() {
  // Mock data for the chart
  const chartData = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 145 },
    { month: "Mar", value: 135 },
    { month: "Apr", value: 160 },
    { month: "May", value: 175 },
    { month: "Jun", value: 190 },
    { month: "Jul", value: 180 },
    { month: "Aug", value: 210 },
    { month: "Sep", value: 220 },
    { month: "Oct", value: 200 },
    { month: "Nov", value: 240 },
    { month: "Dec", value: 260 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Analyst Dashboard</h1>
              <p className="text-slate-600">Overview of your IP analysis activity</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Queries */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">52</div>
                <div className="text-slate-600">Search Queries</div>
              </div>

              {/* Visualization Graphs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">16</div>
                <div className="text-slate-600">Visualization Graphs</div>
              </div>

              {/* Tracked Competitors */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">25</div>
                <div className="text-slate-600">Tracked Competitors</div>
              </div>

              {/* Exports This Week */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">8</div>
                <div className="text-slate-600">Exports This Week</div>
              </div>
            </div>

            {/* Competitor Portfolio Trends Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
              <h2 className="text-2xl text-blue-900 mb-6">Competitor Portfolio Trends</h2>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      domain={[0, 300]}
                      ticks={[0, 100, 200, 300]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}