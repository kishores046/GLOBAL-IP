import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Users, Calendar, MapPin, Eye, Building, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { AnalystSidebar } from "../components/dashboard/AnalystSidebar";
import { useAuth } from "../context/AuthContext";
import { PatentDocument, TrademarkResultDto } from "../services/api";
import { mapTrademarkStatus } from "../utils/trademarkUtils";

type TabType = "patents" | "trademarks";

// Pagination constants
const ITEMS_PER_PAGE = 50;

// Helper function to extract trademark ID from various possible field names
const getTrademarkId = (trademark: TrademarkResultDto): string => {
  return trademark.trademarkId 
    || trademark.id 
    || trademark.applicationNumber 
    || trademark.registrationNumber
    || (trademark as any).tmNumber
    || (trademark as any).number
    || '';
};

export function UnifiedSearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  // Determine if user is an analyst
  const isAnalyst = hasRole(['ANALYST', 'ADMIN']) || location.pathname.includes("/analyst");
  
  // Get search results from navigation state
  const { patents = [], trademarks = [] } = location.state ?? {};
  
  console.log('[UnifiedSearchResultsPage] location.state:', location.state);
  console.log('[UnifiedSearchResultsPage] patents:', patents?.length || 0, 'trademarks:', trademarks?.length || 0);
  
  // Determine default active tab
  const getDefaultTab = (): TabType => {
    if (patents.length > 0) return "patents";
    if (trademarks.length > 0) return "trademarks";
    return "patents";
  };
  
  const [activeTab, setActiveTab] = useState<TabType>(getDefaultTab());
  const [currentPatentPage, setCurrentPatentPage] = useState(1);
  const [currentTrademarkPage, setCurrentTrademarkPage] = useState(1);

  // Calculate pagination for patents
  const totalPatentPages = Math.ceil(patents.length / ITEMS_PER_PAGE);
  const patentStartIndex = (currentPatentPage - 1) * ITEMS_PER_PAGE;
  const patentEndIndex = patentStartIndex + ITEMS_PER_PAGE;
  const currentPatents = patents.slice(patentStartIndex, patentEndIndex);

  // Calculate pagination for trademarks
  const totalTrademarkPages = Math.ceil(trademarks.length / ITEMS_PER_PAGE);
  const trademarkStartIndex = (currentTrademarkPage - 1) * ITEMS_PER_PAGE;
  const trademarkEndIndex = trademarkStartIndex + ITEMS_PER_PAGE;
  const currentTrademarks = trademarks.slice(trademarkStartIndex, trademarkEndIndex);

  // Reset to page 1 when switching tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "patents") {
      setCurrentPatentPage(1);
    } else {
      setCurrentTrademarkPage(1);
    }
  };

  // Redirect if no results ONLY on first render when state was explicitly empty
  useEffect(() => {
    if (location.state === null && patents.length === 0 && trademarks.length === 0) {
      console.log('[UnifiedSearchResultsPage] No results and no state, redirecting to search');
      navigate("/search");
    }
  }, [location.state, patents, trademarks, navigate]);

  const handleViewPatentDetails = (publicationNumber: string) => {
    navigate(`/patents/${publicationNumber}`);
  };

  const handleViewTrademarkDetails = (trademarkId: string) => {
    console.log("Navigating to trademark details with ID:", trademarkId);
    if (!trademarkId || trademarkId.trim() === '') {
      console.error("Empty trademark ID provided");
      alert("Cannot view trademark details: The trademark ID is missing from the search results. This may indicate an issue with the backend response.");
      return;
    }
    navigate(`/trademarks/${encodeURIComponent(trademarkId)}`);
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

  // Get jurisdiction badge styling
  const getJurisdictionBadge = (jurisdiction?: string) => {
    if (!jurisdiction) return { color: 'bg-slate-100', textColor: 'text-slate-700', label: 'Unknown' };
    
    const normalized = jurisdiction.toUpperCase().trim();
    const config: Record<string, { color: string; textColor: string; label: string }> = {
      'US': { color: 'bg-blue-100', textColor: 'text-blue-700', label: 'US' },
      'EP': { color: 'bg-green-100', textColor: 'text-green-700', label: 'EP' },
      'JP': { color: 'bg-orange-100', textColor: 'text-orange-700', label: 'JP' },
      'CN': { color: 'bg-red-100', textColor: 'text-red-700', label: 'CN' },
      'GB': { color: 'bg-purple-100', textColor: 'text-purple-700', label: 'GB' },
      'DE': { color: 'bg-indigo-100', textColor: 'text-indigo-700', label: 'DE' },
      'WO': { color: 'bg-cyan-100', textColor: 'text-cyan-700', label: 'WO' },
    };
    
    return config[normalized] || { color: 'bg-slate-100', textColor: 'text-slate-700', label: normalized };
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
        {isAnalyst ? <AnalystSidebar /> : <Sidebar />}
        
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
                onClick={() => handleTabChange("patents")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "patents"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-blue-50"
                }`}
              >
                Patents ({patents.length})
              </button>
              <button
                onClick={() => handleTabChange("trademarks")}
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
              <div className="space-y-6">
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
                  <>
                    {/* Results info */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-blue-200/50 shadow-sm">
                      <p className="text-slate-600">
                        Showing {patentStartIndex + 1}-{Math.min(patentEndIndex, patents.length)} of {patents.length} patents
                        {totalPatentPages > 1 && ` • Page ${currentPatentPage} of ${totalPatentPages}`}
                      </p>
                    </div>

                    {/* Patent cards */}
                    <div className="space-y-4">
                      {currentPatents.map((patent: PatentDocument, index: number) => (
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
                            {patent.title || "Untitled Patent"}
                          </h3>
                          <p className="text-slate-600 text-sm">
                            Patent ID: {patent.publicationNumber}
                          </p>
                        </div>
                        <span className={`px-4 py-2 ${getJurisdictionBadge(patent.jurisdiction).color} ${getJurisdictionBadge(patent.jurisdiction).textColor} rounded-full text-sm font-medium ml-4`}>
                          {getJurisdictionBadge(patent.jurisdiction).label}
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
                  ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPatentPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-blue-200/50 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          {/* Previous Button */}
                          <button
                            onClick={() => setCurrentPatentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPatentPage === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              currentPatentPage === 1
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>

                          {/* Page Numbers */}
                          <div className="flex items-center gap-2">
                            {Array.from({ length: totalPatentPages }, (_, i) => i + 1)
                              .filter(page => {
                                // Show first page, last page, current page, and pages around current
                                if (page === 1 || page === totalPatentPages) return true;
                                if (Math.abs(page - currentPatentPage) <= 2) return true;
                                return false;
                              })
                              .map((page, index, array) => {
                                // Add ellipsis if there's a gap
                                const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                                return (
                                  <div key={page} className="flex items-center gap-2">
                                    {showEllipsisBefore && (
                                      <span className="text-slate-400 px-2">...</span>
                                    )}
                                    <button
                                      onClick={() => setCurrentPatentPage(page)}
                                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                        currentPatentPage === page
                                          ? "bg-blue-600 text-white shadow-md"
                                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                      }`}
                                    >
                                      {page}
                                    </button>
                                  </div>
                                );
                              })}
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={() => setCurrentPatentPage(prev => Math.min(totalPatentPages, prev + 1))}
                            disabled={currentPatentPage === totalPatentPages}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              currentPatentPage === totalPatentPages
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            }`}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Trademark Results */}
            {activeTab === "trademarks" && (
              <div className="space-y-6">
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
                  <>
                    {/* Results info */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-blue-200/50 shadow-sm">
                      <p className="text-slate-600">
                        Showing {trademarkStartIndex + 1}-{Math.min(trademarkEndIndex, trademarks.length)} of {trademarks.length} trademarks
                        {totalTrademarkPages > 1 && ` • Page ${currentTrademarkPage} of ${totalTrademarkPages}`}
                      </p>
                    </div>

                    {/* Trademark cards */}
                    <div className="space-y-4">
                      {currentTrademarks.map((trademark: TrademarkResultDto, index: number) => {
                    // Handle different possible ID field names from backend
                    const id = getTrademarkId(trademark);
                    
                    // Map status to UI representation
                    const statusInfo = mapTrademarkStatus(trademark.statusCode, trademark.status);
                    
                    // Debug logging
                    if (index === 0) { // Only log first trademark to avoid console spam
                      console.log("Trademark object:", trademark);
                      console.log("Extracted ID:", id);
                      console.log("Available fields:", Object.keys(trademark));
                      console.log("Status mapping:", statusInfo);
                    }
                    
                    return (
                    <motion.div
                      key={id || index}
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
                          <p className="text-slate-600 text-sm">
                            ID: {id}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {(trademark.statusCode || trademark.status) && (
                            <span 
                              className={`px-4 py-2 rounded-full text-sm font-medium text-center ${statusInfo.badgeColor}`}
                              title={statusInfo.description}
                            >
                              {statusInfo.displayLabel}
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

                      {/* Action Button */}
                      <div className="flex justify-end pt-4 mt-4">
                        <button
                          onClick={() => handleViewTrademarkDetails(id)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  );
                  })}
                    </div>

                    {/* Pagination Controls */}
                    {totalTrademarkPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-blue-200/50 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          {/* Previous Button */}
                          <button
                            onClick={() => setCurrentTrademarkPage(prev => Math.max(1, prev - 1))}
                            disabled={currentTrademarkPage === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              currentTrademarkPage === 1
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>

                          {/* Page Numbers */}
                          <div className="flex items-center gap-2">
                            {Array.from({ length: totalTrademarkPages }, (_, i) => i + 1)
                              .filter(page => {
                                // Show first page, last page, current page, and pages around current
                                if (page === 1 || page === totalTrademarkPages) return true;
                                if (Math.abs(page - currentTrademarkPage) <= 2) return true;
                                return false;
                              })
                              .map((page, index, array) => {
                                // Add ellipsis if there's a gap
                                const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                                return (
                                  <div key={page} className="flex items-center gap-2">
                                    {showEllipsisBefore && (
                                      <span className="text-slate-400 px-2">...</span>
                                    )}
                                    <button
                                      onClick={() => setCurrentTrademarkPage(page)}
                                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                        currentTrademarkPage === page
                                          ? "bg-blue-600 text-white shadow-md"
                                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                      }`}
                                    >
                                      {page}
                                    </button>
                                  </div>
                                );
                              })}
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={() => setCurrentTrademarkPage(prev => Math.min(totalTrademarkPages, prev + 1))}
                            disabled={currentTrademarkPage === totalTrademarkPages}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              currentTrademarkPage === totalTrademarkPages
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            }`}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
