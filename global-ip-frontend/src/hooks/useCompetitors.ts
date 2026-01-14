import { useState, useEffect } from 'react';
import { competitorAPI, Competitor } from '../services/competitorAPI';

interface UseCompetitorsReturn {
  competitors: Competitor[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch and manage competitors list
 */
export function useCompetitors(activeOnly: boolean = true): UseCompetitorsReturn {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await competitorAPI.getAllCompetitors(activeOnly);
      setCompetitors(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load competitors';
      setError(message);
      console.error('Error fetching competitors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, [activeOnly]);

  return {
    competitors,
    isLoading,
    error,
    refetch: fetchCompetitors,
  };
}
