/**
 * Competitor Filings Page
 * Advanced search and browse filings from competitors
 */

import { useState } from 'react';
import { useSearchFilings } from '../../features/competitors/hooks';
import { useCompetitors } from '../../features/competitors/hooks';
import { FilingList } from '../../features/competitors/components/FilingList';
import type { FilingSearchRequest } from '../../features/competitors/types';

export function CompetitorFilingsPage() {
  const [searchRequest, setSearchRequest] = useState<FilingSearchRequest>({
    page: 0,
    size: 50,
  });

  const { data: competitors = [], isLoading: competitorsLoading } = useCompetitors(true);
  const { data: filingsResponse, isLoading: filingsLoading, error } = useSearchFilings(searchRequest);

  const handleCompetitorFilter = (competitorIds: number[]) => {
    setSearchRequest({
      ...searchRequest,
      competitorIds: competitorIds.length > 0 ? competitorIds : undefined,
      page: 0,
    });
  };

  const handleDateRangeChange = (fromDate?: string, toDate?: string) => {
    setSearchRequest({
      ...searchRequest,
      fromDate,
      toDate,
      page: 0,
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Competitor Filings</h1>
        <p className="text-slate-600">Search and browse filings from your tracked competitors</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Filter Panel */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-6">
            <h2 className="font-semibold mb-4">Filters</h2>

            {/* Competitor Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Competitors
              </label>
              <div className="space-y-2">
                {competitorsLoading ? (
                  <p className="text-sm text-slate-500">Loading...</p>
                ) : competitors.length > 0 ? (
                  competitors.map((competitor) => (
                    <label key={competitor.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        onChange={(e) => {
                          const ids = searchRequest.competitorIds || [];
                          if (e.target.checked) {
                            handleCompetitorFilter([...ids, competitor.id]);
                          } else {
                            handleCompetitorFilter(ids.filter(id => id !== competitor.id));
                          }
                        }}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">{competitor.displayName}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No competitors available</p>
                )}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                From Date
              </label>
              <input
                type="date"
                onChange={(e) => handleDateRangeChange(e.target.value, searchRequest.toDate)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                To Date
              </label>
              <input
                type="date"
                onChange={(e) => handleDateRangeChange(searchRequest.fromDate, e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            {/* Clear Button */}
            <button
              onClick={() => setSearchRequest({ page: 0, size: 50 })}
              className="w-full px-3 py-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-3">
          {/* Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {filingsLoading
                ? 'Loading...'
                : filingsResponse
                ? `${filingsResponse.totalElements.toLocaleString()} filing${filingsResponse.totalElements !== 1 ? 's' : ''} found`
                : 'No filings'}
            </p>
          </div>

          {/* Filing List */}
          <FilingList
            filings={filingsResponse?.content || []}
            loading={filingsLoading}
            error={error}
          />

          {/* Pagination */}
          {filingsResponse && filingsResponse.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                disabled={!filingsResponse.hasPrevious}
                onClick={() => setSearchRequest({ ...searchRequest, page: searchRequest.page! - 1 })}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>

              <div className="text-sm text-slate-600">
                Page {(searchRequest.page || 0) + 1} of {filingsResponse.totalPages}
              </div>

              <button
                disabled={!filingsResponse.hasNext}
                onClick={() => setSearchRequest({ ...searchRequest, page: searchRequest.page! + 1 })}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompetitorFilingsPage;
