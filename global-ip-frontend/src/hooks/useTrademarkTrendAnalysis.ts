import { useState, useEffect, useCallback } from 'react';
import {
  AggregatedTrademarkTrendData,
  TrademarkTrendAnalysisReport,
  TrademarkTrendFilterOptions,
} from '../types/trademark-trends';
import trademarkTrendAPI from '../services/trademarkTrendAPI';
import { analyzeTrademarkTrends } from '../utils/trademarkTrendAnalyzer';

interface UseTrademarkTrendReturn {
  aggregatedData: AggregatedTrademarkTrendData | null;
  analysisReport: TrademarkTrendAnalysisReport | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and analyze trademark trend data
 * Provides both raw aggregated data and generated intelligence insights
 */
export const useTrademarkTrendAnalysis = (
  filters?: TrademarkTrendFilterOptions,
  enabled: boolean = true
): UseTrademarkTrendReturn => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedTrademarkTrendData | null>(null);
  const [analysisReport, setAnalysisReport] = useState<TrademarkTrendAnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAndAnalyze = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching trademark trend data...');
      const data = await trademarkTrendAPI.getAllTrendData(filters);
      setAggregatedData(data);

      // Generate intelligence report from data
      console.log('🧠 Analyzing trademark trends...');
      const report = analyzeTrademarkTrends(data);
      setAnalysisReport(report);

      console.log('✅ Trademark analysis complete');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch trademark trends');
      setError(error);
      console.error('❌ Error in trademark trend analysis:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, enabled]);

  useEffect(() => {
    fetchAndAnalyze();
  }, [fetchAndAnalyze]);

  return {
    aggregatedData,
    analysisReport,
    loading,
    error,
    refetch: fetchAndAnalyze,
  };
};

/**
 * Hook to fetch only summary metrics
 */
export const useTrademarkSummary = (
  filters?: TrademarkTrendFilterOptions,
  enabled: boolean = true
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await trademarkTrendAPI.getSummary(filters);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch summary'));
      console.error('Error fetching trademark summary:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch top trademark classes
 */
export const useTrademarkClasses = (
  filters?: TrademarkTrendFilterOptions,
  enabled: boolean = true
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await trademarkTrendAPI.getTopClasses(filters);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch classes'));
      console.error('Error fetching trademark classes:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch top countries by trademark filings
 */
export const useTrademarkCountries = (
  filters?: TrademarkTrendFilterOptions,
  enabled: boolean = true
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await trademarkTrendAPI.getTopCountries(filters);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
      console.error('Error fetching trademark countries:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch trademark status distribution
 */
export const useTrademarkStatus = (
  filters?: TrademarkTrendFilterOptions,
  enabled: boolean = true
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await trademarkTrendAPI.getStatusDistribution(filters);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch status'));
      console.error('Error fetching trademark status:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
