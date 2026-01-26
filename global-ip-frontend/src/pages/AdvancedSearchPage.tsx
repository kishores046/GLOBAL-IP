import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Search, X, Loader2, Calendar } from "lucide-react";
import { unifiedSearchAPI } from "../services/api";
import { validateFilingDateRange, getMaxFilingDate } from "../utils/trademarkUtils";
import { getSortedJurisdictions, getJurisdictionLabel } from "../constants/jurisdictions";
import { AnalystLayoutContext } from "../components/dashboard/AnalystLayout";

export function AdvancedSearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [jurisdiction, setJurisdiction] = useState("ALL");
  const [assignee, setAssignee] = useState("");
  const [inventor, setInventor] = useState("");
  const [owner, setOwner] = useState("");
  const [state, setState] = useState("");
  const [filingDateFrom, setFilingDateFrom] = useState("");
  const [filingDateTo, setFilingDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxDate = getMaxFilingDate();

  const handleSearch = async () => {
    // Validation: keyword is required
    if (!keyword.trim()) {
      setError("Keyword is required");
      return;
    }

    // Validate filing date range
    const dateValidation = validateFilingDateRange(filingDateFrom, filingDateTo);
    if (!dateValidation.isValid) {
      setError(dateValidation.error || "Invalid date range");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build dynamic request body - only include fields with values
      const searchParams: any = {
        keyword: keyword.trim(),
      };

      // Add optional fields only if they have values
      if (jurisdiction && jurisdiction !== "ALL") {
        searchParams.jurisdiction = jurisdiction;
      }
      if (filingDateFrom) {
        searchParams.filingDateFrom = filingDateFrom;
      }
      if (filingDateTo) {
        searchParams.filingDateTo = filingDateTo;
      }
      if (assignee.trim()) {
        searchParams.assignee = assignee.trim();
      }
      if (inventor.trim()) {
        searchParams.inventor = inventor.trim();
      }
      if (owner.trim()) {
        searchParams.owner = owner.trim();
      }
      if (state.trim()) {
        searchParams.state = state.trim();
      }

      const response = await unifiedSearchAPI.search(searchParams);
      
      // Increment search count
      const currentCount = parseInt(localStorage.getItem('searchQueryCount') || '0', 10);
      localStorage.setItem('searchQueryCount', (currentCount + 1).toString());
      
      // Navigate to results page with data
      navigate("/search/results", {
        state: {
          patents: response.patents,
          trademarks: response.trademarks,
        },
      });
    } catch (err: any) {
      console.error("Unified search error:", err);
      
      // Handle specific error codes
      if (err.response?.status === 400) {
        setError("Keyword is required");
      } else if (err.response?.status === 500) {
        setError("An error occurred while searching. Please try again later.");
      } else {
        setError(
          err.response?.data?.message ?? 
          "Failed to search. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setKeyword("");
    setJurisdiction("ALL");
    setAssignee("");
    setInventor("");
    setOwner("");
    setState("");
    setFilingDateFrom("");
    setFilingDateTo("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };
  const inAnalystLayout = useContext(AnalystLayoutContext);

  const innerContent = (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl text-blue-900 mb-2">Advanced Search</h1>
        <p className="text-slate-600">Powerful search tools for comprehensive IP analysis</p>
      </div>

      {/* Search Panel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg"><Search className="w-6 h-6 text-blue-600" /></div>
          <h2 className="text-2xl text-blue-900">Advanced IP Search</h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700"><X className="w-5 h-5" /></button>
          </div>
        )}

        <div className="space-y-6">
          {/* Keyword Search - Required */}
          <div>
            <label htmlFor="keyword-input" className="block text-slate-700 mb-2 font-medium">Keyword <span className="text-red-500">*</span></label>
            <input id="keyword-input" type="text" placeholder='e.g., "artificial intelligence", "battery technology"...' value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" />
            <p className="mt-1 text-sm text-slate-500">Search across patents and trademarks (required)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="jurisdiction-select" className="block text-slate-700 mb-2 font-medium flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>Jurisdiction</label>
              <div className="relative">
                <select id="jurisdiction-select" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer font-medium text-slate-900 hover:border-blue-400">
                  <option value="ALL">🌍 All Jurisdictions</option>
                  <optgroup label="━━━ Regional Patent Offices ━━━">
                    {getSortedJurisdictions().regionalOffices.map((code) => (
                      <option key={code} value={code}>🌐 {getJurisdictionLabel(code)}</option>
                    ))}
                  </optgroup>
                  <optgroup label="━━━ Individual Countries ━━━">
                    {getSortedJurisdictions().individualCountries.map((code) => (
                      <option key={code} value={code}>🏛️ {getJurisdictionLabel(code)}</option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-blue-600 font-medium">{jurisdiction === "ALL" ? "📊 Searching all jurisdictions" : `📌 Filtered to: ${jurisdiction}`}</p>
            </div>

            <div>
              <label htmlFor="filing-date-from" className="block text-slate-700 mb-2 font-medium"><Calendar className="inline w-4 h-4 mr-1" />Filing Date From</label>
              <input id="filing-date-from" type="date" value={filingDateFrom} max={maxDate} onChange={(e) => setFilingDateFrom(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              <p className="mt-1 text-xs text-slate-500">Cannot be in the future</p>
            </div>

            <div>
              <label htmlFor="filing-date-to" className="block text-slate-700 mb-2 font-medium"><Calendar className="inline w-4 h-4 mr-1" />Filing Date To</label>
              <input id="filing-date-to" type="date" value={filingDateTo} max={maxDate} onChange={(e) => setFilingDateTo(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              <p className="mt-1 text-xs text-slate-500">Cannot be in the future</p>
            </div>
          </div>

          {/* Patent-specific fields */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Patent Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="assignee-input" className="block text-slate-700 mb-2 font-medium">Assignee</label>
                <input id="assignee-input" type="text" placeholder="Company or organization name..." value={assignee} onChange={(e) => setAssignee(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>

              <div>
                <label htmlFor="inventor-input" className="block text-slate-700 mb-2 font-medium">Inventor</label>
                <input id="inventor-input" type="text" placeholder="Inventor name..." value={inventor} onChange={(e) => setInventor(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
            </div>
          </div>

          {/* Trademark-specific fields */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Trademark Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="owner-input" className="block text-slate-700 mb-2 font-medium">Owner</label>
                <input id="owner-input" type="text" placeholder="Trademark owner..." value={owner} onChange={(e) => setOwner(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>

              <div>
                <label htmlFor="state-input" className="block text-slate-700 mb-2 font-medium">State</label>
                <input id="state-input" type="text" placeholder="State (e.g., CA, NY)..." value={state} onChange={(e) => setState(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSearch} disabled={isLoading || !keyword.trim()} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Searching...</>) : (<><Search className="w-5 h-5" />Search IP</>)}
            </button>
            <button onClick={handleClearAll} disabled={isLoading} className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all disabled:opacity-50">Clear All</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (inAnalystLayout) {
    return innerContent;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{innerContent}</main>
      </div>
    </div>
  );
}
