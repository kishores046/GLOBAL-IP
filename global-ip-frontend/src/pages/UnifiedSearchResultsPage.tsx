import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Users, Calendar, MapPin, Eye, Building, User } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PatentDocument, TrademarkResultDto } from "../services/api";

type TabType = "patents" | "trademarks";

export function UnifiedSearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search results from navigation state
  const { patents = [], trademarks = [] } = location.state ?? {};
  
  // Determine default active tab
  const getDefaultTab = (): TabType => {
    if (patents.length > 0) return "patents";
    if (trademarks.length > 0) return "trademarks";
    return "patents";
  };
  
  const [activeTab, setActiveTab] = useState<TabType>(getDefaultTab());

  // Redirect if no results
  useEffect(() => {
    if (patents.length === 0 && trademarks.length === 0) {
      navigate("/search");
    }
  }, [patents, trademarks, navigate]);

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

  const formatList = (items?: string[], max: number = 2) => {
    if (!items || items.length === 0) {
      return <span className="text-slate-400 italic">Not disclosed</span>;
    }
    
    if (items.length <= max) {
      return items.join(", ");
    }
    
    const displayed = items.slice(0, max);
    const remaining = items.length - max;
    return `${displayed.join(", ")} +${remaining} more`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold text-blue-900 mb-2">Search Results</h1>
              <p className="text-slate-600">
                Unified search results across patents and trademarks
              </p>
            </motion.div>

            {/* Tab Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-2 border border-blue-200/50 shadow-lg inline-flex gap-2"
            >
              <button
                onClick={() => setActiveTab("patents")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "patents"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-blue-50"
                }`}
              >
                Patents ({patents.length})
              </button>
              <button
                onClick={() => setActiveTab("trademarks")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "trademarks"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-blue-50"
                }`}
              >
                Trademarks ({trademarks.length})
              </button>
            </motion.div>

            {/* Patent Results */}
            {activeTab === "patents" && (
              <div className="space-y-4">
                {patents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-12 border border-blue-200/50 shadow-lg text-center"
                  >
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">No patents found</p>
                    <p className="text-slate-400 mt-2">Try adjusting your search criteria</p>
                  </motion.div>
                ) : (
                  patents.map((patent: PatentDocument, index: number) => (
                    <motion.div
                      key={patent.publicationNumber}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-lg hover:shadow-xl"
                    >
                      {/* Header Row */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-blue-900 mb-2">
                            {patent.publicationNumber}
                          </h3>
                          {patent.title && (
                            <p className="text-slate-700 text-lg font-medium mb-3">
                              {patent.title}
                            </p>
                          )}
                        </div>
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium ml-4">
                          {patent.jurisdiction}
                        </span>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Filing Date */}
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">Filing Date</p>
                            <p className="text-slate-900 font-medium">
                              {formatDate(patent.filingDate)}
                              {patent.grantDate && ` → ${formatDate(patent.grantDate)}`}
                            </p>
                          </div>
                        </div>

                        {/* Assignees */}
                        <div className="flex items-start gap-3">
                          <Building className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">Assignees</p>
                            <p className="text-slate-900">{formatList(patent.assignees)}</p>
                          </div>
                        </div>

                        {/* Inventors */}
                        <div className="flex items-start gap-3 md:col-span-2">
                          <User className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">Inventors</p>
                            <p className="text-slate-900">{formatList(patent.inventors)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end pt-4 border-t border-blue-100">
                        <button
                          onClick={() => handleViewPatentDetails(patent.publicationNumber)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Trademark Results */}
            {activeTab === "trademarks" && (
              <div className="space-y-4">
                {trademarks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-12 border border-blue-200/50 shadow-lg text-center"
                  >
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">No trademarks found</p>
                    <p className="text-slate-400 mt-2">Try adjusting your search criteria</p>
                  </motion.div>
                ) : (
                  trademarks.map((trademark: TrademarkResultDto, index: number) => (
                    <motion.div
                      key={trademark.trademarkId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-lg"
                    >
                      {/* Header Row */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-blue-900 mb-2">
                            {trademark.markName}
                          </h3>
                          <p className="text-slate-600">
                            ID: {trademark.trademarkId}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {trademark.jurisdiction}
                          </span>
                          {trademark.status && (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              {trademark.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Filing Date */}
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">Filing Date</p>
                            <p className="text-slate-900 font-medium">
                              {formatDate(trademark.filingDate)}
                            </p>
                          </div>
                        </div>

                        {/* State */}
                        {trademark.state && (
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">State</p>
                              <p className="text-slate-900 font-medium">{trademark.state}</p>
                            </div>
                          </div>
                        )}

                        {/* Owners */}
                        {trademark.owners && trademark.owners.length > 0 && (
                          <div className="flex items-start gap-3 md:col-span-2">
                            <Users className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">Owners</p>
                              <p className="text-slate-900">{formatList(trademark.owners)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
