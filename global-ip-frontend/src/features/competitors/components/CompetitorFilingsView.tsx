/**
 * Competitor Filings View
 * Displays filings for a specific competitor with pagination and search
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { filingApi } from '../api/filingApi';
import type { CompetitorFilingDTO, PageableResponse } from '../types/competitor.types';
import { formatDate } from '../utils/competitorHelpers';

interface CompetitorFilingsViewProps {
  competitorId: number;
  competitorName: string;
  competitorCode: string;
}

export function CompetitorFilingsView({
  competitorId,
  competitorName,
  competitorCode,
}: CompetitorFilingsViewProps) {
  const [filings, setFilings] = useState<CompetitorFilingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadFilings();
  }, [competitorId, page, pageSize]);

  const loadFilings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: PageableResponse<CompetitorFilingDTO> =
        await filingApi.getByCompetitorPaginated(competitorId, page, pageSize);
      setFilings(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load filings');
    } finally {
      setLoading(false);
    }
  };

  const getJurisdictionBadge = (jurisdiction: string) => {
    switch (jurisdiction) {
      case 'US':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">🇺🇸 US</span>;
      case 'EP':
        return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">🇪🇺 EP</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{jurisdiction}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>;
      case 'PUBLISHED':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Published</span>;
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
      case 'ABANDONED':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Abandoned</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">
          Filings for {competitorName}
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Code: <span className="font-mono font-semibold text-slate-900">{competitorCode}</span> • Total: {totalElements} filings
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !filings.length ? (
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-slate-600">Loading filings...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Filings Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-6 text-slate-700 font-semibold">Patent ID</th>
                  <th className="text-left py-3 px-6 text-slate-700 font-semibold">Title</th>
                  <th className="text-left py-3 px-6 text-slate-700 font-semibold">Publication Date</th>
                  <th className="text-left py-3 px-6 text-slate-700 font-semibold">Jurisdiction</th>
                  <th className="text-left py-3 px-6 text-slate-700 font-semibold">Status</th>
                  <th className="text-left py-3 px-6 text-slate-700 font-semibold">Current Owner</th>
                </tr>
              </thead>
              <tbody>
                {filings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-6 text-center text-slate-500">
                      No filings found for this competitor
                    </td>
                  </tr>
                ) : (
                  filings.map((filing, index) => (
                    <motion.tr
                      key={filing.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-blue-600 font-semibold">{filing.patentId}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="max-w-xs">
                          <p className="text-sm text-slate-900 font-medium truncate" title={filing.title}>
                            {filing.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">Filed by: {filing.filedBy}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-700">{formatDate(filing.publicationDate)}</span>
                      </td>
                      <td className="py-4 px-6">{getJurisdictionBadge(filing.jurisdiction)}</td>
                      <td className="py-4 px-6">{getStatusBadge(filing.status)}</td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-700">{filing.currentOwner}</span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Page size:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0 || loading}
                    className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1 || loading}
                    className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default CompetitorFilingsView;
