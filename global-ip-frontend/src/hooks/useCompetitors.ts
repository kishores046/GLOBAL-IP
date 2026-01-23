import { useState, useEffect } from 'react';

interface Competitor {
  id: number;
  displayName: string;
  // Add other competitor properties
}

export function useCompetitorById(competitorId: number | null) {
  const [data, setData] = useState<Competitor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!competitorId) return;

    setIsLoading(true);
    // TODO: Implement API call to fetch competitor by ID
    setIsLoading(false);
  }, [competitorId]);

  return { data, isLoading, error };
}