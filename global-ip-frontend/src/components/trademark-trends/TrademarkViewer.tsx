import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { getClassName } from '../../utils/classMapping';
import { CodeDistributionDto, SimpleCountDto } from '../../types/trademark-trends';
import { StatusDistributionTable } from './DataTable';

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
      <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg -m-4 p-4 mb-4">
          <CardTitle className="text-white font-bold">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-white hover:bg-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-100 border-red-400">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-700 font-medium">
              {error.message || 'Failed to load trademark data'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg -m-4 p-4 mb-4">
          <CardTitle className="text-white font-bold">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-white hover:bg-blue-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-slate-600 font-medium">Loading {title}...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg -m-4 p-4 mb-4">
          <CardTitle className="text-white font-bold">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-white hover:bg-amber-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-700 font-medium">No data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-white to-blue-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg -m-4 p-4 mb-4">
        <div>
          <CardTitle className="text-white font-bold text-lg">{title}</CardTitle>
          <CardDescription className="text-blue-100">Detailed trademark analysis</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-white hover:bg-blue-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {cardId === 'summary' && <SummaryView data={data} />}
        {cardId === 'top-classes' && <TopClassesView data={data} />}
        {cardId === 'top-countries' && <TopCountriesView data={data} />}
        {cardId === 'status-distribution' && (
          <div className="py-4">
            <StatusDistributionTable data={Array.isArray(data) ? data : []} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SummaryView: React.FC<{ data: any }> = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return <div className="text-slate-300 font-medium">📊 No summary data available</div>;
  }

  // Separate filingsByYear from other data
  const filingsByYear = data.filingsByYear;
  const otherData = Object.entries(data).filter(
    ([key]) => key !== 'filingsByYear' && key !== 'statusDistribution'
  );

  // Find max count for scaling the chart and total for percentages
  let maxYearCount = 0;
  let totalFilings = 0;
  if (Array.isArray(filingsByYear)) {
    maxYearCount = Math.max(...filingsByYear.map((item: any) => item.count || 0));
    totalFilings = filingsByYear.reduce((s: number, i: any) => s + (Number(i.count || 0)), 0);
  }

  return (
    <div className="space-y-8">
      {/* Summary Metrics Grid */}
      {otherData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherData.map(([key, value]) => (
            <div key={key} className="p-5 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow text-white">
              <p className="text-sm font-semibold text-slate-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="text-3xl font-bold text-white mt-2">
                {typeof value === 'number' ? value.toLocaleString() : String(value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filings By Year Chart - styled like Top Classes/Countries */}
      {Array.isArray(filingsByYear) && filingsByYear.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📈</span>Filings By Year
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filingsByYear.map((item: any) => {
              const count = Number(item.count || 0);
              const percentOfTotal = totalFilings > 0 ? (count / totalFilings) * 100 : 0;
              const barWidth = maxYearCount > 0 ? (count / maxYearCount) * 100 : 0;

              return (
                <div key={`year-${item.year}`} className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white">{item.year}</p>
                      <p className="text-sm text-slate-200 mt-1">Filings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{count.toLocaleString()}</p>
                      <p className="text-sm text-slate-200 font-medium">{percentOfTotal.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3 mt-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300 shadow-md"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const TopClassesView: React.FC<{ data: CodeDistributionDto[] }> = ({ data }) => {
  // Handle different data formats
  let classData: any[] = [];
  
  if (Array.isArray(data)) {
    classData = data;
  } else if (data && typeof data === 'object') {
    classData = [data];
  }

  if (!Array.isArray(classData) || classData.length === 0) {
    return <div className="text-slate-600 font-medium">📋 No class data available</div>;
  }

  // Filter out zero/empty counts and normalize
  const normalizedData = classData
    .filter((item) => item && typeof item === 'object' && (item.code || item.class || item.label || item.name) && Number(item.count || item.value || 0) > 0)
    .map((item) => ({
      code: (item.code || item.class || item.label || item.name || 'Unknown') as string,
      count: Number(item.count || item.value || 0),
      percentage: Number(item.percentage || 0),
    }));

  if (normalizedData.length === 0) {
    return <div className="text-slate-600 font-medium">📋 No valid class data available</div>;
  }

  const maxCount = Math.max(...normalizedData.map((d) => d.count || 0)) * 1.1;

  return (
    <div className="space-y-5">
      <div className="text-sm text-slate-600 font-medium mb-4">Showing {normalizedData.length} top trademark classes</div>
      {normalizedData.map((item) => {
        const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        const className = getClassName(item.code);

        return (
          <div key={item.code} className="space-y-2 p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow text-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-white">Class {item.code}</p>
                <p className="text-sm text-slate-200 mt-1">{className}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{item.count.toLocaleString()}</p>
                <p className="text-sm text-slate-200 font-medium">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-300 shadow-md"
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
  // Handle different data formats
  let countryData: any[] = [];
  
  if (Array.isArray(data)) {
    countryData = data;
  } else if (data && typeof data === 'object') {
    countryData = [data];
  }

  if (!Array.isArray(countryData) || countryData.length === 0) {
    return <div className="text-slate-600 font-medium">🌍 No country data available</div>;
  }

  // Accept country codes as valid labels, filter out zero/empty counts
  const normalizedData = countryData
    .filter((item) => item && typeof item === 'object' && (typeof item.label === 'string' || typeof item.name === 'string') && Number(item.count || item.value || 0) > 0)
    .map((item) => ({
      label: (item.label || item.name || 'Unknown') as string,
      count: Number(item.count || item.value || 0),
    }));

  if (normalizedData.length === 0) {
    return <div className="text-slate-600 font-medium">🌍 No valid country data available</div>;
  }

  const maxCount = Math.max(...normalizedData.map((d) => d.count || 0)) * 1.1;

  return (
    <div className="space-y-5">
      <div className="text-sm text-slate-600 font-medium mb-4">Showing {normalizedData.length} top countries</div>
      {normalizedData.map((item) => {
        const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

        return (
          <div key={item.label} className="space-y-2 p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow text-white">
            <div className="flex justify-between items-center">
              <p className="font-bold text-white">🏛️ {item.label}</p>
              <p className="font-bold text-white bg-slate-700 px-3 py-1 rounded-full">{item.count.toLocaleString()}</p>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-300 shadow-md"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrademarkViewer;
