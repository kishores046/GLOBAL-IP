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
    <Card className="w-full bg-card border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-primary">{title}</CardTitle>
            <CardDescription className="text-secondary">Year-over-year filing and grant activity</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {filingTrend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={filingTrend === 'up' ? 'text-primary' : 'text-destructive'}>
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

              return (
                <div key={item.year} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">{item.year}</span>
                    <div className="text-xs">
                      <span className="text-primary font-semibold">{item.filingCount.toLocaleString()} filings</span>
                    </div>
                  </div>

                  <div className="flex gap-1 h-6">
                    {/* Filing Bar */}
                    <div
                      className="rounded h-full transition-all duration-300"
                      style={{ width: `${filingWidth}%`, backgroundColor: 'var(--primary)' }}
                      title={`${item.filingCount} filings`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-1">
              <p className="text-xs text-secondary">Total Filings</p>
              <p className="text-lg font-semibold text-foreground">
                {data.reduce((sum: number, d: FilingTrendData) => sum + d.filingCount, 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-secondary">Peak Year</p>
              <p className="text-lg font-semibold text-foreground">
                {data.reduce((max: FilingTrendData, d: FilingTrendData) => d.filingCount > max.filingCount ? d : max).year}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
