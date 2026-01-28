import { motion } from 'motion/react';
import { BarChart3, Network, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { FilingTrendsChart } from '../components/charts/FilingTrendsChart';
import { GlobalChoroplethMap } from '../components/charts/GlobalChoroplethMap';
import { EnhancedCitationGraph } from '../components/citation/EnhancedCitationGraph';
import { useContext } from 'react';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';

/**
 * Visualization Engine Page
 * 
 * Purpose: Unified patent analytics through interactive visualizations
 * Displays:
 * 1. Filing Trends (Line Chart) - PatentsView vs EPO over time
 * 2. Global Distribution (Choropleth) - Country-level filing counts
 * 
 * Data Source: Unified Trends API (/api/analyst/unified/trends/*)
 */
export function VisualizationEnginePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isUserRole = user?.role === 'USER';
  const dashboardPrefix = isUserRole ? '/user' : '/analyst';
  const patentId = searchParams.get('patentId');
  const view = searchParams.get('view');
  const isCitationView = view === 'citations' && patentId;

  console.log('[VisualizationEnginePage] Rendering...', { patentId, view, isCitationView, dashboardPrefix });

  const inAnalystLayout = useContext(AnalystLayoutContext);

  const inner = (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Citation View */}
      {isCitationView ? (
        <>
          {/* Back Button */}
          <button onClick={() => navigate(`${dashboardPrefix}/patents/${patentId}`)} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Patent</span>
          </button>

          {/* Citation Graph Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl"><Network className="w-8 h-8 text-blue-600" /></div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">Citation Network</h1>
                <p className="text-slate-600">Patent ID: <span className="font-mono text-blue-600">{patentId}</span></p>
              </div>
            </div>
          </motion.div>

          {/* Citation Graph */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 shadow-lg">
              <EnhancedCitationGraph patentId={patentId || ''} source="PATENTSVIEW" currentPatentTitle={`Citation Network for ${patentId}`} />
            </motion.div>
        </>
      ) : (
        <>
          {/* Standard Visualization View */}
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl"><BarChart3 className="w-8 h-8 text-blue-600" /></div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">Visualization Engine</h1>
                <p className="text-slate-600">Explore patent data through interactive visualizations</p>
              </div>
                <div className="ml-auto" />
            </div>
          </motion.div>

          {/* Filing Trends Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 shadow-lg">
              <FilingTrendsChart />
          </motion.div>

          {/* Global Distribution Map */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 shadow-lg">
              <GlobalChoroplethMap />
          </motion.div>

          {/* Info Box */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-900"><strong>Data Sources:</strong> PatentsView (USPTO) and EPO (European Patent Office). Visualizations update automatically when new data is available.</p>
          </motion.div>
        </>
      )}
    </div>
  );

  if (inAnalystLayout) {
    return inner;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{inner}</main>
      </div>
    </div>
  );
}
