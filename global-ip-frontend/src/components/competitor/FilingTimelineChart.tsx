import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MonthlyFilingTrend } from '../../services/competitorAPI';

interface FilingTimelineChartProps {
  trends: MonthlyFilingTrend[];
  isLoading: boolean;
}

// Color palette for different competitors
const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EF4444', // red
  '#06B6D4', // cyan
  '#F97316', // orange
  '#EC4899', // pink
];

export function FilingTimelineChart({ trends, isLoading }: FilingTimelineChartProps) {
  // Group data by month and competitor
  const chartData = useMemo(() => {
    if (!trends || !Array.isArray(trends) || trends.length === 0) return [];

    // Get unique months and competitors
    const monthsSet = new Set(trends.map(t => t.month));
    const competitorsSet = new Set(trends.map(t => t.competitorCode));
    
    // Sort months chronologically (YYYY-MM format sorts correctly as strings)
    const months = Array.from(monthsSet).sort((a, b) => a.localeCompare(b));
    const competitors = Array.from(competitorsSet);

    // Build chart data
    return months.map(month => {
      const dataPoint: any = { month };
      
      competitors.forEach(comp => {
        const trend = trends.find(t => t.month === month && t.competitorCode === comp);
        dataPoint[comp] = trend?.filingCount || 0;
      });
      
      return dataPoint;
    });
  }, [trends]);

  // Get unique competitors for lines
  const competitors = useMemo(() => {
    if (!trends || !Array.isArray(trends) || trends.length === 0) return [];
    const uniqueComps = Array.from(
      new Map(trends.map(t => [t.competitorCode, { code: t.competitorCode, displayName: t.competitorName }]))
    .values());
    return uniqueComps;
  }, [trends]);

  const [hiddenCompetitors, setHiddenCompetitors] = useState<Set<string>>(new Set());

  const toggleCompetitor = (code: string) => {
    const newHidden = new Set(hiddenCompetitors);
    if (newHidden.has(code)) {
      newHidden.delete(code);
    } else {
      newHidden.add(code);
    }
    setHiddenCompetitors(newHidden);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Filing Activity Timeline</h2>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading filing trends...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Filing Activity Timeline</h2>
        </div>
        <div className="h-96 flex items-center justify-center">
          <p className="text-slate-500">No filing data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Filing Activity Timeline</h2>
        </div>
        <div className="text-sm text-slate-600">
          Based on stored competitor filing data from PatentsView
        </div>
      </div>

      {/* Legend with toggles */}
      <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-slate-200">
        {competitors.map((comp, index) => {
          const color = COLORS[index % COLORS.length];
          const isHidden = hiddenCompetitors.has(comp.code);
          
          return (
            <button
              key={comp.code}
              onClick={() => toggleCompetitor(comp.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                isHidden 
                  ? 'border-slate-200 bg-slate-50 opacity-50' 
                  : 'border-slate-300 bg-white hover:shadow-md'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: isHidden ? '#94A3B8' : color }}
              ></div>
              <span className="text-sm font-medium text-slate-700">
                {comp.displayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="month" 
            stroke="#64748B"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#64748B"
            style={{ fontSize: '12px' }}
            label={{ value: 'Number of Filings', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {competitors.map((comp, index) => (
            <Line
              key={comp.code}
              type="monotone"
              dataKey={comp.code}
              name={comp.displayName}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              hide={hiddenCompetitors.has(comp.code)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-slate-500 text-center">
        Click on competitor names to show/hide their trend lines
      </div>
    </div>
  );
}
