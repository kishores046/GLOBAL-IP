import { ArrowRight, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Citation {
  citedPatent?: string;
  citingPatent?: string;
  title?: string;
}

interface CitationNetwork {
  backwardCitations?: Citation[];
  forwardCitations?: Citation[];
  totalBackwardCitations?: number;
  totalForwardCitations?: number;
}

interface CitationSummaryProps {
  citationNetwork?: CitationNetwork;
  patentId: string;
  source?: string;
}

export function CitationSummary({ citationNetwork, patentId, source }: CitationSummaryProps) {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isUserRole = hasRole('USER');

  // Only show for PatentsView data
  if (source !== 'PATENTSVIEW' || !citationNetwork) {
    return null;
  }

  const backwardCount = citationNetwork.totalBackwardCitations || 
                        citationNetwork.backwardCitations?.filter(c => c.citedPatent).length || 0;
  const forwardCount = citationNetwork.totalForwardCitations || 
                       citationNetwork.forwardCitations?.filter(c => c.citingPatent).length || 0;

  console.log('📋 Citation Summary Data:', {
    patentId,
    backwardCount,
    forwardCount,
    backwardCitations: citationNetwork.backwardCitations?.map(c => ({
      patent: c.citedPatent,
      title: c.title
    })),
    forwardCitations: citationNetwork.forwardCitations?.map(c => ({
      patent: c.citingPatent,
      title: c.title
    }))
  });

  // Get first 5 backward citations for display
  const topCitations = citationNetwork.backwardCitations?.slice(0, 5) || [];

  const handleViewNetwork = () => {
    // Route to appropriate page based on user role
    if (isUserRole) {
      navigate(`/user/citation-graph?patentId=${patentId}`);
    } else {
      navigate(`/analyst/visualization?patentId=${patentId}&view=citations`);
    }
  };

  const handleCitationClick = (citationPatentId: string) => {
    // Use correct route pattern: /patents/ (plural)
    navigate(`/patents/${citationPatentId}`);
  };

  // Determine forward citation message
  const getForwardCitationMessage = (): string => {
    if (forwardCount === 0) {
      return 'This patent has not yet been cited by later patents. This is common for newly granted or specialized patents.';
    } else if (forwardCount > 10) {
      return `This patent has strong forward citation impact with ${forwardCount} later patents citing this work, indicating significant influence in the field.`;
    } else {
      return `This patent has been cited by ${forwardCount} later patent${forwardCount !== 1 ? 's' : ''}.`;
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
        <Network className="w-6 h-6" />
        Citations
      </h2>

      {/* Citation Counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600 mb-1">Prior Art (Backward)</div>
          <div className="text-3xl font-bold text-slate-900">{backwardCount}</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600 mb-1">Cited By (Forward)</div>
          <div className="text-3xl font-bold text-slate-900">{forwardCount}</div>
        </div>
      </div>

      {/* Context Text */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-slate-700">
          {getForwardCitationMessage()}
        </p>
      </div>

      {/* Sample Citations */}
      {topCitations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Cited Patents (showing {Math.min(topCitations.length, 5)} of {backwardCount})
          </h3>
          <div className="space-y-2">
            {topCitations.map((citation) => {
              const patentId = citation.citedPatent;
              if (!patentId) return null;

              return (
                <button
                  key={patentId}
                  onClick={() => handleCitationClick(patentId)}
                  className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm text-blue-600 font-medium">
                        {patentId}
                      </div>
                      {citation.title && (
                        <div className="text-xs text-slate-600 mt-1 line-clamp-1">
                          {citation.title}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View Network Button */}
      <button
        onClick={handleViewNetwork}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
      >
        <Network className="w-5 h-5" />
        View Citation Network
        <ArrowRight className="w-5 h-5" />
      </button>
      <p className="text-xs text-slate-500 text-center mt-2">
        Explore interactive citation visualization (experimental)
      </p>
    </div>
  );
}
