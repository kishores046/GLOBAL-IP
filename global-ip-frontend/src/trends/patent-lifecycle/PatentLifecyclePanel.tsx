import React, { useEffect, useState } from 'react';
import { fetchPatentLifecycle } from '../../api/lifecycleApi';
import { ApplicationLifecycleDto, PatentLifecycleStatus, LifecycleStep } from '../../types/lifecycle';
import LifecycleTimeline from './PatentLifecycleTimeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Loader } from 'lucide-react';

interface PatentLifecyclePanelProps {
  publicationNumber: string;
}

/**
 * Patent Lifecycle Panel Component
 * Displays patent lifecycle status and timeline
 */
export const PatentLifecyclePanel: React.FC<PatentLifecyclePanelProps> = ({
  publicationNumber,
}) => {
  const [data, setData] = useState<ApplicationLifecycleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLifecycle = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchPatentLifecycle(publicationNumber);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load patent lifecycle'));
      } finally {
        setLoading(false);
      }
    };

    if (publicationNumber) {
      loadLifecycle();
    }
  }, [publicationNumber]);

  /**
   * Build timeline steps based on patent lifecycle
   */
  const buildSteps = (lifecycle: ApplicationLifecycleDto): LifecycleStep[] => {
    const steps: LifecycleStep[] = [];
    const status = lifecycle.status.toUpperCase() as PatentLifecycleStatus;

    // Step 1: FILED
    steps.push({
      key: 'filed',
      label: 'Filed',
      date: lifecycle.filingDate,
      isCompleted: ['PENDING', 'GRANTED', 'EXPIRED', 'WITHDRAWN'].includes(status),
      isCurrent: status === 'PENDING' && !lifecycle.grantDate,
      description: 'Patent application filed',
    });

    // Step 2: PENDING
    if (lifecycle.filingDate) {
      steps.push({
        key: 'pending',
        label: 'Pending',
        date: null,
        isCompleted: ['GRANTED', 'EXPIRED', 'WITHDRAWN'].includes(status),
        isCurrent: status === 'PENDING',
        description: 'Under examination',
      });
    }

    // Step 3: GRANTED
    if (lifecycle.grantDate) {
      steps.push({
        key: 'granted',
        label: 'Granted',
        date: lifecycle.grantDate,
        isCompleted: ['EXPIRED'].includes(status) || status === 'GRANTED',
        isCurrent: status === 'GRANTED',
        description: 'Patent granted and issued',
      });
    }

    // Step 4: EXPIRED / WITHDRAWN
    if (lifecycle.expirationDate || status === 'WITHDRAWN') {
      const finalStep = status === 'WITHDRAWN' ? 'Withdrawn' : 'Expired';
      const finalDate = status === 'WITHDRAWN' ? null : lifecycle.expirationDate;

      steps.push({
        key: 'final',
        label: finalStep,
        date: finalDate,
        isCompleted: true,
        isCurrent: status === 'EXPIRED' || status === 'WITHDRAWN',
        description: status === 'WITHDRAWN' ? 'Patent application withdrawn' : 'Patent expired',
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
          <CardTitle>Patent Lifecycle</CardTitle>
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
          <CardTitle>Patent Lifecycle</CardTitle>
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
        <CardTitle>Patent Lifecycle</CardTitle>
        <CardDescription>Publication Number: {data.publicationNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timeline */}
        <LifecycleTimeline steps={steps} currentStatus={data.status} />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{data.status}</p>
          </div>

          {data.filingDate && (
            <div>
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

          {data.grantDate && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Grant Date</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {new Date(data.grantDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          {data.expirationDate && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Expiration Date</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {new Date(data.expirationDate).toLocaleDateString('en-US', {
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

export default PatentLifecyclePanel;
