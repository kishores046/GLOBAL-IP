import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Star,
  Calendar,
  Building,
  FileText,
  Tag,
  Loader2,
  Copy,
  Check,
  Radio,
} from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { AnalystSidebar } from "../components/dashboard/AnalystSidebar";
import { useAuth } from "../context/AuthContext";
import { trademarkDetailAPI, GlobalTrademarkDetailDto } from "../services/api";
import { mapTrademarkStatus } from "../utils/trademarkUtils";
import { TrackingModal } from "../components/tracking/TrackingModal";

export function TrademarkDetailPage() {
  const { trademarkId } = useParams<{ trademarkId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();
  
  // Determine if user is an analyst
  const isAnalyst = hasRole(['ANALYST', 'ADMIN']) || location.pathname.includes("/analyst");

  const [trademark, setTrademark] = useState<GlobalTrademarkDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    loadTrademarkDetails();
  }, [trademarkId]);

  const handleLoadError = (err: any) => {
    console.error("Error loading trademark details:", err);
    const message = err.response?.status === 404
      ? "Trademark details are available only for items returned in search results."
      : "Failed to load trademark details. Please try again.";
    setError(message);
  };

  const loadTrademarkDetails = async () => {
    console.log("Loading trademark details for ID:", trademarkId);
    
    if (!trademarkId || trademarkId === 'undefined' || trademarkId.trim() === '') {
      console.error("Invalid trademark ID in URL params:", trademarkId);
      setError("Invalid trademark ID. Please return to search results and try again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching trademark from API:", `/trademarks/${trademarkId}`);
      const data = await trademarkDetailAPI.getDetail(trademarkId);
      console.log("Trademark data received:", data);
      setTrademark(data);
    } catch (err: any) {
      console.error("Error loading trademark:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      handleLoadError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookmark = async (bookmarked: boolean) => {
    // Backend returns 'id' field, but we may have normalized it to 'trademarkId'
    const tmId = trademark?.trademarkId || trademark?.id;
    
    if (!tmId) {
      throw new Error("Trademark ID is missing");
    }
    
    const source = trademark.source || "TMVIEW";
    console.log("Updating bookmark:", { trademarkId: tmId, bookmarked, source });
    
    if (bookmarked) {
      console.log("Removing bookmark for:", tmId);
      await trademarkDetailAPI.unbookmark(tmId);
    } else {
      console.log("Adding bookmark for:", tmId, "with source:", source);
      await trademarkDetailAPI.bookmark(tmId, source);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!trademark) return;

    setIsBookmarking(true);
    try {
      console.log("Toggle bookmark - Current state:", trademark.bookmarked);
      await updateBookmark(trademark.bookmarked);
      setTrademark({ ...trademark, bookmarked: !trademark.bookmarked });
      console.log("Bookmark toggled successfully");
    } catch (err: any) {
      console.error("Error toggling bookmark:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      const errorMessage = err.response?.data?.message || "Failed to update bookmark. Please try again.";
      alert(errorMessage);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleCopy = () => {
    if (trademark) {
      const tmId = trademark.trademarkId || trademark.id || '';
      navigator.clipboard.writeText(tmId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTrackingSuccess = () => {
    setIsTracking(true);
    // Could add a toast notification here
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading trademark details...</p>
        </div>
      </div>
    );
  }

  if (error || !trademark) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="flex">
          {isAnalyst ? <AnalystSidebar /> : <Sidebar />}
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Results
              </button>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-12 border border-red-200 shadow-lg text-center">
                <FileText className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Error Loading Trademark</h2>
                <p className="text-slate-600">{error}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        {isAnalyst ? <AnalystSidebar /> : <Sidebar />}
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Results
            </button>

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-blue-900 mb-3">
                    {trademark.markName || "Trademark Details"}
                  </h1>
                  
                  {/* Trademark ID with Copy */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl text-slate-700 font-mono font-medium">
                      {trademark.trademarkId || trademark.id}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Copy trademark ID"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {trademark.jurisdiction && (
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {trademark.jurisdiction}
                      </span>
                    )}
                    {trademark.statusCode && (() => {
                      const statusInfo = mapTrademarkStatus(trademark.statusCode, trademark.statusCode);
                      return (
                        <span 
                          className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.badgeColor}`}
                          title={statusInfo.description}
                        >
                          {statusInfo.displayLabel}
                        </span>
                      );
                    })()}
                    {trademark.source && (
                      <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {trademark.source}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Track Trademark Button */}
                  <button
                    onClick={() => setShowTrackingModal(true)}
                    disabled={isTracking}
                    className={`px-4 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-medium text-sm flex items-center gap-2 ${
                      isTracking
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    } disabled:opacity-50`}
                    title="Track this trademark's lifecycle"
                  >
                    <Radio className="w-4 h-4" />
                    {isTracking ? "Tracking Enabled" : "Track Trademark"}
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={handleBookmarkToggle}
                    disabled={isBookmarking}
                    className={`p-4 rounded-xl transition-all shadow-md hover:shadow-lg ${
                      trademark.bookmarked
                        ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    } disabled:opacity-50`}
                    title={trademark.bookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    {isBookmarking ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Star
                        className={`w-6 h-6 ${trademark.bookmarked ? "fill-current" : ""}`}
                      />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Metadata Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
            >
              <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Metadata
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Filing Date</p>
                  <p className="text-slate-900 font-medium">{formatDate(trademark.filingDate)}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Status</p>
                  <p className="text-slate-900 font-medium">
                    {trademark.statusCode ? (() => {
                      const statusInfo = mapTrademarkStatus(trademark.statusCode, trademark.statusCode);
                      return (
                        <span 
                          className={`inline-block px-3 py-1 rounded-full text-sm ${statusInfo.badgeColor}`}
                          title={statusInfo.description}
                        >
                          {statusInfo.displayLabel}
                        </span>
                      );
                    })() : "—"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Owners Section */}
            {trademark.owners && trademark.owners.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
              >
                <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
                  <Building className="w-6 h-6" />
                  Owners
                </h2>

                <ul className="space-y-2">
                  {trademark.owners.map((owner, index) => (
                    <li key={index} className="text-slate-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {owner}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* International Classes Section */}
            {trademark.internationalClasses && trademark.internationalClasses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
              >
                <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
                  <Tag className="w-6 h-6" />
                  International Classes
                </h2>

                <div className="flex flex-wrap gap-2">
                  {trademark.internationalClasses.map((cls, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-mono border border-blue-200"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Goods and Services Section */}
            {trademark.goodsAndServices && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
              >
                <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Goods and Services
                </h2>

                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {trademark.goodsAndServices}
                </p>
              </motion.div>
            )}

            {/* Tracking Modal */}
            <TrackingModal
              isOpen={showTrackingModal}
              onClose={() => setShowTrackingModal(false)}
              type="TRADEMARK"
              externalId={trademark.trademarkId || trademark.id || ''}
              title={trademark.mark}
              jurisdiction={trademark.jurisdiction}
              filingDate={trademark.filingDate}
              currentStatus={mapTrademarkStatus(trademark.status)}
              source={trademark.source}
              onTrackingSuccess={handleTrackingSuccess}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default TrademarkDetailPage;
