import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, MapPin } from 'lucide-react';
import { VisualizationRecommendation } from '../../types/trademark-trends';

interface VisualizationRecommendationsPanelProps {
  recommendations: VisualizationRecommendation[];
  loading?: boolean;
  error?: Error | null;
}

export const VisualizationRecommendationsPanel: React.FC<VisualizationRecommendationsPanelProps> = ({
  recommendations,
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Error Loading Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-100 border-red-300">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visualization Recommendations</CardTitle>
          <CardDescription>Generating visualization suggestions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visualization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No visualization recommendations available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line':
        return <LineChartIcon className="h-5 w-5 text-blue-600" />;
      case 'bar':
        return <BarChart3 className="h-5 w-5 text-purple-600" />;
      case 'pie':
        return <PieChartIcon className="h-5 w-5 text-green-600" />;
      case 'map':
        return <MapPin className="h-5 w-5 text-red-600" />;
      case 'heatmap':
        return <BarChart3 className="h-5 w-5 text-orange-600" />;
      default:
        return <BarChart3 className="h-5 w-5 text-gray-600" />;
    }
  };

  const getChartTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      line: 'Line Chart',
      bar: 'Bar Chart',
      pie: 'Pie Chart',
      map: 'Geographic Map',
      heatmap: 'Heatmap',
    };
    return labels[type] || type;
  };

  const getDataSourceDescription = (source: string) => {
    const descriptions: Record<string, string> = {
      summary: 'Filing & Grant Trends',
      classes: 'International Classification Data',
      countries: 'Geographic Distribution',
      status: 'Trademark Status Distribution',
    };
    return descriptions[source] || source;
  };

  const getChartTypeColor = (type: string) => {
    switch (type) {
      case 'line':
        return 'bg-blue-50 border-l-blue-500';
      case 'bar':
        return 'bg-purple-50 border-l-purple-500';
      case 'pie':
        return 'bg-green-50 border-l-green-500';
      case 'map':
        return 'bg-red-50 border-l-red-500';
      case 'heatmap':
        return 'bg-orange-50 border-l-orange-500';
      default:
        return 'bg-gray-50 border-l-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualization Recommendations</CardTitle>
        <CardDescription>Suggested charts and visualizations for data presentation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={`${rec.type}-${rec.dataSource}-${rec.title}`} className={`border-l-4 p-4 rounded-lg ${getChartTypeColor(rec.type)}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">{getChartIcon(rec.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">{rec.title}</h4>
                    <span className="text-xs font-medium bg-white bg-opacity-70 px-2 py-1 rounded whitespace-nowrap">
                      {getChartTypeLabel(rec.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="text-xs text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded inline-block">
                    Data source: {getDataSourceDescription(rec.dataSource)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Frontend Guidance:</strong> These visualization recommendations are optimized for analyst review.
            Implement interactive versions to allow stakeholders to explore trends, drill down into data segments,
            and generate custom reports for presentations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationRecommendationsPanel;
