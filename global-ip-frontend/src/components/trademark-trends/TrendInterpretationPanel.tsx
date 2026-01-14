import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { TrendInterpretation } from '../../types/trademark-trends';

interface TrendInterpretationPanelProps {
  interpretation: TrendInterpretation | null;
  loading?: boolean;
  error?: Error | null;
}

export const TrendInterpretationPanel: React.FC<TrendInterpretationPanelProps> = ({
  interpretation,
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Error Loading Trends</CardTitle>
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
          <CardTitle>Trend Interpretation</CardTitle>
          <CardDescription>Analyzing patterns...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!interpretation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No trend data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Interpretation</CardTitle>
        <CardDescription>Analysis of growth, concentration, and stability patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Growth Analysis */}
          <div className="border-l-4 border-l-blue-500 pl-4">
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Growth Analysis</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {interpretation.growthAnalysis}
            </p>
          </div>

          {/* Concentration Analysis */}
          <div className="border-l-4 border-l-purple-500 pl-4">
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Concentration Analysis</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {interpretation.concentrationAnalysis}
            </p>
          </div>

          {/* Stability Analysis */}
          <div className="border-l-4 border-l-green-500 pl-4">
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Stability Analysis</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {interpretation.stabilityAnalysis}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendInterpretationPanel;
