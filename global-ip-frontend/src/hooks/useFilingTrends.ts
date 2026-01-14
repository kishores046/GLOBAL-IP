import { useState, useEffect } from 'react';
import { competitorAPI, MonthlyFilingTrend } from '../services/competitorAPI';

interface UseFilingTrendsReturn {
  trends: MonthlyFilingTrend[];
  isLoading: boolean;
  error: string | null;
  refetch: (fromDate?: string) => void;
}

/**
 * Hook to fetch monthly filing trends
 */
export function useFilingTrends(fromDate: string = '2020-01-01'): UseFilingTrendsReturn {
  const [trends, setTrends] = useState<MonthlyFilingTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async (date?: string) => {
    const dateToUse = date || fromDate || '2020-01-01';
    try {
      setIsLoading(true);
      setError(null);
      const data = await competitorAPI.getMonthlyTrends(dateToUse);
      setTrends(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load filing trends';
      setError(message);
      setTrends([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [fromDate]);

  return {
    trends,
    isLoading,
    error,
    refetch: fetchTrends,
  };
}
