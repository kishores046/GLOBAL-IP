import { MonthlyTrendsMap } from './types';

interface MonthlyTrendHeatmapProps {
  trends: MonthlyTrendsMap | null;
  isLoading: boolean;
}

export function MonthlyTrendHeatmap({ trends, isLoading }: MonthlyTrendHeatmapProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <div className="h-8 w-48 bg-slate-200 rounded mb-6 animate-pulse"></div>
        <div className="h-96 bg-slate-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!trends || Object.keys(trends).length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Filing Heatmap</h2>
        <div className="h-96 flex items-center justify-center text-slate-500">
          No monthly filing data available
        </div>
      </div>
    );
  }

  const competitorCodes = Object.keys(trends);
  const allMonths = new Set<string>();
  
  competitorCodes.forEach((code) => {
    Object.keys(trends[code]).forEach((month) => allMonths.add(month));
  });

  const sortedMonths = Array.from(allMonths).sort();

  const getMaxValue = (): number => {
    let max = 0;
    competitorCodes.forEach((code) => {
      Object.values(trends[code]).forEach((count) => {
        if (count > max) max = count;
      });
    });
    return max;
  };

  const maxValue = getMaxValue();

  const getColorIntensity = (value: number): string => {
    if (value === 0) return 'bg-slate-100';
    const intensity = Math.min(value / maxValue, 1);
    if (intensity < 0.2) return 'bg-blue-100';
    if (intensity < 0.4) return 'bg-blue-200';
    if (intensity < 0.6) return 'bg-blue-400';
    if (intensity < 0.8) return 'bg-blue-500';
    return 'bg-blue-600';
  };

  const getTextColor = (value: number): string => {
    if (value === 0) return 'text-slate-400';
    const intensity = value / maxValue;
    return intensity >= 0.6 ? 'text-white' : 'text-slate-900';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Filing Heatmap</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm font-semibold text-slate-700 sticky left-0 z-10">
                Competitor
              </th>
              {sortedMonths.map((month) => (
                <th
                  key={month}
                  className="border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold text-slate-700 min-w-[100px]"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competitorCodes.map((code) => (
              <tr key={code}>
                <td className="border border-slate-200 px-4 py-2 font-medium text-slate-900 bg-slate-50 sticky left-0 z-10">
                  {code}
                </td>
                {sortedMonths.map((month) => {
                  const value = trends[code][month] || 0;
                  return (
                    <td
                      key={month}
                      className={`border border-slate-200 px-4 py-2 text-center font-semibold ${getColorIntensity(
                        value
                      )} ${getTextColor(value)} transition-colors`}
                      title={`${code} - ${month}: ${value} filings`}
                    >
                      {value > 0 ? value : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <span>Scale:</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 bg-slate-100 border border-slate-300"></div>
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 bg-blue-100 border border-slate-300"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 bg-blue-200 border border-slate-300"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 bg-blue-400 border border-slate-300"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 bg-blue-500 border border-slate-300"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-4 bg-blue-600 border border-slate-300"></div>
          <span>Max</span>
        </div>
      </div>
    </div>
  );
}
