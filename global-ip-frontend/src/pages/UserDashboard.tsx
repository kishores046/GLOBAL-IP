import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { StatCard } from "../components/dashboard/StatCard";
import { FileText, Award, Bell, Eye, X, Shield, ArrowRight, Star, Trash2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../routes/routeConfig";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { bookmarkAPI, patentDetailAPI, trademarkDetailAPI, BookmarkedPatent, BookmarkedTrademark, dashboardAPI } from "../services/api";
import { trackingApi } from "../services/trackingAPI";

export function UserDashboard() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showSetAlertModal, setShowSetAlertModal] = useState(false);
  const [showViewReportsModal, setShowViewReportsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [bookmarkedPatents, setBookmarkedPatents] = useState<BookmarkedPatent[]>([]);
  const [bookmarkedTrademarks, setBookmarkedTrademarks] = useState<BookmarkedTrademark[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [searchCount, setSearchCount] = useState<number>(0);
  const [loadingSearchCount, setLoadingSearchCount] = useState(true);
  const [trackedTotal, setTrackedTotal] = useState<number | null>(null);
  const [loadingTrackedTotal, setLoadingTrackedTotal] = useState<boolean>(true);
  
  // Load bookmarked patents and trademarks
  useEffect(() => {
    loadBookmarks();
    loadSearchCount();
    loadTrackedTotal();
  }, []);
  
  const loadSearchCount = async () => {
    try {
      const count = await dashboardAPI.getUserSearchCount();
      setSearchCount(count);
    } catch (error) {
      console.error("Error loading search count:", error);
    } finally {
      setLoadingSearchCount(false);
    }
  };

  const loadTrackedTotal = async () => {
    try {
      const total = await trackingApi.getTotalTrackedPatents();
      setTrackedTotal(total ?? 0);
    } catch (error) {
      console.error("Error loading tracked total:", error);
      setTrackedTotal(0);
    } finally {
      setLoadingTrackedTotal(false);
    }
  };
  
  const loadBookmarks = async () => {
    try {
      const [patents, trademarks] = await Promise.all([
        bookmarkAPI.getBookmarkedPatents(),
        bookmarkAPI.getBookmarkedTrademarks()
      ]);
      setBookmarkedPatents(patents);
      setBookmarkedTrademarks(trademarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const renderBookmarksContent = () => {
    if (loadingBookmarks) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading bookmarks...</p>
        </div>
      );
    }

    if (bookmarkedPatents.length === 0) {
      return (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-2">No bookmarked patents yet</p>
          <p className="text-slate-400">
            Search for patents and bookmark them to see them here
          </p>
        </div>
      );
    }

    return renderPatentsList();
  };

  const getBookmarksContent = () => {
    if (loadingBookmarks) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading bookmarks...</p>
        </div>
      );
    }

    if (bookmarkedPatents.length === 0) {
      return (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-2">No bookmarked patents yet</p>
          <p className="text-slate-400">
            Search for patents and bookmark them to see them here
          </p>
        </div>
      );
    }

    return renderPatentsList();
  };

  const renderBookmarksSection = () => {
    return getBookmarksContent();
  };

  const renderPatentsList = () => {
    return (
      <div className="space-y-4">
        {bookmarkedPatents.map((patent) => (
          <div
            key={patent.publicationNumber}
            className="border border-blue-200 rounded-xl p-4 hover:bg-blue-50 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  {patent.publicationNumber}
                </h4>
                {patent.title && (
                  <p className="text-slate-700 mb-3">{patent.title}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {patent.jurisdiction}
                    </span>
                  </div>
                  {patent.filingDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Filed: {formatDate(patent.filingDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleViewPatentDetails(patent.publicationNumber)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleRemoveBookmark(patent.publicationNumber)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
        alert("Failed to remove bookmark. Please try again.");
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
  
  // Analytics data
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="User" />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Overview of your IP intelligence activity</p>
            </div>

            {/* Hero Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Search Queries"
                value={loadingSearchCount ? "..." : searchCount.toString()}
                icon={FileText}
                gradient="from-blue-500 to-blue-600"
                delay={0}
              />
              <StatCard
                title="Tracked Patents"
                value={loadingTrackedTotal ? "..." : String(trackedTotal ?? 0)}
                icon={Award}
                gradient="from-blue-500 to-blue-600"
                delay={100}
              />
              <StatCard
                title="Live Alerts"
                value="0"
                icon={Bell}
                gradient="from-blue-500 to-blue-600"
                delay={200}
              />
            </div>

            {/* Quick Actions Card */}
            {/* Only show admin request banner if user doesn't have admin role */}
            {!hasRole(ROLES.ADMIN) && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 border border-blue-400 shadow-xl text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Need Admin Access?</h3>
                      <p className="text-blue-100">Request elevated permissions to access advanced features</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/request-admin')}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    Request Admin Access
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Bookmarked Patents Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl text-slate-900 mb-1 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    My Bookmarks
                  </h3>
                  <p className="text-slate-600">Patents you've saved for later</p>
                </div>
              </div>

              {loadingBookmarks ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading bookmarks...</p>
                </div>
              ) : bookmarkedPatents.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg mb-2">No bookmarked patents yet</p>
                  <p className="text-slate-400">
                    Search for patents and bookmark them to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookmarkedPatents.map((patent) => (
                    <div
                      key={patent.publicationNumber}
                      className="border border-blue-200 rounded-xl p-4 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-blue-900 mb-2">
                            {patent.publicationNumber}
                          </h4>
                          {patent.title && (
                            <p className="text-slate-700 mb-3">{patent.title}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {patent.jurisdiction}
                              </span>
                            </div>
                            {patent.filingDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>Filed: {formatDate(patent.filingDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleViewPatentDetails(patent.publicationNumber)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleRemoveBookmark(patent.publicationNumber)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                            title="Remove bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarked Patents Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl text-slate-900 mb-1 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    My Bookmarks
                  </h3>
                  <p className="text-slate-600">Patents you've saved for later</p>
                </div>
              </div>

              {loadingBookmarks ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading bookmarks...</p>
                </div>
              ) : bookmarkedPatents.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg mb-2">No bookmarked patents yet</p>
                  <p className="text-slate-400">
                    Search for patents and bookmark them to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookmarkedPatents.map((patent) => (
                    <div
                      key={patent.publicationNumber}
                      className="border border-blue-200 rounded-xl p-4 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-blue-900 mb-2">
                            {patent.publicationNumber}
                          </h4>
                          {patent.title && (
                            <p className="text-slate-700 mb-3">{patent.title}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {patent.jurisdiction}
                              </span>
                            </div>
                            {patent.filingDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>Filed: {formatDate(patent.filingDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleViewPatentDetails(patent.publicationNumber)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleRemoveBookmark(patent.publicationNumber)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                            title="Remove bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarked Trademarks Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl text-slate-900 mb-1 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    Bookmarked Trademarks
                  </h3>
                  <p className="text-slate-600">Trademarks you've saved for later</p>
                </div>
              </div>

              {loadingBookmarks ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading bookmarks...</p>
                </div>
              ) : bookmarkedTrademarks.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg mb-2">No bookmarked trademarks yet</p>
                  <p className="text-slate-400">
                    Search for trademarks and bookmark them to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookmarkedTrademarks.map((trademark) => (
                    <div
                      key={trademark.trademarkId}
                      className="border border-blue-200 rounded-xl p-4 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-blue-900 mb-2">
                            {trademark.markName || trademark.trademarkId}
                          </h4>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            {trademark.jurisdiction && (
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {trademark.jurisdiction}
                                </span>
                              </div>
                            )}
                            {trademark.statusCode && (
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  {trademark.statusCode}
                                </span>
                              </div>
                            )}
                            {trademark.filingDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>Filed: {formatDate(trademark.filingDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleViewTrademarkDetails(trademark.trademarkId)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleRemoveTrademarkBookmark(trademark.trademarkId)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                            title="Remove bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">Add New Asset</h3>
              <button onClick={() => setShowAddAssetModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-700 mb-2 block">Asset Type</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="">Select type</option>
                  <option value="patent">Patent</option>
                  <option value="trademark">Trademark</option>
                  <option value="design">Design</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Asset ID or Number</label>
                <input
                  type="text"
                  placeholder="e.g., US11234567B2"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Jurisdiction</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="">Select jurisdiction</option>
                  <option value="USPTO">USPTO</option>
                  <option value="EPO">EPO</option>
                  <option value="WIPO">WIPO</option>
                  <option value="JPO">JPO</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Notes (Optional)</label>
                <textarea
                  placeholder="Add any notes about this asset..."
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 h-24 resize-none"
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Add Asset
                </button>
                <button 
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set Alert Modal */}
      {showSetAlertModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">Set New Alert</h3>
              <button onClick={() => setShowSetAlertModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-700 mb-2 block">Alert Type</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="">Select alert type</option>
                  <option value="status">Status Change</option>
                  <option value="deadline">Legal Deadline</option>
                  <option value="opposition">Opposition Filed</option>
                  <option value="citation">New Citation</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Asset ID</label>
                <input
                  type="text"
                  placeholder="Enter asset ID to track"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Notification Method</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    <span className="text-slate-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-700">In-App Notification</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-slate-700 mb-2 block">Frequency</label>
                <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Create Alert
                </button>
                <button 
                  onClick={() => setShowSetAlertModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Reports Modal */}
      {showViewReportsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">Generate Report</h3>
              <button onClick={() => setShowViewReportsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer hover:bg-blue-50">
                  <h4 className="text-slate-900 mb-2">Portfolio Summary</h4>
                  <p className="text-sm text-slate-600">Complete overview of all tracked assets</p>
                </div>
                
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer hover:bg-blue-50">
                  <h4 className="text-slate-900 mb-2">Filing Analysis</h4>
                  <p className="text-sm text-slate-600">Detailed filing trends and statistics</p>
                </div>
                
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer hover:bg-blue-50">
                  <h4 className="text-slate-900 mb-2">Status Report</h4>
                  <p className="text-sm text-slate-600">Current legal status of all assets</p>
                </div>
                
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer hover:bg-blue-50">
                  <h4 className="text-slate-900 mb-2">Alert History</h4>
                  <p className="text-sm text-slate-600">Past alerts and notifications</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-slate-700 mb-2 block">Date Range</label>
                  <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-slate-700 mb-2 block">Format</label>
                  <select className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel (XLSX)</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Generate Report
                </button>
                <button 
                  onClick={() => setShowViewReportsModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-6xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">IP Analytics Dashboard</h3>
              <button onClick={() => setShowAnalyticsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Filings by Year - Bar Chart */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-slate-900 mb-4">Filings by Year</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filingsByYearData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="patents" fill="#3b82f6" name="Patents" />
                    <Bar dataKey="trademarks" fill="#06b6d4" name="Trademarks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trends - Line Chart */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-slate-900 mb-4">Monthly Filing &amp; Grant Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="filings" stroke="#3b82f6" strokeWidth={3} name="Filings" />
                    <Line type="monotone" dataKey="grants" stroke="#10b981" strokeWidth={3} name="Grants" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Grid of Pie Chart and Area Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Jurisdiction Distribution - Pie Chart */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-slate-900 mb-4">Distribution by Jurisdiction</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={jurisdictionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {jurisdictionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Distribution - Bar Chart */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-slate-900 mb-4">Status Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusDistributionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis type="number" stroke="#64748b" />
                      <YAxis dataKey="status" type="category" stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Chart */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-slate-900 mb-4">Cumulative Growth Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={filingsByYearData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="patents" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Patents" />
                    <Area type="monotone" dataKey="trademarks" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} name="Trademarks" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="w-full px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}