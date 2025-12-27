import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Search, Network, Flag, FileText, Star, Eye, Trash2, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookmarkAPI, patentDetailAPI, BookmarkedPatent } from "../services/api";

export function AnalystDashboard() {
  const navigate = useNavigate();
  const [bookmarkedPatents, setBookmarkedPatents] = useState<BookmarkedPatent[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [searchCount, setSearchCount] = useState(0);
  
  useEffect(() => {
    loadBookmarks();
    loadSearchCount();
  }, []);
  
  const loadSearchCount = () => {
    try {
      const count = parseInt(localStorage.getItem('searchQueryCount') || '0', 10);
      setSearchCount(count);
    } catch (error) {
      console.error("Error loading search count:", error);
      setSearchCount(0);
    }
  };
  
  const loadBookmarks = async () => {
    try {
      const bookmarks = await bookmarkAPI.getBookmarkedPatents();
      setBookmarkedPatents(bookmarks);
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
  // Mock data for the chart
  const chartData = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 145 },
    { month: "Mar", value: 135 },
    { month: "Apr", value: 160 },
    { month: "May", value: 175 },
    { month: "Jun", value: 190 },
    { month: "Jul", value: 180 },
    { month: "Aug", value: 210 },
    { month: "Sep", value: 220 },
    { month: "Oct", value: 200 },
    { month: "Nov", value: 240 },
    { month: "Dec", value: 260 },
  ];

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
                <div className="text-4xl text-blue-900 mb-2">{searchCount}</div>
                <div className="text-slate-600">Search Queries</div>
              </div>

              {/* Visualization Graphs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">16</div>
                <div className="text-slate-600">Visualization Graphs</div>
              </div>

              {/* Tracked Competitors */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">25</div>
                <div className="text-slate-600">Tracked Competitors</div>
              </div>

              {/* Exports This Week */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl text-blue-900 mb-2">8</div>
                <div className="text-slate-600">Exports This Week</div>
              </div>
            </div>

            {/* Competitor Portfolio Trends Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
              <h2 className="text-2xl text-blue-900 mb-6">Competitor Portfolio Trends</h2>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      domain={[0, 300]}
                      ticks={[0, 100, 200, 300]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
          </div>
        </main>
      </div>
    </div>
  );
}