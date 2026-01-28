import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { unifiedTrendsApi } from '../../services/unifiedTrendsApi';
import { FilingTrendData } from '../../types/unifiedTrends';

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  isDark?: boolean;
}

const CustomTooltip = ({ active, payload, label, isDark = false }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div style={{ backgroundColor: isDark ? '#0b1220' : '#ffffff' }} className={"border rounded-lg shadow-lg p-4"}>
      <p style={{ color: isDark ? '#f8fafc' : '#0f172a' }} className="font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export function FilingTrendsChart({ isDark = false }: { isDark?: boolean }) {
  const [data, setData] = useState<FilingTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const trends = await unifiedTrendsApi.getFilingTrends();
      setData(trends);
    } catch (err) {
      console.error('Error loading filing trends:', err);
      setError('Unable to load visualization data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLegendClick = (dataKey: string) => {
    setHiddenSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-600">Loading filing trends...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 font-medium mb-2">Unable to load visualization data.</p>
          <p className="text-sm text-slate-600 mb-4">Please try again later.</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p className="text-lg font-medium mb-1">No Data Available</p>
          <p className="text-sm">Filing trends data will appear here when available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Unified Patent Filing Trends
        </h3>
        <p className="text-sm text-slate-600">
          Comparison between USPTO (PatentsView) and EPO
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
          <XAxis
            dataKey="year"
            stroke={isDark ? '#CBD5E1' : '#64748b'}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={isDark ? '#CBD5E1' : '#64748b'}
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Legend
            onClick={(e) => handleLegendClick(e.dataKey as string)}
            wrapperStyle={{ cursor: 'pointer', paddingTop: '20px' }}
          />
          
          {!hiddenSeries.has('patentsViewCount') && (
            <Line
              type="monotone"
              dataKey="patentsViewCount"
              name="PatentsView"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          
          {!hiddenSeries.has('epoCount') && (
            <Line
              type="monotone"
              dataKey="epoCount"
              name="EPO"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-slate-500 text-center">
        Click on legend items to show/hide series
      </div>
    </div>
  );
}
