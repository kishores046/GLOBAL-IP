import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Network } from "lucide-react";

export function VisualizationEnginePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Visualization Engine</h1>
              <p className="text-slate-600">Generate visual representations of your data</p>
            </div>

            {/* Visualization Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* IP Heatmap Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <div className="flex flex-col items-center justify-center h-80">
                  {/* Heatmap Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[...Array(9)].map((_, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 bg-blue-400 rounded-lg group-hover:scale-110 transition-transform"
                        style={{
                          opacity: 0.6 + (index % 3) * 0.15,
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Card Title */}
                  <h3 className="text-3xl text-white">IP Heatmap</h3>
                </div>
              </div>

              {/* Patent Owner Network Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <div className="flex flex-col items-center justify-center h-80">
                  {/* Network Diagram */}
                  <div className="relative mb-8">
                    <svg width="200" height="160" viewBox="0 0 200 160" className="group-hover:scale-110 transition-transform">
                      {/* Connections */}
                      <line x1="100" y1="40" x2="60" y2="120" stroke="#60a5fa" strokeWidth="4" opacity="0.7" />
                      <line x1="100" y1="40" x2="140" y2="120" stroke="#60a5fa" strokeWidth="4" opacity="0.7" />
                      
                      {/* Nodes */}
                      <circle cx="100" cy="40" r="20" fill="#3b82f6" stroke="#60a5fa" strokeWidth="3" />
                      <circle cx="60" cy="120" r="20" fill="#3b82f6" stroke="#60a5fa" strokeWidth="3" />
                      <circle cx="140" cy="120" r="20" fill="#a855f7" stroke="#c084fc" strokeWidth="3" />
                    </svg>
                  </div>
                  
                  {/* Card Title */}
                  <h3 className="text-3xl text-white text-center">Patent Owner Network</h3>
                </div>
              </div>
            </div>

            {/* Additional Options Section */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
              <h2 className="text-2xl text-blue-900 mb-4">Visualization Options</h2>
              <p className="text-slate-600 mb-4">
                Select a visualization type above to generate interactive charts and graphs for your IP data analysis.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
                  <h3 className="text-blue-900 mb-2">Citation Networks</h3>
                  <p className="text-sm text-slate-600">Visualize patent citation relationships</p>
                </div>
                
                <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
                  <h3 className="text-blue-900 mb-2">Geographic Distribution</h3>
                  <p className="text-sm text-slate-600">View IP portfolios by region</p>
                </div>
                
                <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
                  <h3 className="text-blue-900 mb-2">Technology Trees</h3>
                  <p className="text-sm text-slate-600">Explore technology classification hierarchies</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
