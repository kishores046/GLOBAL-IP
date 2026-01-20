/**
 * Competitor Detail Page
 * Shows detailed information about a competitor
 */

import { useParams } from 'react-router-dom';
import { useCompetitorById } from '../../hooks/useCompetitors';

export function CompetitorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const competitorId = id ? parseInt(id, 10) : null;
  const { data: competitor, isLoading, error } = useCompetitorById(competitorId);

  if (!competitorId) {
    return <div className="p-8 text-red-600">Invalid competitor ID</div>;
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading competitor details...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Competitor Detail</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-slate-500">Competitor detail component will be rendered here</p>
        {competitor && (
          <p className="text-sm text-slate-400 mt-2">{competitor.displayName}</p>
        )}
      </div>
    </div>
  );
}

export default CompetitorDetailPage;
