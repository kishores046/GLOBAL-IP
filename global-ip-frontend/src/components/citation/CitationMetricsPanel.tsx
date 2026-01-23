import { NetworkMetrics } from '../../types/citation';
import { BarChart, TrendingUp, Network, Users, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CitationMetricsPanelProps {
  metrics: NetworkMetrics;
  onClose?: () => void;
}

export function CitationMetricsPanel({ metrics, onClose }: CitationMetricsPanelProps) {
  const navigate = useNavigate();

  // Get top assignees (max 3)
  const topAssignees = Object.entries(metrics.assigneeDistribution || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const maxAssigneeCount = topAssignees.length > 0 ? topAssignees[0][1] : 1;

  // Get top technology areas (max 3)
  const topTechAreas = Object.entries(metrics.technologyDistribution || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Generate insights
  const insights = generateInsights(metrics);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-blue-600" />
          Network Statistics
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close panel"
          >
            ×
          </button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-gray-700">Total Patents</span>
          <span className="text-lg font-bold text-blue-600">{metrics.totalNodes}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm text-gray-700">Connections</span>
          <span className="text-lg font-bold text-green-600">{metrics.totalEdges}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-sm text-gray-700">Network Density</span>
          <span className="text-lg font-bold text-purple-600">
            {metrics.citationDensity.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
          <span className="text-sm text-gray-700">Avg Citations</span>
          <span className="text-lg font-bold text-amber-600">
            {metrics.averageCitationsPerPatent.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Most Cited Patent */}
      {metrics.mostCitedPatent && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Most Cited Patent</span>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                {metrics.mostCitedPatent}
              </span>
              <span className="text-xs text-gray-600">
                ({metrics.mostCitedCount} citations)
              </span>
            </div>
            <button
              onClick={() => navigate(`/patent/${metrics.mostCitedPatent}`)}
              className="text-xs text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1"
            >
              View patent →
            </button>
          </div>
        </div>
      )}

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">Key Insights</span>
          </div>
          <div className="space-y-2">
            {insights.map((insight) => (
              <div key={insight} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignee Distribution */}
      {topAssignees.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Assignee Distribution</span>
          </div>
          <div className="space-y-2">
            {topAssignees.map(([assignee, count]) => (
              <div key={assignee}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700 truncate max-w-[180px]">{assignee}</span>
                  <span className="text-gray-500">{count} patents</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    style={{ width: `${(count / maxAssigneeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technology Areas */}
      {topTechAreas.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Network className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Technology Areas (IPC)</span>
          </div>
          <div className="space-y-2">
            {topTechAreas.map(([ipc, count]) => (
              <div key={ipc} className="flex justify-between items-center text-xs">
                <span className="text-gray-700 font-medium">{ipc}</span>
                <span className="text-gray-500">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate insights based on metrics
function generateInsights(metrics: NetworkMetrics): string[] {
  const insights: string[] = [];

  // High backward citations
  if (metrics.totalNodes > 20) {
    insights.push('Large citation network indicates significant prior art foundation');
  }

  // High citation density
  if (metrics.citationDensity > 0.3) {
    insights.push('High network density suggests interconnected technology area');
  }

  // Low citation density
  if (metrics.citationDensity < 0.1 && metrics.totalNodes > 10) {
    insights.push('Low density indicates diverse, loosely connected citations');
  }

  // Multiple clusters
  if (metrics.numberOfClusters && metrics.numberOfClusters > 2) {
    insights.push(`${metrics.numberOfClusters} technology clusters identified - spans multiple technical areas`);
  }

  // Diverse assignees
  const assigneeCount = Object.keys(metrics.assigneeDistribution || {}).length;
  if (assigneeCount > 5) {
    insights.push('Citations span multiple companies and research institutions');
  }

  // Single dominant assignee
  const topAssigneeCount = Math.max(...Object.values(metrics.assigneeDistribution || {}));
  if (topAssigneeCount > metrics.totalNodes * 0.5) {
    insights.push('Citations dominated by single assignee - may indicate focused technology area');
  }

  return insights;
}
