import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Search, Network, Flag, FileText, Star, Eye, Trash2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookmarkAPI, patentDetailAPI, trademarkDetailAPI, BookmarkedPatent, BookmarkedTrademark, dashboardAPI } from "../services/api";

export function AnalystDashboard() {
  const navigate = useNavigate();
  const [bookmarkedPatents, setBookmarkedPatents] = useState<BookmarkedPatent[]>([]);
  const [bookmarkedTrademarks, setBookmarkedTrademarks] = useState<BookmarkedTrademark[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [searchCount, setSearchCount] = useState(0);
  const [loadingSearchCount, setLoadingSearchCount] = useState(true);
  
  useEffect(() => {
    loadBookmarks();
    loadSearchCount();
  }, []);
  
  const loadSearchCount = async () => {
    try {
      const count = await dashboardAPI.getAnalystSearchCount();
      setSearchCount(count);
    } catch (error) {
      console.error("Error loading search count:", error);
      setSearchCount(0);
    } finally {
      setLoadingSearchCount(false);
    }
  };
  
  const loadBookmarks = async () => {
    try {
      const [patents, trademarks] = await Promise.all([
        bookmarkAPI.getBookmarkedPatents(),
        bookmarkAPI.getBookmarkedTrademarks(),
      ]);
      console.log("Loaded bookmarked trademarks:", trademarks);
      if (trademarks.length > 0) {
        console.log("First bookmarked trademark:", trademarks[0]);
        console.log("Trademark fields:", Object.keys(trademarks[0]));
      }
      setBookmarkedPatents(patents);
      setBookmarkedTrademarks(trademarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoadingBookmarks(false);
    }
  };
  
  const handleRemoveBookmark = async (publicationNumber: string) => {
    try {
      await patentDetailAPI.unbookmark(publicationNumber);
      setBookmarkedPatents(bookmarkedPatents.filter(p => p.publicationNumber !== publicationNumber));
    } catch (error) {
      console.error("Error removing bookmark:", error);
      alert("Failed to remove bookmark. Please try again.");
    }
  };
  
  const handleViewPatentDetails = (publicationNumber: string) => {
    navigate(`/patents/${publicationNumber}`);
  };
  
  const handleViewTrademarkDetails = (trademarkId: string) => {
    navigate(`/trademarks/${trademarkId}`);
  };
  
  const handleRemoveTrademarkBookmark = async (trademarkId: string) => {
    console.log("Attempting to remove bookmark for trademark ID:", trademarkId);
    
    if (!trademarkId || trademarkId === 'undefined') {
      console.error("Invalid trademark ID provided:", trademarkId);
      alert("Cannot remove bookmark: Invalid trademark ID");
      return;
    }
    
    try {
      await trademarkDetailAPI.unbookmark(trademarkId);
      setBookmarkedTrademarks(bookmarkedTrademarks.filter(t => t.trademarkId !== trademarkId));
    } catch (error: any) {
      console.error("Error removing trademark bookmark:", error);
      
      // Check for specific backend error messages
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      
      if (errorMessage?.includes('EntityManager') || errorMessage?.includes('transaction')) {
        alert("Backend transaction error. Please contact the administrator to add @Transactional annotation to the unbookmark method.");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to remove this bookmark.");
      } else {
        alert("Failed to remove trademark bookmark. Please try again.");
      }
    }
  };
  
  const formatDate = (date?: string) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Analyst Dashboard</h1>
              <p className="text-slate-600">Overview of your IP analysis activity</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Queries */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">
                  {loadingSearchCount ? "..." : searchCount}
                </div>
                <div className="text-slate-600">Search Queries</div>
              </div>

              {/* Visualization Graphs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">0</div>
                <div className="text-slate-600">Visualization Graphs</div>
              </div>

              {/* Tracked Competitors */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">0</div>
                <div className="text-slate-600">Tracked Competitors</div>
              </div>

              {/* Exports This Week */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">0</div>
                <div className="text-slate-600">Exports This Week</div>
              </div>
            </div>

            {/* Bookmarked Patents */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
              <h2 className="text-2xl text-blue-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Bookmarked Patents
              </h2>

              {loadingBookmarks ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-slate-600">Loading bookmarks...</div>
                </div>
              ) : bookmarkedPatents.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg mb-2">No Bookmarked Patents</p>
                  <p className="text-slate-400">Patents you bookmark will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedPatents.map((patent) => (
                    <div
                      key={patent.publicationNumber}
                      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                            {patent.title || "Untitled Patent"}
                          </h3>
                          <p className="text-sm text-slate-600 font-mono">
                            {patent.publicationNumber}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveBookmark(patent.publicationNumber)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        {patent.assignee && (
                          <div className="text-sm">
                            <span className="text-slate-500">Assignee:</span>{" "}
                            <span className="text-slate-700">{patent.assignee}</span>
                          </div>
                        )}
                        {patent.publicationDate && (
                          <div className="text-sm">
                            <span className="text-slate-500">Published:</span>{" "}
                            <span className="text-slate-700">{formatDate(patent.publicationDate)}</span>
                          </div>
                        )}
                        {patent.bookmarkedAt && (
                          <div className="text-sm flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>Bookmarked {formatDate(patent.bookmarkedAt)}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleViewPatentDetails(patent.publicationNumber)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarked Trademarks Section */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-blue-600" />
                  Bookmarked Trademarks
                </h2>
                <span className="text-sm text-slate-500">
                  {bookmarkedTrademarks.length} trademark{bookmarkedTrademarks.length !== 1 ? 's' : ''}
                </span>
              </div>

              {loadingBookmarks ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600 mt-4">Loading bookmarks...</p>
                </div>
              ) : bookmarkedTrademarks.length === 0 ? (
                <div className="text-center py-12">
                  <Flag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">No bookmarked trademarks yet</p>
                  <p className="text-sm text-slate-500">Bookmark trademarks to track them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedTrademarks.map((trademark) => (
                    <div
                      key={trademark.trademarkId}
                      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                            {trademark.markName || "Unnamed Trademark"}
                          </h3>
                          <p className="text-sm text-slate-600 font-mono">
                            {trademark.trademarkId}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveTrademarkBookmark(trademark.trademarkId)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        {trademark.jurisdiction && (
                          <div className="text-sm">
                            <span className="text-slate-500">Jurisdiction:</span>{" "}
                            <span className="text-slate-700">{trademark.jurisdiction}</span>
                          </div>
                        )}
                        {trademark.statusCode && (
                          <div className="text-sm">
                            <span className="text-slate-500">Status:</span>{" "}
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {trademark.statusCode}
                            </span>
                          </div>
                        )}
                        {trademark.filingDate && (
                          <div className="text-sm">
                            <span className="text-slate-500">Filed:</span>{" "}
                            <span className="text-slate-700">{formatDate(trademark.filingDate)}</span>
                          </div>
                        )}
                        {trademark.bookmarkedAt && (
                          <div className="text-sm flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>Bookmarked {formatDate(trademark.bookmarkedAt)}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleViewTrademarkDetails(trademark.trademarkId)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}