import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { FilingTrendData } from '../../types/trends';

interface FilingTrendChartProps {
  data: FilingTrendData[];
  title?: string;
  showGrants?: boolean;
}

export const FilingTrendChart: React.FC<FilingTrendChartProps> = ({
  data,
  title = 'Filing & Grant Trends',
  showGrants = true,
}: FilingTrendChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No filing trend data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d: FilingTrendData) => Math.max(d.filingCount, d.grantCount))) * 1.1;

  // Calculate trend direction
  const filingTrend = data[data.length - 1]?.filingCount > (data[data.length - 2]?.filingCount ?? 0) ? 'up' : 'down';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Year-over-year filing and grant activity</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {filingTrend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={filingTrend === 'up' ? 'text-green-600' : 'text-red-600'}>
              {filingTrend === 'up' ? 'Growing' : 'Declining'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Simple Bar Visualization */}
          <div className="space-y-2">
            {data.map((item: FilingTrendData) => {
              const filingWidth = (item.filingCount / maxCount) * 100;
              const grantWidth = (item.grantCount / maxCount) * 100;

              return (
                <div key={item.year} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{item.year}</span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-blue-600">{item.filingCount} filings</span>
                      {showGrants && <span className="text-green-600">{item.grantCount} grants</span>}
                    </div>
                  </div>

                  <div className="flex gap-1 h-6">
                    {/* Filing Bar */}
                    <div
                      className="bg-blue-500 rounded h-full transition-all duration-300"
                      style={{ width: `${filingWidth}%` }}
                      title={`${item.filingCount} filings`}
                    />

                    {/* Grant Bar */}
                    {showGrants && (
                      <div
                        className="bg-green-500 rounded h-full transition-all duration-300"
                        style={{ width: `${grantWidth}%` }}
                        title={`${item.grantCount} grants`}
                      />
                    )}
                  </div>

                  {/* Grant Rate */}
                  <div className="text-xs text-gray-500">
                    Grant Rate: {item.grantRate.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Total Filings</p>
              <p className="text-lg font-semibold">
                {data.reduce((sum: number, d: FilingTrendData) => sum + d.filingCount, 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Total Grants</p>
              <p className="text-lg font-semibold">
                {data.reduce((sum: number, d: FilingTrendData) => sum + d.grantCount, 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Avg Grant Rate</p>
              <p className="text-lg font-semibold">
                {(data.reduce((sum: number, d: FilingTrendData) => sum + d.grantRate, 0) / data.length).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Peak Year</p>
              <p className="text-lg font-semibold">
                {data.reduce((max: FilingTrendData, d: FilingTrendData) => d.filingCount > max.filingCount ? d : max).year}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
