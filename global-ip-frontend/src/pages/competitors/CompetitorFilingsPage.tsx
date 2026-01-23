/**
 * Competitor Filings Page
 * 
 * Drill-down view: Shows all filings for a specific competitor
 * Features:
 * - Professional data table with sorting/pagination
 * - Detailed filing information
 * - Links back to analytics list
 */

import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCompetitorFilingsPaginated } from '../../hooks/useCompetitorAnalytics';
import { ROUTES } from '../../routes/routeConfig';
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { CompetitorFilingDTO } from '../../services/competitorFilingApi';

type SortField = 'patentId' | 'title' | 'publicationDate' | 'jurisdiction' | 'status';
type SortOrder = 'asc' | 'desc';

const SortHeader = ({
  field,
  label,
  sortField,
  sortOrder,
  onSort,
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}) => (
  <button
    onClick={() => onSort(field)}
    className="flex items-center gap-2 hover:text-slate-900 transition"
  >
    {label}
    {sortField === field && (
      <ArrowUpDown className={`w-3 h-3 ${sortOrder === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
    )}
  </button>
);

export function CompetitorFilingsPage() {
  const navigate = useNavigate();
  const { competitorId: paramId } = useParams<{ competitorId: string }>();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('competitorId');
  
  // Use either URL param or query param
  const competitorId = paramId || queryId;
  const id = parseInt(competitorId || '0', 10);

  // Pagination and sorting
  const [page, setPage] = useState(0);
  const pageSize = 50;
  const [sortField, setSortField] = useState<SortField>('publicationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Fetch filings
  const { data: response, isLoading, error } = useCompetitorFilingsPaginated(
    id,
    page,
    pageSize,
    !!id
  );

  const filings = response?.content || [];
  const totalPages = response?.totalPages || 0;

  // Client-side sort
  const sortedFilings = [...filings].sort((a, b) => {
    let aVal: any = a[sortField as keyof CompetitorFilingDTO];
    let bVal: any = b[sortField as keyof CompetitorFilingDTO];

    // Handle nulls
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Convert to comparable values
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading filings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Failed to Load Filings</h3>
                <p className="text-red-800 text-sm mb-4">
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(ROUTES.COMPETITORS)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(ROUTES.COMPETITORS)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Analytics
          </button>

          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Patent Filings - {filings[0]?.competitorName || 'Competitor'}
          </h1>
          <p className="text-slate-600">
            {response?.totalElements || 0} filings from{' '}
            <code className="text-slate-700 font-mono">{filings[0]?.competitorCode}</code>
          </p>
        </div>

        {/* Filings Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          {sortedFilings.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No filings available for this competitor</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      <SortHeader
                        field="patentId"
                        label="Patent ID"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      <SortHeader
                        field="title"
                        label="Title"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      <SortHeader
                        field="jurisdiction"
                        label="Jurisdiction"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      <SortHeader
                        field="publicationDate"
                        label="Publication Date"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Filed By</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Owner</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      <SortHeader
                        field="status"
                        label="Status"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFilings.map((filing) => (
                    <tr
                      key={filing.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {filing.patentId}
                        </code>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-slate-900 font-medium truncate" title={filing.title}>
                          {filing.title}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                          {filing.jurisdiction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-600">
                        {filing.publicationDate
                          ? format(new Date(filing.publicationDate), 'MMM dd, yyyy')
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        <span className="truncate" title={filing.filedBy}>
                          {filing.filedBy || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        <span className="truncate" title={filing.currentOwner}>
                          {filing.currentOwner || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                          {filing.filingType || 'Patent'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {(() => {
                          let statusClass: string;
                          if (filing.status === 'ACTIVE') {
                            statusClass = 'bg-green-100 text-green-800';
                          } else if (filing.status === 'ABANDONED') {
                            statusClass = 'bg-red-100 text-red-800';
                          } else {
                            statusClass = 'bg-slate-100 text-slate-800';
                          }
                          return (
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
                              {filing.status}
                            </span>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Page {page + 1} of {totalPages}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 rounded border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i;
                  const isActive = pageNum === page;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded text-sm font-medium transition ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 hover:bg-white'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
