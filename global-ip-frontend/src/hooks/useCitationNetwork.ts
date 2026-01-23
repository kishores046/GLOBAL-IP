import { useState, useEffect } from 'react';
import { CitationNetworkResponse } from '../types/citation';
import api from '../services/api';

interface UseCitationNetworkOptions {
  backwardDepth?: number;
  forwardDepth?: number;
}

interface UseCitationNetworkReturn {
  data: CitationNetworkResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch citation network from CitationController
 * Endpoint: GET /api/patents/{patentId}/citations/network
 * The backend returns CitationNetworkResponse with nodes, edges, and metrics
 */
export function useCitationNetwork(
  patentId: string,
  options: UseCitationNetworkOptions = {}
): UseCitationNetworkReturn {
  const { backwardDepth = 1, forwardDepth = 1 } = options;
  
  const [data, setData] = useState<CitationNetworkResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCitationNetwork = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the dedicated citation network endpoint from CitationController
      const response = await api.get<CitationNetworkResponse>(
        `/patents/${patentId}/citations/network`,
        {
          params: {
            backwardDepth: backwardDepth,
            forwardDepth: forwardDepth
          }
        }
      );
      
      if (!response.data) {
        throw new Error('No citation network data received');
      }

      // The backend already returns the correct format
      setData(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load citation network';
      setError(errorMessage);
      console.error('Citation network fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patentId) {
      fetchCitationNetwork();
    }
  }, [patentId, backwardDepth, forwardDepth]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCitationNetwork,
  };
}
