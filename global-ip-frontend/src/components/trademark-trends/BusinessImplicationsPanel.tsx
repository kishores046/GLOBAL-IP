import React, { FC, ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { BusinessImplication } from '../../types/trademark-trends';

interface BusinessImplicationsPanelProps {
  implications: BusinessImplication[];
  loading?: boolean;
  error?: Error | null;
}

export const BusinessImplicationsPanel: React.FC<BusinessImplicationsPanelProps> = ({
  implications,
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Error Loading Implications</CardTitle>
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
          <CardTitle>Business Implications</CardTitle>
          <CardDescription>Generating recommendations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!implications || implications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Implications</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No implications available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Market Saturation': 'bg-red-50 border-l-red-500',
      'Geographic Focus': 'bg-blue-50 border-l-blue-500',
      'Brand Lifecycle': 'bg-green-50 border-l-green-500',
      'Competitive Intelligence': 'bg-purple-50 border-l-purple-500',
    };
    return colors[category] || 'bg-gray-50 border-l-gray-500';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'Market Saturation': 'bg-red-100 text-red-800',
      'Geographic Focus': 'bg-blue-100 text-blue-800',
      'Brand Lifecycle': 'bg-green-100 text-green-800',
      'Competitive Intelligence': 'bg-purple-100 text-purple-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business & Brand Implications</CardTitle>
        <CardDescription>Strategic insights and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {implications.map((implication) => (
            <div
              key={`${implication.category}-${implication.insight.substring(0, 10)}`}
              className={`border-l-4 p-4 rounded-lg ${getCategoryColor(implication.category)}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-sm text-gray-900">{implication.category}</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${getCategoryBadgeColor(implication.category)}`}>
                  {implication.category}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {implication.insight}
              </p>

              {implication.recommendation && (
                <div className="bg-white bg-opacity-50 p-3 rounded border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Recommendation:</p>
                  <p className="text-sm text-gray-700">{implication.recommendation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessImplicationsPanel;
