import React, { useEffect, useState } from 'react';
import { fetchTrademarkLifecycle } from '../../api/lifecycleApi';
import { TrademarkLifecycleDto, LifecycleStep } from '../../types/lifecycle';
import TrademarkLifecycleTimeline from './TrademarkLifecycleTimeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Loader } from 'lucide-react';

interface TrademarkLifecyclePanelProps {
  trademarkId: string;
}

/**
 * Trademark Lifecycle Panel Component
 * Displays trademark lifecycle status, timeline, and USPTO status code
 */
export const TrademarkLifecyclePanel: React.FC<TrademarkLifecyclePanelProps> = ({
  trademarkId,
}) => {
  const [data, setData] = useState<TrademarkLifecycleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLifecycle = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchTrademarkLifecycle(trademarkId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load trademark lifecycle'));
      } finally {
        setLoading(false);
      }
    };

    if (trademarkId) {
      loadLifecycle();
    }
  }, [trademarkId]);

  /**
   * Build timeline steps based on trademark lifecycle
   * Progression: FILED → PUBLISHED → REGISTERED → CANCELLED
   */
  const buildSteps = (lifecycle: TrademarkLifecycleDto): LifecycleStep[] => {
    const steps: LifecycleStep[] = [];
    const status = lifecycle.status.toUpperCase();

    // Step 1: FILED
    steps.push({
      key: 'filed',
      label: 'Filed',
      date: lifecycle.filingDate,
      isCompleted: ['PUBLISHED', 'REGISTERED', 'CANCELLED'].includes(status),
      isCurrent: status === 'FILED',
      description: 'Trademark application filed',
    });

    // Step 2: PUBLISHED
    steps.push({
      key: 'published',
      label: 'Published',
      date: null,
      isCompleted: ['REGISTERED', 'CANCELLED'].includes(status),
      isCurrent: status === 'PUBLISHED',
      description: 'Published for opposition',
    });

    // Step 3: REGISTERED
    steps.push({
      key: 'registered',
      label: 'Registered',
      date: null,
      isCompleted: status === 'REGISTERED' || status === 'CANCELLED',
      isCurrent: status === 'REGISTERED',
      description: 'Trademark registered',
    });

    // Step 4: CANCELLED
    if (status === 'CANCELLED') {
      steps.push({
        key: 'cancelled',
        label: 'Cancelled',
        date: null,
        isCompleted: true,
        isCurrent: true,
        description: 'Trademark cancelled or abandoned',
      });
    }

    return steps;
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-100 border-red-300">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trademark Lifecycle</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader className="w-5 h-5 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trademark Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No lifecycle data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const steps = buildSteps(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trademark Lifecycle</CardTitle>
        <CardDescription>Trademark ID: {data.trademarkId}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timeline */}
        <TrademarkLifecycleTimeline steps={steps} currentStatus={data.status} />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{data.status}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">USPTO Status Code</p>
            <p className="text-sm font-semibold text-gray-900 mt-1 font-mono">
              {data.rawStatusCode}
            </p>
          </div>

          {data.filingDate && (
            <div className="col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Filing Date</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {new Date(data.filingDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrademarkLifecyclePanel;
