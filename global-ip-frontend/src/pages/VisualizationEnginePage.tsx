import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Network, TrendingUp, Globe } from "lucide-react";
import { EnhancedCitationGraph } from "../components/citation";

type ViewType = 'home' | 'citations' | 'trends' | 'geography';

export function VisualizationEnginePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPatentId, setSelectedPatentId] = useState<string | null>(null);

  useEffect(() => {
    const view = searchParams.get('view') as ViewType;
    const patentId = searchParams.get('patentId');
    
    if (view) setCurrentView(view);
    if (patentId) setSelectedPatentId(patentId);
  }, [searchParams]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    navigate(`/analyst/visualization?view=${view}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-blue-900 mb-2">Visualization Engine</h1>
              <p className="text-slate-600">Explore patent data through interactive visualizations</p>
            </div>

            {currentView === 'home' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Citation Network Card */}
                <button
                  onClick={() => handleViewChange('citations')}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-400"
                >
                  <div className="flex flex-col items-center justify-center h-48">
                    <Network className="w-16 h-16 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      Citation Network
                    </h3>
                    <span className="text-xs text-amber-600 font-medium mb-2">
                      Experimental
                    </span>
                    <p className="text-sm text-slate-600 text-center">
                      Direct citations only (depth 1) • US patents
                    </p>
                  </div>
                </button>

                {/* Filing Trends Card */}
                <button
                  onClick={() => handleViewChange('trends')}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-400"
                >
                  <div className="flex flex-col items-center justify-center h-48">
                    <TrendingUp className="w-16 h-16 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      Filing Trends
                    </h3>
                    <p className="text-sm text-slate-600 text-center">
                      Patent filings over time
                    </p>
                  </div>
                </button>

                {/* Geographic Distribution Card */}
                <button
                  onClick={() => handleViewChange('geography')}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-400"
                >
                  <div className="flex flex-col items-center justify-center h-48">
                    <Globe className="w-16 h-16 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      Geographic Distribution
                    </h3>
                    <p className="text-sm text-slate-600 text-center">
                      Filings by country
                    </p>
                  </div>
                </button>
              </div>
            )}

            {currentView === 'citations' && selectedPatentId && (
              <div>
                <button
                  onClick={() => handleViewChange('home')}
                  className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                >
                  ← Back to Visualizations
                </button>
                <EnhancedCitationGraph patentId={selectedPatentId} source="PATENTSVIEW" />
              </div>
            )}

            {currentView === 'citations' && !selectedPatentId && (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <Network className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Citation Network (Experimental)
                </h3>
                <p className="text-slate-600 mb-6">
                  Navigate to a patent detail page and click "View Citation Network" to explore citations.
                </p>
                <button
                  onClick={() => handleViewChange('home')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Back to Home
                </button>
              </div>
            )}

            {currentView === 'trends' && (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Filing Trends Over Time
                </h3>
                <p className="text-slate-600 mb-4">
                  Coming soon: Line and bar charts showing patent filing patterns over time.
                </p>
                <button
                  onClick={() => handleViewChange('home')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Back to Home
                </button>
              </div>
            )}

            {currentView === 'geography' && (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Geographic Filing Distribution
                </h3>
                <p className="text-slate-600 mb-4">
                  Coming soon: Map and charts showing patent filings by country.
                </p>
                <button
                  onClick={() => handleViewChange('home')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
