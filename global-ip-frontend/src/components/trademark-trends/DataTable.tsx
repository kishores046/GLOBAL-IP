import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { CodeDistributionDto, SimpleCountDto } from '../../types/trademark-trends';

interface DataTableProps {
  title: string;
  description?: string;
  columns: Array<{ key: string; label: string; format?: (value: any) => string }>;
  data: Array<Record<string, any>>;
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  description,
  columns,
  data,
  loading = false,
  error = null,
  onRefresh,
}) => {
  const [sortKey, setSortKey] = useState<string>(columns[0]?.key ?? '');
  const [sortDesc, setSortDesc] = useState(true);

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">{title}</CardTitle>
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
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
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

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc ? bVal - aVal : aVal - bVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortDesc ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortKey === col.key && (
                        <span className="text-gray-400">
                          {sortDesc ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => (
                <tr key={`${row[sortKey]}-${JSON.stringify(row)}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.format ? col.format(row[col.key]) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Showing {sortedData.length} items
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Top Classes Table
 */
export const TopClassesTable: React.FC<{
  data: CodeDistributionDto[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}> = ({ data, loading, error, onRefresh }) => {
  return (
    <DataTable
      title="Top Trademark Classes"
      description="International classification distribution showing business sector concentration"
      columns={[
        { key: 'code', label: 'Class Code' },
        {
          key: 'count',
          label: 'Filings',
          format: (val) => val.toLocaleString(),
        },
        {
          key: 'percentage',
          label: 'Market Share',
          format: (val) => `${val.toFixed(1)}%`,
        },
      ]}
      data={data}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
    />
  );
};

/**
 * Top Countries Table
 */
export const TopCountriesTable: React.FC<{
  data: SimpleCountDto[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}> = ({ data, loading, error, onRefresh }) => {
  return (
    <DataTable
      title="Top Countries by Trademark Filings"
      description="Geographic distribution showing market concentration"
      columns={[
        { key: 'label', label: 'Country' },
        {
          key: 'count',
          label: 'Filings',
          format: (val) => val.toLocaleString(),
        },
      ]}
      data={data}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
    />
  );
};

/**
 * Status Distribution Table
 */
export const StatusDistributionTable: React.FC<{
  data: SimpleCountDto[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}> = ({ data, loading, error, onRefresh }) => {
  const total = data?.reduce((sum, item) => sum + item.count, 0) ?? 0;

  const dataWithPercentage = data?.map((item) => ({
    ...item,
    percentage: ((item.count / total) * 100).toFixed(1),
  })) ?? [];

  return (
    <DataTable
      title="Trademark Status Distribution"
      description="Active vs inactive trademark portfolio health indicator"
      columns={[
        { key: 'label', label: 'Status' },
        {
          key: 'count',
          label: 'Count',
          format: (val) => val.toLocaleString(),
        },
        {
          key: 'percentage',
          label: 'Percentage',
          format: (val) => `${val}%`,
        },
      ]}
      data={dataWithPercentage}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
    />
  );
};

export default DataTable;
