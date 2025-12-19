import { useState } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Search, X, Loader2, Calendar } from "lucide-react";
import { patentSearchAPI, PatentSearchResult } from "../services/api";

export function AdvancedSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [jurisdiction, setJurisdiction] = useState("ALL");
  const [assignee, setAssignee] = useState("");
  const [inventor, setInventor] = useState("");
  const [filingDateFrom, setFilingDateFrom] = useState("");
  const [filingDateTo, setFilingDateTo] = useState("");
  const [searchResults, setSearchResults] = useState<PatentSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    // Validation: keyword is required
    if (!keyword.trim()) {
      setError("Please enter a keyword to search");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(false);

    try {
      const searchParams = {
        keyword: keyword.trim(),
        jurisdiction: jurisdiction === "ALL" ? null : jurisdiction,
        filingDateFrom: filingDateFrom || null,
        filingDateTo: filingDateTo || null,
        assignee: assignee.trim() || "",
        inventor: inventor.trim() || "",
      };

      const results = await patentSearchAPI.advancedSearch(searchParams);
      setSearchResults(results);
      setHasSearched(true);
    } catch (err: any) {
      console.error("Patent search error:", err);
      setError(
        err.response?.data?.message ?? 
        "Failed to search patents. Please try again."
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setKeyword("");
    setJurisdiction("ALL");
    setAssignee("");
    setInventor("");
    setFilingDateFrom("");
    setFilingDateTo("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Advanced Search</h1>
              <p className="text-slate-600">Powerful search tools for comprehensive IP analysis</p>
            </div>

            {/* Search Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl text-blue-900">Advanced Patent Search</h2>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="space-y-6">
                {/* Keyword Search - Required */}
                <div>
                  <label htmlFor="keyword-input" className="block text-slate-700 mb-2 font-medium">
                    Keyword <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="keyword-input"
                    type="text"
                    placeholder='e.g., "artificial intelligence", "battery technology"...'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <p className="mt-1 text-sm text-slate-500">Title-based search (required)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="jurisdiction-select" className="block text-slate-700 mb-2 font-medium">Jurisdiction</label>
                    <select 
                      id="jurisdiction-select"
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="ALL">All Jurisdictions</option>
                      <option value="US">United States (US)</option>
                      <option value="EP">European Patent Office (EP)</option>
                      <option value="JP">Japan (JP)</option>
                      <option value="WO">WIPO (WO)</option>
                      <option value="CN">China (CN)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="filing-date-from" className="block text-slate-700 mb-2 font-medium">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Filing Date From
                    </label>
                    <input
                      id="filing-date-from"
                      type="date"
                      value={filingDateFrom}
                      onChange={(e) => setFilingDateFrom(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="filing-date-to" className="block text-slate-700 mb-2 font-medium">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Filing Date To
                    </label>
                    <input
                      id="filing-date-to"
                      type="date"
                      value={filingDateTo}
                      onChange={(e) => setFilingDateTo(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="assignee-input" className="block text-slate-700 mb-2 font-medium">Assignee (optional)</label>
                    <input
                      id="assignee-input"
                      type="text"
                      placeholder="Company or organization name..."
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="inventor-input" className="block text-slate-700 mb-2 font-medium">Inventor (optional)</label>
                    <input
                      id="inventor-input"
                      type="text"
                      placeholder="Inventor name..."
                      value={inventor}
                      onChange={(e) => setInventor(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleSearch}
                    disabled={isLoading || !keyword.trim()}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Search Patents
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleClearAll}
                    disabled={isLoading}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            {hasSearched && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <h2 className="text-2xl text-blue-900 mb-6">
                  Search Results 
                  {searchResults.length > 0 && ` (${searchResults.length} found)`}
                </h2>
                
                {searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-2">
                      No patents matched the selected filters.
                    </p>
                    <p className="text-slate-400">
                      Try adjusting your search criteria or using different keywords.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((result, index) => (
                      <div key={result.publicationNumber} className="border border-slate-200 rounded-lg p-4 hover:bg-blue-50 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg text-blue-900 font-semibold">{result.publicationNumber}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {result.jurisdiction}
                          </span>
                        </div>
                        <p className="text-slate-700 mb-3 font-medium">
                          {result.title || "Untitled"}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">Assignees:</span>{" "}
                            {result.assignees && result.assignees.length > 0 
                              ? result.assignees.join(", ")
                              : <span className="text-slate-400 italic">Not disclosed</span>
                            }
                          </div>
                          <div>
                            <span className="font-medium">Inventors:</span>{" "}
                            {result.inventors && result.inventors.length > 0 
                              ? result.inventors.join(", ")
                              : <span className="text-slate-400 italic">Not disclosed</span>
                            }
                          </div>
                          <div>
                            <span className="font-medium">Publication Date:</span>{" "}
                            {result.publicationDate || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Jurisdiction:</span> {result.jurisdiction}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
