import { useState, useCallback } from 'react';

interface TrendState {
  loading: boolean;
  data: any | null;
  error: Error | null;
}

export const useLazyTrendData = (
  fetchFunction: () => Promise<any>
): [TrendState, () => Promise<void>] => {
  const [state, setState] = useState<TrendState>({
    loading: false,
    data: null,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState({ loading: true, data: null, error: null });
    try {
      const result = await fetchFunction();
      setState({ loading: false, data: result, error: null });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setState({ loading: false, data: null, error });
      console.error('Error fetching trend data:', error);
    }
  }, [fetchFunction]);

  return [state, fetch];
};

export default useLazyTrendData;
