import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { getClassName } from '../../utils/classMapping';
import { CodeDistributionDto, SimpleCountDto } from '../../types/trademark-trends';

interface TrademarkViewerProps {
  cardId: string;
  title: string;
  data: any;
  loading: boolean;
  error: Error | null;
  onClose: () => void;
}

export const TrademarkViewer: React.FC<TrademarkViewerProps> = ({
  cardId,
  title,
  data,
  loading,
  error,
  onClose,
}) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-red-900">{title}</CardTitle>
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
          <Alert className="bg-red-100 border-red-300">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error.message || 'Failed to load trademark data'}
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading {title}...</span>
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Detailed trademark analysis</CardDescription>
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
        {cardId === 'summary' && <SummaryView data={data} />}
        {cardId === 'top-classes' && <TopClassesView data={data} />}
        {cardId === 'top-countries' && <TopCountriesView data={data} />}
        {cardId === 'status-distribution' && <StatusDistributionView data={data} />}
      </CardContent>
    </Card>
  );
};

const SummaryView: React.FC<{ data: any }> = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No summary data</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopClassesView: React.FC<{ data: CodeDistributionDto[] }> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-600">No class data</div>;
  }

  const maxCount = Math.max(...data.map((d) => d.count)) * 1.1;

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const barWidth = (item.count / maxCount) * 100;
        const className = getClassName(item.code);

        return (
          <div key={item.code} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.code}</p>
                <p className="text-sm text-gray-600">{className}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.count.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TopCountriesView: React.FC<{ data: SimpleCountDto[] }> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-600">No country data</div>;
  }

  const maxCount = Math.max(...data.map((d) => d.count)) * 1.1;

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const barWidth = (item.count / maxCount) * 100;

        return (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">{item.label}</p>
              <p className="font-semibold text-gray-900">{item.count.toLocaleString()}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StatusDistributionView: React.FC<{ data: SimpleCountDto[] }> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-600">No status data</div>;
  }

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  const getStatusColor = (label: string): string => {
    if (label === 'LIVE') return 'bg-green-500';
    if (label === 'DEAD') return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = (item.count / totalCount) * 100;
        const statusColor = getStatusColor(item.label);

        return (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">{item.label}</p>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.count.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${statusColor} h-3 rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrademarkViewer;
