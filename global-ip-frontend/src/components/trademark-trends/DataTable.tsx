import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { CodeDistributionDto, SimpleCountDto } from '../../types/trademark-trends';
// Status code to English mapping
const STATUS_CODE_MAP: Record<string | number, string> = {
  973: 'Registered',
  819: 'Pending Examination',
  809: 'Published',
  807: 'Opposed',
  802: 'Withdrawn',
  800: 'Application Filed',
  794: 'Expired',
  774: 'Abandoned',
  760: 'Refused',
  748: 'Accepted',
  734: 'Cancelled',
  733: 'Under Review',
  732: 'Awaiting Assignment',
  731: 'Awaiting Documents',
  730: 'Awaiting Payment',
  710: 'Suspended',
  709: 'Rejected',
  708: 'Deferred',
  707: 'Incomplete',
  706: 'Awaiting Response',
  705: 'Awaiting Approval',
  702: 'Under Appeal',
  701: 'Awaiting Publication',
  700: 'Live',
  688: 'Dead',
  686: 'Pending',
  681: 'Under Examination',
  680: 'Registered',
  666: 'Not in Use',
  665: 'Not Renewed',
  661: 'Awaiting Renewal',
  660: 'Lapsed',
  656: 'Surrendered',
  654: 'Awaiting Grant',
  653: 'Awaiting Certificate',
  651: 'Awaiting Dispatch',
  649: 'Awaiting Correction',
  647: 'Awaiting Clarification',
  645: 'Awaiting Hearing',
  643: 'Awaiting Action',
  641: 'Other',
  640: 'Awaiting Assignment',
  638: 'Awaiting Response',
  630: 'Pending',
  616: 'Awaiting Payment',
  612: 'Awaiting Documents',
  606: 'Awaiting Approval',
  605: 'Awaiting Publication',
  602: 'Awaiting Examination',
  601: 'Awaiting Filing',
};

interface Column {
  key: string;
  label: string;
  format?: (value: any) => string;
}

interface DataTableProps {
  title: string;
  description?: string;
  columns: Column[];
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
  const sortedData: Array<Record<string, any>> = [...data].sort((a, b) => {
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
export interface TopClassesTableProps {
  data: CodeDistributionDto[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

export interface TopCountriesTableProps {
  data: SimpleCountDto[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

interface StatusDistributionTableProps {
  data: SimpleCountDto[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

interface AggregatedItem {
  label: string;
  count: number;
}

interface PercentageItem {
  label: string;
  count: number;
  percentage: number;
}

export const StatusDistributionTable: React.FC<StatusDistributionTableProps> = ({ data, loading, error, onRefresh }) => {
  // Aggregate by label (some responses may include duplicate labels like "Unknown Status")
  // and support numeric status codes returned as labels.
  const aggregatedMap: Record<string, number> = {};

  (data ?? []).forEach((item: SimpleCountDto) => {
    const key: string = String(item.label || 'Unknown Status').trim();
    if (!aggregatedMap[key]) aggregatedMap[key] = 0;
    aggregatedMap[key] += item.count || 0;
  });

  const aggregated: AggregatedItem[] = Object.keys(aggregatedMap).map((key) => ({
    label: key,
    count: aggregatedMap[key],
  }));

  const total: number = aggregated.reduce((sum, item) => sum + item.count, 0) || 0;

    const dataWithPercentage: PercentageItem[] = aggregated.map((item) => {
      // If the label is actually a numeric status code, map it to a friendly label
      const numericCode = parseInt(item.label, 10);
      const friendlyLabel = !Number.isNaN(numericCode)
        ? (STATUS_CODE_MAP[numericCode] || item.label)
        : (STATUS_CODE_MAP[item.label] || item.label);

      return {
        label: friendlyLabel,
        count: item.count,
        // keep percentage as a number (to match PercentageItem) with one decimal place
        percentage: total > 0 ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0,
      };
    });

  // UI state for simple filtering options
  const [topN, setTopN] = useState<number | 'ALL'>('ALL');
  const [query, setQuery] = useState<string>('');
  const [hideUnknown, setHideUnknown] = useState<boolean>(false);

  // Apply text filter, hide-unknown, then sort by count desc and apply topN
  const processed: PercentageItem[] = dataWithPercentage
    .filter((item) => {
      // Filter by query text if provided
      if (query && !String(item.label).toLowerCase().includes(query.toLowerCase())) return false;
      // Optionally hide unknown statuses
      if (hideUnknown && String(item.label).toLowerCase().includes('unknown')) return false;
      return true;
    })
    .sort((a, b) => b.count - a.count);

  const finalData: PercentageItem[] = topN === 'ALL' ? processed : processed.slice(0, Number(topN));

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="status-top-select" className="text-sm font-medium">Top</label>
          <select
            id="status-top-select"
            value={topN}
            onChange={(e) => setTopN(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10) || 'ALL')}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          >
            <option value="ALL">All</option>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
          </select>
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Filter status labels..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={hideUnknown} onChange={(e) => setHideUnknown(e.target.checked)} />
          <span className="text-sm">Hide unknown statuses</span>
        </label>
      </div>

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
        data={finalData}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default DataTable;
