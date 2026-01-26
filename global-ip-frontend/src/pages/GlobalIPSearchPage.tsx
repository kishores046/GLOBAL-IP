import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { AnalystSidebar } from "../components/dashboard/AnalystSidebar";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { unifiedSearchAPI } from "../services/api";
import { getSortedJurisdictions, getJurisdictionLabel } from "../constants/jurisdictions";

export function GlobalIPSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();
  
  // Determine if user is an analyst
  const isAnalyst = hasRole(['ANALYST', 'ADMIN']) || location.pathname.includes("/analyst");
  const [keyword, setKeyword] = useState("");
  const [jurisdiction, setJurisdiction] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use canonical jurisdiction lists from constants so user search
  // mirrors the analyst advanced search without missing entries.
  const sorted = getSortedJurisdictions();

  const handleSearch = async () => {
    // Validation: keyword is required
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setError("Keyword is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use unified search API with jurisdiction filter
      const response = await unifiedSearchAPI.search({ 
        keyword: trimmedKeyword,
        jurisdiction: jurisdiction !== "ALL" ? jurisdiction : undefined,
      });
      
      console.log("Search response:", response);
      console.log("Trademarks in response:", response.trademarks);
      if (response.trademarks && response.trademarks.length > 0) {
        console.log("First trademark object:", response.trademarks[0]);
        console.log("First trademark keys:", Object.keys(response.trademarks[0]));
      }
      
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 relative overflow-hidden">
      <div className="relative z-10 flex">
        {isAnalyst ? <AnalystSidebar /> : <Sidebar />}
        
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
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  disabled={isLoading}
                  className="px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 disabled:opacity-50"
                >
                  <option value="ALL">🌍 All Jurisdictions</option>
                  <optgroup label="━━━ Regional Patent Offices ━━━">
                    {sorted.regionalOffices.map((code) => (
                      <option key={code} value={code}>
                        🌐 {getJurisdictionLabel(code)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="━━━ Individual Countries ━━━">
                    {sorted.individualCountries.map((code) => (
                      <option key={code} value={code}>
                        🏛️ {getJurisdictionLabel(code)}
                      </option>
                    ))}
                  </optgroup>
                </select>
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
          </div>
        </main>
      </div>
    </div>
  );
}