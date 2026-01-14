import { useState, useEffect } from 'react';
import { competitorAPI, FilingSummary } from '../services/competitorAPI';

interface UseFilingSummaryReturn {
  summary: FilingSummary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch filing summary
 */
export function useFilingSummary(): UseFilingSummaryReturn {
  const [summary, setSummary] = useState<FilingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await competitorAPI.getFilingSummary();
      setSummary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load filing summary';
      setError(message);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    isLoading,
    error,
    refetch: fetchSummary,
  };
}
