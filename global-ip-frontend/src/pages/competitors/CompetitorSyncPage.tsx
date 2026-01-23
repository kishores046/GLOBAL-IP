/**
 * Competitor Sync Management Page
 * Manage filing synchronization
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { useFilingSync } from '../../features/competitors/hooks';
import { SyncResults } from '../../features/competitors/components/SyncResults';

export function CompetitorSyncPage() {
  const [fromDate, setFromDate] = useState(
    format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  );
  const { mutate: sync, isPending, data: lastResult } = useFilingSync();

  const handleSync = () => {
    sync(fromDate);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Filing Sync Management</h1>
        <p className="text-slate-600">Synchronize patents from all active competitors</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sync Control Panel */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-6">
            <h2 className="font-semibold mb-4">Sync Control</h2>

            <div className="mb-6">
              <label htmlFor="sync-date" className="block text-sm font-medium text-slate-900 mb-2">
                Sync from date
              </label>
              <input
                id="sync-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-2">
                Last 7 days by default
              </p>
            </div>

            <button
              onClick={handleSync}
              disabled={isPending}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Syncing...
                </span>
              ) : (
                'Start Sync Now'
              )}
            </button>

            {isPending && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">Synchronizing in progress...</p>
                <div className="mt-2 w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{
                    animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-2">
          {!lastResult ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-600 mb-2">No sync results yet</p>
              <p className="text-sm text-slate-500">Run a sync to see detailed results</p>
            </div>
          ) : (
            <SyncResults result={lastResult} />
          )}
        </div>
      </div>
    </div>
  );
}

export default CompetitorSyncPage;
