/**
 * Sync Result Panel Component
 * Displays detailed results after a sync operation
 */

import { SyncResultDTO } from '../../services/competitorFilingApi';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';

interface SyncResultPanelProps {
  readonly result: SyncResultDTO;
}

export function SyncResultPanel({ result }: SyncResultPanelProps) {
  const syncStartTime = parseISO(result.syncStarted);
  const syncEndTime = parseISO(result.syncCompleted);
  const durationMs = syncEndTime.getTime() - syncStartTime.getTime();
  const durationSecs = (durationMs / 1000).toFixed(2);

  // Check if any sync had errors
  const failedCount = result.details?.filter(d => d.status === 'FAILED').length || 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          Sync Completed
        </h2>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Start Time
          </p>
          <p className="text-sm text-slate-900 font-mono">
            {format(syncStartTime, 'HH:mm:ss')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {format(syncStartTime, 'MMM dd, yyyy')}
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            End Time
          </p>
          <p className="text-sm text-slate-900 font-mono">
            {format(syncEndTime, 'HH:mm:ss')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {formatDistanceToNow(syncEndTime, { addSuffix: true })}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
            Duration
          </p>
          <p className="text-lg font-bold text-blue-900">{durationSecs}s</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Status
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {failedCount === 0 ? (
              <span className="text-green-700">All Success</span>
            ) : (
              <span className="text-amber-700">{failedCount} Failed</span>
            )}
          </p>
        </div>
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border-l-4 border-blue-500 bg-blue-50 rounded p-4">
          <p className="text-slate-600 text-sm font-medium mb-1">Competitors Processed</p>
          <p className="text-3xl font-bold text-blue-900">{result.competitorsProcessed}</p>
        </div>

        <div className="border-l-4 border-green-500 bg-green-50 rounded p-4">
          <p className="text-slate-600 text-sm font-medium mb-1">New Filings Found</p>
          <p className="text-3xl font-bold text-green-700">{result.newFilingsFound}</p>
        </div>

        <div className="border-l-4 border-amber-500 bg-amber-50 rounded p-4">
          <p className="text-slate-600 text-sm font-medium mb-1">Duplicates Skipped</p>
          <p className="text-3xl font-bold text-amber-700">{result.duplicatesSkipped}</p>
        </div>
      </div>

      {/* Details Table */}
      {result.details && result.details.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Competitor</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">New Filings</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Duplicates</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Notes</th>
              </tr>
            </thead>
            <tbody>
              {result.details.map((detail, index) => (
                <tr
                  key={`${detail.competitorCode}-${index}`}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-mono text-slate-900">{detail.competitorCode}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-slate-900">{detail.newFilings}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{detail.duplicates}</td>
                  <td className="px-4 py-3">
                    {detail.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {detail.errorMessage ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {(!result.details || result.details.length === 0) && (
        <div className="text-center py-6 text-slate-500">
          <p className="text-sm">No detailed sync results available</p>
        </div>
      )}
    </div>
  );
}
