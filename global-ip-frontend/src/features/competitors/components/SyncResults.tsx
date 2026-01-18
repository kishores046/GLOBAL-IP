/**
 * Sync Results Component
 * Displays detailed results from filing synchronization
 */

import { format } from 'date-fns';
import type { SyncResultDTO } from '../types';

interface SyncResultsProps {
  result: SyncResultDTO;
}

export function SyncResults({ result }: SyncResultsProps) {
  const syncDuration = new Date(result.syncCompleted).getTime() - new Date(result.syncStarted).getTime();
  const durationSeconds = Math.round(syncDuration / 1000);
  const successCount = result.details.filter(d => d.status === 'SUCCESS').length;
  const failureCount = result.details.filter(d => d.status !== 'SUCCESS').length;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Sync Results</h3>
        <p className="text-sm text-slate-600">
          Completed on {format(new Date(result.syncCompleted), 'PPpp')}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b bg-slate-50">
        <div>
          <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Sync Duration</p>
          <p className="text-2xl font-bold text-slate-900">{durationSeconds}s</p>
        </div>

        <div>
          <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Competitors Processed</p>
          <p className="text-2xl font-bold text-slate-900">{result.competitorsProcessed}</p>
        </div>

        <div>
          <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">New Filings Found</p>
          <p className="text-2xl font-bold text-green-600">+{result.newFilingsFound}</p>
        </div>

        <div>
          <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Duplicates Skipped</p>
          <p className="text-2xl font-bold text-amber-600">{result.duplicatesSkipped}</p>
        </div>

        <div>
          <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Sync Status</p>
          <p className="text-lg font-bold">
            <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
              failureCount === 0
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {failureCount === 0 ? '✓ Complete' : `${failureCount} Issues`}
            </span>
          </p>
        </div>
      </div>

      {/* Per-Competitor Details */}
      <div className="px-6 py-4">
        <h4 className="text-sm font-semibold text-slate-900 mb-4">Per-Competitor Breakdown</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left py-3 px-3 font-semibold text-slate-900">Competitor</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-900">New Filings</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-900">Duplicates</th>
                <th className="text-center py-3 px-3 font-semibold text-slate-900">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-900">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.details.map((detail) => (
                <tr key={detail.competitorCode} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs font-medium">
                      {detail.competitorCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {detail.newFilings > 0 ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        +{detail.newFilings}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {detail.duplicates > 0 ? (
                      <span className="text-amber-700 font-medium">{detail.duplicates}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      detail.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {detail.status === 'SUCCESS' ? '✓ Success' : '✗ Failed'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {detail.errorMessage ? (
                      <span className="text-red-600 text-xs font-medium" title={detail.errorMessage}>
                        {detail.errorMessage.length > 50
                          ? `${detail.errorMessage.substring(0, 50)}...`
                          : detail.errorMessage}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="bg-slate-50 px-6 py-4 border-t text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <div>
            {successCount > 0 && (
              <span className="text-green-700 font-medium">
                ✓ {successCount} competitor{successCount !== 1 ? 's' : ''} synced successfully
              </span>
            )}
            {failureCount > 0 && (
              <>
                {successCount > 0 && ' · '}
                <span className="text-red-700 font-medium">
                  ✗ {failureCount} competitor{failureCount !== 1 ? 's' : ''} had issues
                </span>
              </>
            )}
          </div>
          <div>
            <span className="text-slate-600">
              Total: {result.newFilingsFound} new, {result.duplicatesSkipped} skipped
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyncResults;
