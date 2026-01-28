import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { FilingTrendChart } from './FilingTrendChart';
import { TechnologyTrendChart } from './TechnologyTrendChart';
import { CountryTrendMap } from './CountryTrendMap';
import { AssigneeTrendChart } from './AssigneeTrendChart';
import { CitationAnalyticsChart } from './CitationAnalyticsChart';
import { getTransformedData } from '../../utils/trendDataTransformers';

interface TrendViewerProps {
  trendId: string;
  title: string;
  data: any;
  loading: boolean;
  error: Error | null;
  onClose: () => void;
}

const TrendChartMap: Record<string, React.ComponentType<any>> = {
  'filing-trends': FilingTrendChart,
  'grant-trends': FilingTrendChart,
  'top-technologies': TechnologyTrendChart,
  'top-assignees': AssigneeTrendChart,
  'country-distribution': CountryTrendMap,
  'top-cited-patents': CitationAnalyticsChart,
  'top-citing-patents': CitationAnalyticsChart,
  'patent-types': FilingTrendChart,
  'claim-complexity': FilingTrendChart,
  'time-to-grant': FilingTrendChart,
  'technology-evolution': TechnologyTrendChart,
};

export const TrendViewer: React.FC<TrendViewerProps> = ({
  trendId,
  title,
  data,
  loading,
  error,
  onClose,
}) => {
  const ChartComponent = TrendChartMap[trendId];

  if (error) {
    return (
      <Card className="border-destructive bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-primary">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Alert className="bg-accent border-muted">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-secondary">
              {error.message || 'Failed to load trend data'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-primary">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-secondary">Loading {title}...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Transform data based on trend type
  const transformedData = getTransformedData(trendId, data);
  console.log(`[TrendViewer] trendId: ${trendId}, data:`, data);
  console.log(`[TrendViewer] transformedData:`, transformedData);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-primary">{title}</CardTitle>
          <CardDescription className="text-secondary">Detailed trend analysis</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {ChartComponent ? (() => {
          if (trendId === 'top-cited-patents') {
            console.log('[TrendViewer] Rendering top-cited-patents with data:', transformedData);
            return <ChartComponent topCited={transformedData.topCited || []} title={title} />;
          }
          if (trendId === 'top-citing-patents') {
            console.log('[TrendViewer] Rendering top-citing-patents with data:', transformedData);
            return <ChartComponent topCiting={transformedData.topCiting || []} title={title} />;
          }
          return <ChartComponent data={transformedData} />;
        })() : (
          <div className="py-8 text-center text-secondary">
            Chart component not found for this trend
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendViewer;
