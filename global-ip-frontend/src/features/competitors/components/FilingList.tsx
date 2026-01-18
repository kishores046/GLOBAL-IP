/**
 * Filing List Component
 * Displays competitor filings with ownership transfer indicators
 */

import { format } from 'date-fns';
import type { CompetitorFilingDTO } from '../types';
import {
  formatDate,
  hasOwnershipTransfer,
  getJurisdictionBadge,
  getFilingTypeTooltip,
  getStatusColor,
  getStatusLabel,
} from '../utils';

interface FilingListProps {
  filings: CompetitorFilingDTO[];
  loading?: boolean;
  error?: Error | null;
}

export function FilingList({ filings, loading, error }: FilingListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-slate-600">Loading filings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-red-600">Error loading filings: {error.message}</p>
        </div>
      </div>
    );
  }

  if (filings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-slate-600">No filings found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Patent ID</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Title</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Competitor</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Filed By</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Current Owner</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Publication Date</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Jurisdiction</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Type</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filings.map((filing) => {
              const hasTransfer = hasOwnershipTransfer(filing);
              const jurisdictionBadge = getJurisdictionBadge(filing.jurisdiction);
              const filingTypeTooltip = getFilingTypeTooltip(filing.filingType);

              return (
                <tr key={filing.id} className="hover:bg-slate-50 transition-colors">
                  {/* Patent ID */}
                  <td className="px-6 py-4 text-sm text-slate-900 font-mono">
                    <a href={`https://patents.google.com/patent/${filing.patentId}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline">
                      {filing.patentId}
                    </a>
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                    <span title={filing.title}>{filing.title}</span>
                  </td>

                  {/* Competitor */}
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs font-medium">
                      {filing.competitorCode}
                    </span>
                  </td>

                  {/* Filed By (Original Assignee) */}
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {filing.filedBy}
                  </td>

                  {/* Current Owner */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">{filing.currentOwner}</span>

                      {/* Ownership Transfer Badge */}
                      {hasTransfer && (
                        <div className="group relative">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 1 1-.708-.708L9.293 8 7.146 5.854a.5.5 0 1 1 .708-.708l3 3z"/>
                              <path d="M5.146 8.854a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.707 8l2.147 2.146a.5.5 0 1 1-.708.708l-3-3z"/>
                            </svg>
                            <span>Transferred</span>
                          </span>

                          {/* Tooltip */}
                          <div className="hidden group-hover:block absolute bottom-full mb-2 left-0 bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            Originally filed by {filing.filedBy}, now owned by {filing.currentOwner}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Publication Date */}
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {formatDate(filing.publicationDate)}
                  </td>

                  {/* Jurisdiction */}
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      filing.jurisdiction === 'US'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      <span>{jurisdictionBadge.icon}</span>
                      <span>{jurisdictionBadge.label}</span>
                    </span>
                  </td>

                  {/* Filing Type */}
                  <td className="px-6 py-4 text-sm">
                    <div className="group relative">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs font-medium cursor-help">
                        {filing.filingType || 'N/A'}
                      </span>

                      {/* Filing Type Tooltip */}
                      <div className="hidden group-hover:block absolute bottom-full mb-2 left-0 bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        {filingTypeTooltip}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      getStatusColor(filing.status)
                    }`}>
                      {getStatusLabel(filing.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      <div className="bg-slate-50 px-6 py-3 border-t text-sm text-slate-600">
        Showing {filings.length} filing{filings.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default FilingList;
