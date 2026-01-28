import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Award } from 'lucide-react';
import { CitedPatentData } from '../../types/trends';

interface CitationAnalyticsChartProps {
  topCited?: CitedPatentData[];
  topCiting?: CitedPatentData[];
  title?: string;
  maxItems?: number;
}

export const CitationAnalyticsChart: React.FC<CitationAnalyticsChartProps> = ({
  topCited = [],
  topCiting = [],
  title = 'Citation Analytics',
  maxItems = 8,
}) => {
  console.log('[CitationAnalyticsChart] Props:', { topCited, topCiting, title });

  if ((!topCited || topCited.length === 0) && (!topCiting || topCiting.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No citation analytics data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const citedData = topCited.slice(0, maxItems);
  const citingData = topCiting.slice(0, maxItems);

  console.log('[CitationAnalyticsChart] Cited data:', citedData);
  console.log('[CitationAnalyticsChart] Citing data:', citingData);

  const hasCitedData = citedData.length > 0;
  const hasCitingData = citingData.length > 0;

  const maxCitations = Math.max(
    ...(citedData.map(p => p.citationCount) ?? [0]),
    ...(citingData.map(p => p.citationCount ?? 0) ?? [0])
  ) * 1.1;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Analysis of most influential and active patents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-6 ${hasCitedData && hasCitingData ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Most Cited Patents */}
          {hasCitedData && (
          <div className="space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-semibold text-primary">Foundational Patents (Most Cited)</h3>
                <p className="text-xs text-secondary mt-1">
                  Patents that represent core technologies other inventions build upon
                </p>
              </div>

            {citedData.length > 0 ? (
              <div className="space-y-3">
                {citedData.map((patent, idx) => {
                  const barWidth = (patent.citationCount / maxCitations) * 100;

                  return (
                    <div key={patent.patentId} className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-6 h-6 rounded-full bg-muted text-primary text-xs font-bold text-center flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate text-foreground">
                                {patent.patentId}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {patent.assignee}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary whitespace-nowrap">
                          {patent.citationCount}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 bg-muted rounded h-2 overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{ width: `${barWidth}%`, backgroundColor: 'var(--chart-2)' }}
                          />
                        </div>
                        {patent.claimComplexity && (
                          <div className="text-xs text-secondary">
                            Complexity: {patent.claimComplexity}
                          </div>
                        )}
                      </div>

                      {patent.technologicalField && (
                        <p className="text-xs text-primary">{patent.technologicalField}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No data available</AlertDescription>
              </Alert>
            )}
          </div>
          )}

          {/* Most Citing Patents */}
          {hasCitingData && (
          <div className="space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-semibold text-primary">Innovative Patents (Most Citing)</h3>
              <p className="text-xs text-secondary mt-1">
                Patents that actively reference others, indicating derivative innovation
              </p>
            </div>

            {citingData.length > 0 ? (
              <div className="space-y-3">
                {citingData.map((patent, idx) => {
                  const barWidth = ((patent.citationCount ?? 0) / maxCitations) * 100;

                  return (
                    <div key={patent.patentId} className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-6 h-6 rounded-full bg-muted text-primary text-xs font-bold text-center flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate text-foreground">
                                {patent.patentId}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {patent.assignee}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary whitespace-nowrap">
                          {patent.citationCount ?? 0}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 bg-muted rounded h-2 overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{ width: `${barWidth}%`, backgroundColor: 'var(--primary)' }}
                          />
                        </div>
                        {patent.claimComplexity && (
                          <div className="text-xs text-secondary">
                            Complexity: {patent.claimComplexity}
                          </div>
                        )}
                      </div>

                      {patent.technologicalField && (
                        <p className="text-xs text-primary">{patent.technologicalField}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No data available</AlertDescription>
              </Alert>
            )}
          </div>
          )}
        </div>

        {/* Summary Analysis */}
        {(hasCitedData || hasCitingData) && (
        <div className="pt-4 border-t border-border mt-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${hasCitedData && hasCitingData ? 4 : 2}, minmax(0, 1fr))` }}>
          {hasCitedData && (
            <>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Citations (Cited)</p>
                <p className="text-lg font-semibold text-foreground">
                  {(citedData.reduce((sum: number, p: CitedPatentData) => sum + p.citationCount, 0) / citedData.length).toFixed(0)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Most Cited</p>
                <p className="text-lg font-semibold text-foreground">{citedData[0]?.citationCount ?? 'N/A'}</p>
              </div>
            </>
          )}
          {hasCitingData && (
            <>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Citations (Citing)</p>
                <p className="text-lg font-semibold text-foreground">
                  {(citingData.reduce((sum: number, p: CitedPatentData) => sum + (p.citationCount ?? 0), 0) / citingData.length).toFixed(0)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Most Citing</p>
                <p className="text-lg font-semibold text-foreground">{citingData[0]?.citationCount ?? 'N/A'}</p>
              </div>
            </>
          )}
        </div>
        )}
      </CardContent>
    </Card>
  );
};
