import { motion } from 'motion/react';
import { Network, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { EnhancedCitationGraph } from '../components/citation/EnhancedCitationGraph';

/**
 * Citation Graph Page - User Specific
 * 
 * Purpose: Display patent citation networks for USER role
 * Shows citation relationships for a specific patent
 * 
 * Accessed via: /user/citation-graph?patentId=xxx
 */
export function CitationGraphPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patentId = searchParams.get('patentId');

  if (!patentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <DashboardHeader userName="User" />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-red-200/50 shadow-xl">
                <h1 className="text-2xl font-bold text-red-900 mb-2">
                  Invalid Request
                </h1>
                <p className="text-slate-600 mb-6">
                  Patent ID is required to view citation graph.
                </p>
                <button
                  onClick={() => navigate('/user/tracked-patents')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Tracked Patents
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="User" />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Back Button */}
            <button
              onClick={() => navigate(`/user/patents/${patentId}`)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Patent</span>
            </button>

            {/* Citation Graph Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-xl">
                  <Network className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">
                    Citation Network
                  </h1>
                  <p className="text-slate-600">
                    Patent ID: <span className="font-mono text-blue-600">{patentId}</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Citation Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 shadow-lg"
            >
              <EnhancedCitationGraph
                patentId={patentId}
              />
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <p className="text-xs text-blue-900">
                <strong>Citation Network:</strong> Shows patents that cite or are cited by the current patent. 
                This helps you understand the patent landscape and related innovations.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CitationGraphPage;
