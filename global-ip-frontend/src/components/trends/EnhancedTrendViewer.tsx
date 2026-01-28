import React, { useMemo } from 'react';
import { AlertCircle, Download, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import {
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  DonutChartComponent,
  AreaChartComponent,
  MultiLineChartComponent,
  ENTERPRISE_COLORS,
} from '../charts/ChartComponents';

interface EnhancedTrendViewerProps {
  trendId: string;
  data: any;
  loading: boolean;
  error: Error | null;
  isDark?: boolean;
}

/**
 * Helper function to get relevant columns based on trend type
 */
const getRelevantColumns = (trendId: string, sampleData: any): string[] => {
  if (!sampleData) return [];

  const allKeys = Object.keys(sampleData);
  const excludeKeys = ['count', 'name', '$$hashKey']; // Generic keys to exclude

  // Map trend types to their specific display columns
  const columnMaps: { [key: string]: string[] } = {
    'filing-trends': ['year', 'filingCount'],
    'grant-trends': ['year', 'grantCount', 'grantRate'],
    'top-technologies': ['cpcGroup', 'cpcDescription', 'count'],
    'top-assignees': ['assigneeName', 'patentCount'],
    'top-cited-patents': ['patentId', 'citationCount'],
    'top-citing-patents': ['patentId', 'citationCount'],
    'country-distribution': ['countryName', 'patentCount'],
    'patent-types': ['type', 'count'],
    'patent-type-distribution': ['patentType', 'count'],
    'claim-complexity': ['year', 'avgClaims', 'medianClaims'],
    'time-to-grant': ['year', 'avgYearsToGrant'],
    'epo-family-trends': ['familySize', 'familyCount'],
    'technology-evolution': ['year', 'cpcDescription', 'totalCount'],
  };

  const columnsForTrend = columnMaps[trendId];
  if (columnsForTrend) {
    // Filter to only include columns that exist in the data
    const filtered = columnsForTrend.filter(col => allKeys.includes(col));
    // If we found matching columns, return them
    if (filtered.length > 0) {
      return filtered;
    }
  }

  // Fallback: return all keys except excluded ones
  return allKeys.filter(k => !excludeKeys.includes(k) && k.length > 0).slice(0, 6);
};

/**
 * Format data for Recharts compatibility
 */
// Helper functions to reduce cognitive complexity
const formatFilingTrendItem = (item: any) => ({
  year: item.year,
  name: String(item.year),
  filingCount: item.filings || item.filingCount,
  grantCount: item.grants || item.grantCount,
  grantRate: item.grantRate || 0,
  count: item.filings || item.filingCount || item.grantCount || 0,
  ...item,
});

const formatGenericArrayItem = (item: any, idx: number) => ({
  name: item.name || item.year || item.assigneeName || item.countryName || item.cpcDescription || `Item ${idx}`,
  count: item.count || item.filingCount || item.patentCount || item.value || 0,
  ...(item.grantCount && { grantCount: item.grantCount }),
  ...(item.grantRate && { grantRate: item.grantRate }),
  ...item,
});

const formatTrendSpecificData = (trendId: string, data: any): any[] | null => {
  const trendFormatters: { [key: string]: (d: any) => any } = {
    'top-technologies': (d) => ({
      cpcGroup: d.cpcGroup || d.cpcCode || 'Unknown',
      cpcDescription: d.cpcDescription || d.description || 'Unknown',
      count: d.count || 0,
      ...d,
    }),
    'top-assignees': (d) => ({
      assigneeName: d.assignee || d.assigneeName || d.name || 'Unknown',
      patentCount: d.patentCount || d.count || 0,
      ...d,
    }),
    'country-distribution': (d) => ({
      countryName: d.countryName || d.name || 'Unknown',
      patentCount: d.patentCount || d.count || 0,
      ...d,
    }),
    'patent-types': (d) => {
      const patentType = d.type || d.patentType || d.name || 'Unknown';
      return {
        type: patentType,
        name: patentType,
        count: d.count || 0,
        ...d,
      };
    },
    'patent-type-distribution': (d) => ({
      name: d.patentType || d.type || 'Unknown',
      patentType: d.patentType || d.type || 'Unknown',
      count: d.count || 0,
      type: d.patentType || d.type || 'Unknown',
      ...d,
    }),
    'technology-evolution': (d) => ({
      cpcDescription: d.cpcDescription || d.name || 'Unknown',
      totalCount: d.totalCount || d.count || 0,
      year: d.year || 'Unknown',
      ...d,
    }),
    'claim-complexity': (d) => ({
      year: Number(d.year) || 0,
      name: String(d.year),
      avgClaims: Number(d.avgClaims || 0),
      medianClaims: Number(d.medianClaims || 0),
      ...d,
    }),
    'epo-family-trends': (d) => ({
      familySize: Number(d.familySize) || 0,
      familyCount: Number(d.familyCount) || 0,
      name: `Family Size ${d.familySize}`,
      count: Number(d.familyCount) || 0,
      ...d,
    }),
  };

  const formatter = trendFormatters[trendId];
  if (!formatter) return null;

  if (trendId === 'top-technologies' && data.topTechnologies) {
    return data.topTechnologies.map(formatter);
  }
  if (trendId === 'top-assignees' && data.topAssignees) {
    return data.topAssignees.map(formatter);
  }
  if (trendId === 'top-assignees' && Array.isArray(data)) {
    // Handle direct array response for top-assignees
    return data.map(formatter);
  }
  if (trendId === 'country-distribution' && data.countries) {
    return data.countries.map(formatter);
  }
  if (trendId === 'country-distribution' && Array.isArray(data)) {
    // Handle direct array response from unified endpoint
    return data.map(formatter);
  }
  if (trendId === 'patent-types' && data.typeDistribution) {
    return data.typeDistribution.map(formatter);
  }
  if (trendId === 'technology-evolution' && data.evolutionData) {
    return data.evolutionData.map(formatter);
  }
  if ((trendId === 'patent-type-distribution' || trendId === 'claim-complexity') && Array.isArray(data)) {
    return data.map(formatter);
  }

  return null;
};

const formatChartData = (trendId: string, rawData: any): any[] => {
  if (!rawData) {
    console.warn(`[EnhancedTrendViewer] No rawData for ${trendId}`);
    return [];
  }

  console.log(`[EnhancedTrendViewer] formatChartData - trendId: ${trendId}, rawData keys:`, Object.keys(rawData));

  // Handle array data (most common)
  if (Array.isArray(rawData)) {
    console.log(`[EnhancedTrendViewer] rawData is array with ${rawData.length} items`);
    return rawData.map((item: any, idx: number) => {
      // For filing trends, ensure we map filingCount to the Y-axis
      if (trendId === 'filing-trends' || trendId === 'grant-trends') {
        return formatFilingTrendItem(item);
      }
      
      // For top-assignees, preserve assigneeName field
      if (trendId === 'top-assignees') {
        return {
          assigneeName: item.assignee || item.assigneeName || item.name || 'Unknown',
          patentCount: item.patentCount || item.count || 0,
          ...item,
        };
      }
      
      // For country distribution, preserve countryName field
      if (trendId === 'country-distribution') {
        return {
          countryName: item.countryName || item.country || item.name || 'Unknown',
          patentCount: item.patentCount || item.count || 0,
          ...item,
        };
      }
      
      return formatGenericArrayItem(item, idx);
    });
  }

  // Handle object responses
  if (typeof rawData === 'object') {
    console.log(`[EnhancedTrendViewer] rawData is object`);
    
    // Check for nested arrays in response envelope
    if (rawData.data && Array.isArray(rawData.data)) {
      console.log(`[EnhancedTrendViewer] Found rawData.data array with ${rawData.data.length} items`);
      return rawData.data.map((item: any, idx: number) => {
        if (trendId === 'filing-trends' || trendId === 'grant-trends') {
          return formatFilingTrendItem(item);
        }
        return {
          name: item.name || item.year || idx,
          count: item.count || item.filingCount || item.value || 0,
          ...item,
        };
      });
    }

    // Check for specific trend responses
    console.log(`[EnhancedTrendViewer] Checking formatTrendSpecificData for ${trendId}`);
    const formattedData = formatTrendSpecificData(trendId, rawData);
    if (formattedData) {
      console.log(`[EnhancedTrendViewer] formatTrendSpecificData returned ${formattedData.length} items`);
      return formattedData;
    }
    console.log(`[EnhancedTrendViewer] formatTrendSpecificData returned null`);

    // Handle patent citation data - top-cited and top-citing come as objects with {topCited, topCiting}
    if (trendId === 'top-cited-patents' && rawData.topCited && Array.isArray(rawData.topCited)) {
      console.log(`[EnhancedTrendViewer] Processing top-cited-patents data:`, rawData.topCited);
      return rawData.topCited.map((item: any) => {
        const mapped = {
          patentTitle: item.patentTitle || item.title || 'Unknown',
          patentId: item.patentId || 'Unknown',
          citationCount: Number(item.timesCited || item.citationCount || item.count || 0),
          ...item,
        };
        console.log(`[EnhancedTrendViewer] Mapped top-cited item:`, mapped);
        return mapped;
      });
    }

    if (trendId === 'top-citing-patents' && rawData.topCiting && Array.isArray(rawData.topCiting)) {
      console.log(`[EnhancedTrendViewer] Processing top-citing-patents data:`, rawData.topCiting);
      return rawData.topCiting.map((item: any) => {
        const mapped = {
          patentTitle: item.patentTitle || item.title || 'Unknown',
          patentId: item.patentId || 'Unknown',
          citationCount: Number(item.citationCount || item.count || 0),
          ...item,
        };
        console.log(`[EnhancedTrendViewer] Mapped top-citing item:`, mapped);
        return mapped;
      });
    }

    // Fallback for patent citation data if received as arrays directly
    if ((trendId === 'top-cited-patents' || trendId === 'top-citing-patents') && Array.isArray(rawData)) {
      console.log(`[EnhancedTrendViewer] Processing ${trendId} data as array:`, rawData);
      return rawData.map((item: any) => {
        const citationValue = trendId === 'top-cited-patents' 
          ? item.timesCited 
          : item.citationCount;
        
        const mapped = {
          patentTitle: item.patentTitle || item.title || 'Unknown',
          patentId: item.patentId || 'Unknown',
          citationCount: Number(citationValue || item.count || 0),
          ...item,
        };
        console.log(`[EnhancedTrendViewer] Mapped ${trendId} item:`, mapped);
        return mapped;
      });
    }

    if (trendId === 'time-to-grant') {
      let timeGrantData = rawData;
      // Check if it's wrapped in an object
      if (rawData.timeToGrant) {
        timeGrantData = rawData.timeToGrant;
      }
      if (Array.isArray(timeGrantData)) {
        return timeGrantData.map((item: any) => ({
          year: Number(item.year) || 0,
          name: String(item.year),
          avgYearsToGrant: Number(item.avgYearsToGrant || item.averageTimeToGrant || 0),
          ...item,
        }));
      }
    }

    if (trendId === 'epo-family-trends' && Array.isArray(rawData)) {
      return rawData.map((item: any) => ({
        familySize: Number(item.familySize) || 0,
        familyCount: Number(item.familyCount) || 0,
        name: `Family Size ${item.familySize}`,
        count: Number(item.familyCount) || 0,
        ...item,
      }));
    }
  }

  console.log(`[EnhancedTrendViewer] formatChartData returning empty array`);
  return [];
};

export const EnhancedTrendViewer: React.FC<EnhancedTrendViewerProps> = ({
  trendId,
  data,
  loading,
  error,
  isDark = false,
}) => {
  const transformedData = useMemo(() => {
    return formatChartData(trendId, data);
  }, [trendId, data]);

  const handleExportChart = () => {
    if (!transformedData || transformedData.length === 0) return;
    const csv = convertToCSV(transformedData);
    downloadCSV(csv, `${trendId}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleDownloadChart = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${trendId}-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-slate-200">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600">Loading trend data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-900">Error Loading Trend</p>
          <p className="text-sm text-red-800 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!transformedData || transformedData.length === 0) {
    console.warn(`[EnhancedTrendViewer] No data available for trend: ${trendId}`);
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-slate-200">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-slate-700 font-medium">No data available</p>
          <p className="text-slate-500 text-sm mt-1">No {trendId.replace(/-/g, ' ')} data available for selected range</p>
        </div>
      </div>
    );
  }

  /**
   * Trend metadata for enterprise display
   */
  const TREND_METADATA: { [key: string]: { title: string; subtitle: string; insight: string } } = {
    'filing-trends': {
      title: 'Patent Filing & Grant Trends',
      subtitle: 'Historical trajectory of patent filings and grants over time',
      insight: 'Track filing volume trends and identify potential backlog periods or regulatory changes affecting grant velocity',
    },
    'grant-trends': {
      title: 'Grant Approval Trends',
      subtitle: 'Grant activity and approval rates over time',
      insight: 'Monitor grant approvals and identify cycles that may indicate changes in examination capacity or policy',
    },
    'top-cited-patents': {
      title: 'Most Influential Patents',
      subtitle: 'Patents most frequently cited by others in your portfolio',
      insight: 'Identify foundational IP that forms the basis for your innovation strategy and ecosystem influence',
    },
    'top-citing-patents': {
      title: 'Most Referenced Patents',
      subtitle: 'Patents that frequently cite other patents',
      insight: 'Identify aggressive innovators that build upon existing IP, indicating new directions in technology',
    },
    'top-technologies': {
      title: 'Technology Distribution',
      subtitle: 'Patent coverage across technology classifications',
      insight: 'Understand your R&D investment distribution and identify underexplored technology domains',
    },
    'top-assignees': {
      title: 'Leading Patent Holders',
      subtitle: 'Organizations with highest patent filing volume',
      insight: 'Benchmark your innovation activity against competitors and industry leaders',
    },
    'country-distribution': {
      title: 'Geographic Filing Coverage',
      subtitle: 'Patent filings by jurisdiction',
      insight: 'Evaluate market protection strategy and identify concentration risk or expansion opportunities',
    },
    'patent-types': {
      title: 'Patent Type Mix',
      subtitle: 'Breakdown of patents by classification type',
      insight: 'Assess portfolio composition (utility, design, plant) and strategic focus areas',
    },
    'time-to-grant': {
      title: 'Grant Processing Timeline',
      subtitle: 'Average time from filing to patent grant',
      insight: 'Identify examination delays and understand jurisdiction-specific processing cycles',
    },
    'claim-complexity': {
      title: 'Claim Complexity Analysis',
      subtitle: 'Average and median claim counts indicating patent strategy',
      insight: 'Rising claim counts may indicate defensive patenting strategy or increasing technical specificity',
    },
    'technology-evolution': {
      title: 'Technology Evolution Over Time',
      subtitle: 'How technology domains and focus areas shift across years',
      insight: 'Identify emerging technology domains and declining areas to guide R&D resource allocation',
    },
    'epo-family-trends': {
      title: 'EPO Patent Family Distribution',
      subtitle: 'Distribution of patent family sizes from European Patent Office',
      insight: 'Analyze patent family composition to understand filing strategy - larger families indicate higher claim coverage',
    },
  };

  // Render appropriate chart based on trend type
  const renderChart = () => {
    console.log(`[EnhancedTrendViewer] renderChart called for ${trendId}, transformedData:`, transformedData);
    switch (trendId) {
      case 'filing-trends':
        return (
          <LineChartComponent
            data={transformedData}
            dataKey="filingCount"
            nameKey="year"
            name="Filing Count"
            height={400}
            isDark={isDark}
          />
        );
      case 'grant-trends':
        return (
          <LineChartComponent
            data={transformedData}
            dataKey="grantCount"
            nameKey="year"
            name="Grant Count"
            height={400}
            isDark={isDark}
          />
        );

      case 'top-technologies':
        return (
          <BarChartComponent
            data={transformedData.slice(0, 10)}
            dataKey="count"
            nameKey="cpcGroup"
            horizontal={true}
            height={400}
            isDark={isDark}
          />
        );
      case 'top-assignees':
        return (
          <BarChartComponent
            data={transformedData.slice(0, 10)}
            dataKey="patentCount"
            nameKey="assigneeName"
            horizontal={true}
            height={400}
            isDark={isDark}
          />
        );

      case 'country-distribution':
        return (
          <BarChartComponent
            data={transformedData.slice(0, 10)}
            dataKey="patentCount"
            nameKey="countryName"
            height={300}
            isDark={isDark}
          />
        );

      case 'top-cited-patents':
        return (
          <BarChartComponent
            data={transformedData.slice(0, 10)}
            dataKey="citationCount"
            nameKey="patentId"
            horizontal={false}
            height={400}
            isDark={isDark}
          />
        );

      case 'top-citing-patents':
        return (
          <BarChartComponent
            data={transformedData.slice(0, 10)}
            dataKey="citationCount"
            nameKey="patentId"
            horizontal={true}
            height={350}
            isDark={isDark}
          />
        );

      case 'patent-types':
        return (
          <PieChartComponent
            data={transformedData}
            dataKey="count"
            nameKey="type"
            height={400}
            isDark={isDark}
          />
        );

      case 'patent-type-distribution':
        return (
          <PieChartComponent
            data={transformedData}
            dataKey="count"
            nameKey="patentType"
            height={600}
            isDark={isDark}
          />
        );

      case 'claim-complexity':
        return (
          <MultiLineChartComponent
            data={transformedData}
            dataKeys={['avgClaims', 'medianClaims']}
            height={300}
            isDark={isDark}
          />
        );

      case 'time-to-grant':
        return (
          <AreaChartComponent
            data={transformedData}
            dataKey="avgYearsToGrant"
            nameKey="name"
            height={400}
            isDark={isDark}
          />
        );

      case 'technology-evolution':
        return (
          <LineChartComponent
            data={transformedData}
            dataKey="totalCount"
            name="Total Count"
            height={400}
            isDark={isDark}
          />
        );

      case 'epo-family-trends':
        return (
          <BarChartComponent
            data={transformedData}
            dataKey="familyCount"
            nameKey="name"
            height={400}
            isDark={isDark}
          />
        );

      default:
        return (
          <LineChartComponent
            data={transformedData}
            dataKey="count"
            height={400}
            isDark={isDark}
          />
        );
    }
  };

  const metadata = TREND_METADATA[trendId] || {
    title: trendId.replace(/-/g, ' ').toUpperCase(),
    subtitle: 'Trend analysis',
    insight: 'Analysis of trend data'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-8 shadow-lg border border-yellow-400/40">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 tracking-tight text-yellow-300">{metadata.title}</h1>
            <p className="text-yellow-200 text-sm mb-4 font-bold">{metadata.subtitle}</p>
            <div className="flex items-start gap-2 bg-yellow-900/40 rounded-lg p-4 border border-yellow-400 w-fit">
              <div className="w-2 h-full bg-yellow-400 rounded-full mt-0.5"></div>
              <div>
                <p className="text-xs font-bold text-yellow-300 uppercase tracking-wide">Key Insight</p>
                <p className="text-sm text-yellow-100 mt-2 font-bold">{metadata.insight}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-yellow-400 font-bold uppercase tracking-wide">Data Points</div>
            <div className="text-3xl font-bold text-yellow-300 mt-1">{transformedData.length.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Visualization</h2>
          <p className="text-sm text-slate-500 mt-1">Interactive chart showing trend patterns and relationships</p>
        </div>
        <div className="w-full bg-slate-50/50 rounded-lg p-6">
          {renderChart()}
        </div>
      </div>

      {/* Data Table Preview */}
      {transformedData && Array.isArray(transformedData) && transformedData.length > 0 && (() => {
        // Find columns that have actual data in the dataset
        let relevantColumns = getRelevantColumns(trendId, transformedData[0]);
        
        // If no relevant columns found, detect columns from first non-null values across dataset
        if (relevantColumns.length === 0) {
          const allKeys = new Set<string>();
          transformedData.slice(0, 5).forEach(row => {
            Object.keys(row).forEach(key => allKeys.add(key));
          });
          relevantColumns = Array.from(allKeys)
            .filter(k => !['$$hashKey', 'original', 'raw'].includes(k))
            .slice(0, 6);
        }

        return (
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Data Preview</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Sample of {Math.min(10, transformedData.length)} rows from {transformedData.length.toLocaleString()} total
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Columns</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{relevantColumns.length}</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200/80">
                    {relevantColumns.length > 0 ? (
                      relevantColumns.map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left font-semibold text-slate-700 whitespace-nowrap text-xs uppercase tracking-wide"
                        >
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))
                    ) : (
                      <th className="px-6 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">Data</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {transformedData.slice(0, 10).map((row: any, idx: number) => (
                    <tr key={`row-${trendId}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      {relevantColumns.length > 0 ? (
                        relevantColumns.map((key) => {
                          const value = row[key];
                          let displayValue = '';
                          
                          if (value === null || value === undefined || value === '') {
                            displayValue = '-';
                          } else if (typeof value === 'number') {
                            // For large numbers, use toLocaleString for better readability
                            if (value >= 100 || value < 0) {
                              displayValue = value.toLocaleString('en-US', { maximumFractionDigits: 0 });
                            } else if (Number.isInteger(value)) {
                              displayValue = value.toString();
                            } else {
                              displayValue = value.toFixed(2);
                            }
                          } else if (typeof value === 'string') {
                            displayValue = value.substring(0, 50);
                          } else if (typeof value === 'object') {
                            displayValue = JSON.stringify(value).substring(0, 50);
                          } else {
                            displayValue = String(value);
                          }
                          
                          return (
                            <td key={`cell-${key}-${idx}`} className="px-6 py-4 text-slate-700 font-medium font-mono text-sm">
                              {displayValue}
                            </td>
                          );
                        })
                      ) : (
                        <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                          {JSON.stringify(row).substring(0, 100)}...
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Footer with Trust Signals */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-2">Data Source</h4>
            <p className="text-xs text-slate-600">USPTO, EPO, PatentsView, WIPO</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-2">Generated</h4>
            <p className="text-xs text-slate-600">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-2">Records</h4>
            <p className="text-xs text-slate-600">{transformedData.length.toLocaleString()} total data points</p>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleExportChart}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-sm border border-slate-200/50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={handleDownloadChart}
          className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold text-sm shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download Chart
        </button>
      </div>
    </div>
  );
};

/**
 * Helper function to convert data to CSV
 */
function convertToCSV(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        })
        .join(',')
    ),
  ].join('\n');

  return csv;
}

/**
 * Helper function to download CSV
 */
function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default EnhancedTrendViewer;
