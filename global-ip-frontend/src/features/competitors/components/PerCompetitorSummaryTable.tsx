/**
 * Per-Competitor Summary Table Component
 * Displays filing summary by competitor in a sortable table
 */

import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { CompetitorFilingSummary } from '../types';
import { formatDate } from '../utils';

interface PerCompetitorSummaryTableProps {
  summaries: CompetitorFilingSummary[];
  loading?: boolean;
  onCompetitorClick?: (competitorCode: string) => void;
  onSelectCompetitor?: (competitorId: number, competitorName: string, competitorCode: string) => void;
}

export function PerCompetitorSummaryTable({
  summaries,
  loading,
  onCompetitorClick,
  onSelectCompetitor,
}: PerCompetitorSummaryTableProps) {
  const navigate = useNavigate();

  // Sort by filing count descending
  const sortedSummaries = [...summaries].sort(
    (a, b) => b.filingCount - a.filingCount
  );

  const handleRowClick = (competitorCode: string, competitorName: string) => {
    if (onSelectCompetitor) {
      // Try to extract ID from competitor object, or use 0 as fallback
      onSelectCompetitor(0, competitorName, competitorCode);
    } else if (onCompetitorClick) {
      onCompetitorClick(competitorCode);
    } else {
      navigate(`/competitors/${competitorCode}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Filing Summary by Competitor</h3>
        <div className="text-center py-8">
          <p className="text-slate-600">Loading summary...</p>
        </div>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Filing Summary by Competitor</h3>
        <div className="text-center py-8">
          <p className="text-slate-600">No competitor data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Filing Summary by Competitor</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                Competitor Code
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                Competitor Name
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                Total Filings
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                Latest Filing
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedSummaries.map((summary, idx) => (
              <tr
                key={`${summary.competitorCode}-${idx}`}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(summary.competitorCode, summary.competitorName)}
              >
                <td className="py-3 px-4">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded text-sm font-medium">
                    {summary.competitorCode}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {summary.competitorName}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                    {summary.filingCount.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-600">
                  {summary.latestFiling
                    ? formatDate(summary.latestFiling)
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t text-sm text-slate-600">
        <p>
          Total: {summaries.length} competitor{summaries.length !== 1 ? 's' : ''} ·{' '}
          Combined filings: {summaries.reduce((sum, s) => sum + s.filingCount, 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default PerCompetitorSummaryTable;
