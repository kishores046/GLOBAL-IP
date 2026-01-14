import { FilingTrendDTO } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FilingTrendChartProps {
  readonly trends: FilingTrendDTO[];
  readonly isLoading: boolean;
}

export function FilingTrendChart({ trends, isLoading }: FilingTrendChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <div className="h-8 w-48 bg-slate-200 rounded mb-6 animate-pulse"></div>
        <div className="h-80 bg-slate-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!Array.isArray(trends) || trends.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Filing Trends by Competitor</h2>
        <div className="h-80 flex items-center justify-center text-slate-500">
          No filing data available for the selected period
        </div>
      </div>
    );
  }

  const chartData = trends.map((trend) => ({
    name: trend.competitorName,
    filings: trend.count,
    code: trend.competitorCode,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Filing Trends by Competitor</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [value.toLocaleString(), 'Filings']}
          />
          <Legend />
          <Bar dataKey="filings" fill="#3b82f6" name="Filing Count" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
