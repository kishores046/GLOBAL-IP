import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { TechnologyEvolutionData } from '../../types/trends';

interface TechnologyTrendChartProps {
  data: TechnologyEvolutionData[];
  title?: string;
  maxItems?: number;
}

export const TechnologyTrendChart: React.FC<TechnologyTrendChartProps> = ({
  data,
  title = 'Technology Domain Evolution',
  maxItems = 10,
}) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No technology trend data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => b.totalCount - a.totalCount).slice(0, maxItems);
  const maxCount = Math.max(...sortedData.map(d => d.totalCount)) * 1.1;

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'rising':
        return 'bg-green-500';
      case 'declining':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'rising') return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (trend === 'declining') return <ArrowDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Patent distribution across technology domains (CPC groups)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((tech) => {
            const barWidth = (tech.totalCount / maxCount) * 100;

            return (
              <div key={tech.cpcGroup} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-blue-600 min-w-12">
                        {tech.cpcGroup}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {tech.cpcDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {getTrendIcon(tech.trend)}
                    <span className="text-sm font-semibold min-w-16 text-right">
                      {tech.totalCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`${getTrendColor(tech.trend)} rounded h-6 transition-all duration-300`}
                    style={{ width: `${barWidth}%` }}
                    title={`${tech.totalCount} patents in ${tech.cpcGroup}`}
                  />
                  <span className={`text-xs font-medium min-w-14 ${
                    tech.trend === 'rising' ? 'text-green-600' :
                    tech.trend === 'declining' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {tech.trend === 'rising' ? 'Rising' : tech.trend === 'declining' ? 'Declining' : 'Stable'}
                  </span>
                </div>

                {/* Mini sparkline - year distribution */}
                {tech.yearData && tech.yearData.length > 0 && (
                  <div className="flex gap-1 items-end h-6 mt-2">
                    {tech.yearData.slice(-5).map((yd, idx) => {
                      const maxYearCount = Math.max(...tech.yearData.map(y => y.count));
                      const height = (yd.count / maxYearCount) * 100;
                      return (
                        <div
                          key={idx}
                          className="flex-1 bg-blue-200 rounded-t opacity-60 hover:opacity-100 transition-opacity"
                          style={{ height: `${height}%`, minHeight: '2px' }}
                          title={`${yd.year}: ${yd.count}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Summary */}
          <div className="pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Total Technologies</p>
              <p className="text-lg font-semibold">{data.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Total Patents</p>
              <p className="text-lg font-semibold">
                {data.reduce((sum, d) => sum + d.totalCount, 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Rising Tech</p>
              <p className="text-lg font-semibold text-green-600">
                {data.filter(d => d.trend === 'rising').length}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Declining Tech</p>
              <p className="text-lg font-semibold text-red-600">
                {data.filter(d => d.trend === 'declining').length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
