import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { AssigneeTrendData } from '../../types/trends';

interface AssigneeTrendChartProps {
  data: AssigneeTrendData[];
  title?: string;
  maxItems?: number;
}

export const AssigneeTrendChart: React.FC<AssigneeTrendChartProps> = ({
  data,
  title = 'Top Patent Assignees',
  maxItems = 10,
}: AssigneeTrendChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No assignee trend data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data]
    .toSorted((a, b) => b.patentCount - a.patentCount)
    .slice(0, maxItems);

  const maxCount = Math.max(...sortedData.map((d: AssigneeTrendData) => d.patentCount)) * 1.1;
  const totalPatents = sortedData.reduce((sum: number, d: AssigneeTrendData) => sum + d.patentCount, 0);

  // Calculate cumulative market share
  let cumulativeShare = 0;
  const assigneesWithShare = sortedData.map((assignee) => {
    const share = (assignee.patentCount / totalPatents) * 100;
    cumulativeShare += share;
    return { ...assignee, share, cumulativeShare };
  });

  return (
    <Card className="w-full bg-slate-900 dark:bg-slate-900 border-border">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
        <CardDescription className="text-secondary">Leading companies by patent portfolio size</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assigneesWithShare.map((assignee, idx) => {
            const barWidth = (assignee.patentCount / maxCount) * 100;
            const rank = idx + 1;

            return (
              <div key={assignee.assigneeId} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-bold text-sm text-secondary min-w-6 text-center">
                      #{rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {assignee.assigneeName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-semibold text-right whitespace-nowrap text-foreground">
                      {assignee.patentCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-secondary min-w-14 text-right">
                      {assignee.share.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${barWidth}%`, backgroundColor: 'var(--primary)' }}
                      title={`${assignee.patentCount} patents (${assignee.share.toFixed(1)}%)`}
                    />
                  </div>
                  <div className="w-20 bg-muted rounded-full h-2 overflow-hidden" title="Cumulative share">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${Math.min(assignee.cumulativeShare, 100)}%`, backgroundColor: 'var(--chart-4)' }}
                    />
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-secondary pl-9">
                  <span>Individual: {assignee.share.toFixed(1)}%</span>
                  <span>Cumulative: {assignee.cumulativeShare.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}

          {/* Market Concentration Analysis */}
          <div className="pt-4 border-t border-border space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Market Concentration</h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Top 1</p>
                <p className="text-lg font-semibold text-foreground">
                  {assigneesWithShare[0]?.share.toFixed(1)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Top 3</p>
                <p className="text-lg font-semibold text-foreground">
                  {assigneesWithShare.slice(0, 3).reduce((sum: number, a: any) => sum + a.share, 0).toFixed(1)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Top 5</p>
                <p className="text-lg font-semibold text-foreground">
                  {assigneesWithShare.slice(0, 5).reduce((sum: number, a: any) => sum + a.share, 0).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Concentration level indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Market Concentration Index:</span>
                <span className="font-semibold text-foreground">
                  {assigneesWithShare[0]?.share > 25
                    ? '🔴 High (>25%)'
                    : assigneesWithShare[0]?.share > 15
                      ? '🟡 Medium (15-25%)'
                      : '🟢 Low (<15%)'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {assigneesWithShare[0]?.share > 25
                  ? 'Market shows significant concentration with dominant player'
                  : assigneesWithShare[0]?.share > 15
                    ? 'Moderate concentration with clear leaders'
                    : 'Distributed innovation across multiple players'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
