import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { CountryTrendData } from '../../types/trends';

interface CountryTrendMapProps {
  data: CountryTrendData[];
  title?: string;
  maxItems?: number;
}

export const CountryTrendMap: React.FC<CountryTrendMapProps> = ({
  data,
  title = 'Geographic Innovation Distribution',
  maxItems = 15,
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
            <AlertDescription>No geographic trend data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data]
    .toSorted((a, b) => b.patentCount - a.patentCount)
    .slice(0, maxItems);

  const maxCount = Math.max(...sortedData.map((d: CountryTrendData) => d.patentCount)) * 1.1;
  const totalPatents = sortedData.reduce((sum: number, d: CountryTrendData) => sum + d.patentCount, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Patent activity concentration by country</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((country, idx) => {
            const barWidth = (country.patentCount / maxCount) * 100;
            const percentage = ((country.patentCount / totalPatents) * 100).toFixed(1);
            const rank = idx + 1;

            return (
              <div key={country.countryCode} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-bold text-sm text-gray-600 min-w-6 text-center">
                      #{rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-blue-600 min-w-12">
                          {country.countryCode}
                        </span>
                        <span className="text-sm font-medium truncate">
                          {country.countryName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-semibold text-right whitespace-nowrap">
                      {country.patentCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-gray-500 min-w-10 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                    title={`${country.patentCount} patents (${percentage}%)`}
                  />
                </div>

                {/* Filing vs Grant comparison */}
                <div className="flex gap-4 text-xs text-gray-500 pl-9">
                  <span>Filings: {country.filingCount}</span>
                  <span>Grants: {country.grantCount}</span>
                </div>
              </div>
            );
          })}

          {/* Summary Stats */}
          <div className="pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Total Countries</p>
              <p className="text-lg font-semibold">{data.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Total Patents</p>
              <p className="text-lg font-semibold">{totalPatents.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Top Country</p>
              <p className="text-lg font-semibold">{sortedData[0]?.countryName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Concentration (Top 3)</p>
              <p className="text-lg font-semibold">
                {((sortedData.slice(0, 3).reduce((sum: number, c: CountryTrendData) => sum + c.patentCount, 0) / totalPatents) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
