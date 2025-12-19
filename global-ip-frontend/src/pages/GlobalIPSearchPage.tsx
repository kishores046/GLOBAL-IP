import { useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { motion } from "motion/react";
import { patentSearchAPI, PatentSearchResult } from "../services/api";

export function GlobalIPSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<PatentSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    // Validation: keyword is required
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setError("Please enter a keyword to search");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(false);

    try {
      const results = await patentSearchAPI.quickSearch(trimmedKeyword);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 relative overflow-hidden">
      <div className="relative z-10 flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl text-blue-900 mb-2">Search</h1>
              <p className="text-slate-600">Search for patents and trademarks across multiple jurisdictions</p>
            </motion.div>

            {/* Quick IP Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl mb-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl text-slate-900 mb-1">Quick IP Search</h2>
                <p className="text-slate-600">
                  Fast keyword-based patent search across all jurisdictions
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Search Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter keyword (e.g., artificial intelligence, battery technology)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !keyword.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Search Results Section */}
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="mb-6">
                  <h2 className="text-2xl text-slate-900 mb-1">Search Results</h2>
                  <p className="text-slate-600">
                    {searchResults.length === 0 
                      ? "No patents found for the given keyword." 
                      : (() => {
                          const resultText = searchResults.length === 1 ? 'result' : 'results';
                          return `Found ${searchResults.length} ${resultText}`;
                        })()
                    }
                  </p>
                </div>

                {/* Results Table */}
                {searchResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-blue-200">
                          <th className="text-left py-4 px-4 text-slate-700">Publication Number</th>
                          <th className="text-left py-4 px-4 text-slate-700">Title</th>
                          <th className="text-left py-4 px-4 text-slate-700">Assignees</th>
                          <th className="text-left py-4 px-4 text-slate-700">Jurisdiction</th>
                          <th className="text-left py-4 px-4 text-slate-700">Publication Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((result, index) => (
                          <motion.tr
                            key={result.publicationNumber}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="border-b border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer"
                          >
                            <td className="py-4 px-4 text-slate-900 font-medium">
                              {result.publicationNumber}
                            </td>
                            <td className="py-4 px-4 text-slate-900">
                              {result.title || "Untitled"}
                            </td>
                            <td className="py-4 px-4 text-slate-700">
                              {result.assignees && result.assignees.length > 0 
                                ? result.assignees.join(", ")
                                : <span className="text-slate-400 italic">Not disclosed</span>
                              }
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                {result.jurisdiction}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-700">
                              {result.publicationDate || "N/A"}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">
                      No patents found for the given keyword.
                    </p>
                    <p className="text-slate-400 mt-2">
                      Try using different or more general search terms.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}