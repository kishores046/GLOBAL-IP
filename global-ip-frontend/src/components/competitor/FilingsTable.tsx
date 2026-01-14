import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { competitorAPI, CompetitorFiling, FilingSearchRequest, Competitor } from '../../services/competitorAPI';

interface FilingsTableProps {
  competitors: Competitor[];
}

export function FilingsTable({ competitors }: FilingsTableProps) {
  const navigate = useNavigate();
  const [filings, setFilings] = useState<CompetitorFiling[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [initialized, setInitialized] = useState(false);
  
  const [selectedCompetitors, setSelectedCompetitors] = useState<number[]>([]);
  const [fromDate, setFromDate] = useState('2020-01-01');
  const [toDate, setToDate] = useState('');
  const [jurisdiction, setJurisdiction] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (competitors.length > 0 && !initialized) {
      const activeIds = competitors.filter(c => c.active).map(c => c.id);
      setSelectedCompetitors(activeIds);
      setInitialized(true);
    }
  }, [competitors, initialized]);

  const fetchFilings = async () => {
    if (!initialized) return;
    
    try {
      setIsLoading(true);
      const request: FilingSearchRequest = {
        competitorIds: selectedCompetitors.length > 0 ? selectedCompetitors : undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        jurisdiction: jurisdiction !== 'All' ? jurisdiction : undefined,
        page: currentPage,
        size: pageSize,
      };

      const response = await competitorAPI.searchFilings(request);
      setFilings(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      setFilings([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialized) {
      fetchFilings();
    }
  }, [currentPage, selectedCompetitors, fromDate, toDate, jurisdiction, initialized]);

  const handleCompetitorToggle = (id: number) => {
    setSelectedCompetitors(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
    setCurrentPage(0);
  };

  const handlePatentClick = (patentId: string) => {
    navigate(`/patents/${patentId}`);
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Filing Details</h2>
        </div>
        <div className="text-sm text-slate-600">
          {totalElements.toLocaleString()} total filings
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <span className="font-medium text-slate-700">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Competitor Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Competitors
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {competitors.filter(c => c.active).map(comp => (
                <label key={comp.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCompetitors.includes(comp.id)}
                    onChange={() => handleCompetitorToggle(comp.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{comp.displayName}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setCurrentPage(0); }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setCurrentPage(0); }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Jurisdiction */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Jurisdiction
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => { setJurisdiction(e.target.value); setCurrentPage(0); }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All</option>
              <option value="US">US</option>
              <option value="EP">EP</option>
              <option value="CN">CN</option>
              <option value="JP">JP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Patent ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Title</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Competitor</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Publication Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Jurisdiction</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600">Loading filings...</p>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && filings.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
     
                  No filings found
                </td>
              </tr>
            )}
            {!isLoading && filings.length > 0 && filings.map((filing) => (
              <tr
                key={filing.id}
                onClick={() => handlePatentClick(filing.patentId)}
                className="border-b border-slate-100 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 text-sm font-mono text-blue-600 font-medium">
                  {filing.patentId}
                </td>
                <td className="py-3 px-4 text-sm text-slate-700 max-w-md truncate">
                  {filing.title}
                </td>
                <td className="py-3 px-4 text-sm text-slate-700">
                  {filing.competitorName}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  {new Date(filing.publicationDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  {filing.jurisdiction}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">
                  {filing.assignee || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
