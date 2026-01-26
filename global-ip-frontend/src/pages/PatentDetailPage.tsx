import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Star,
  Calendar,
  Users,
  Building,
  FileText,
  Tag,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Radio,
} from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { AnalystSidebar } from "../components/dashboard/AnalystSidebar";
import { useAuth } from "../context/AuthContext";
import { patentDetailAPI, GlobalPatentDetailDto } from "../services/api";
import { CitationSummary } from "../components/CitationSummary";
import { trackingApi } from "../services/trackingAPI";
import subscriptionApi from "../services/subscriptionApi";
import { useSubscription } from "../context/SubscriptionContext";
import { SubscriptionUpgradeModal } from "../components/subscription/SubscriptionUpgradeModal";
import { toast } from "sonner";

export function PatentDetailPage() {
  const { publicationNumber } = useParams<{ publicationNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();
  
  // Determine if user is an analyst
  const isAnalyst = hasRole(['ANALYST', 'ADMIN']) || location.pathname.includes("/analyst");

  const [patent, setPatent] = useState<GlobalPatentDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [abstractExpanded, setAbstractExpanded] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { isActive, checkLimit, getLimitDisplay, tierLimits, usage, refreshSubscription } = useSubscription();
  // LocalStorage key to remember that the user selected a subscription option
  // for legal-status tracking so we don't repeatedly show the modal.
  const LEGAL_STATUS_SUB_CHOICE_KEY = 'legalStatusSubscriptionChosen';

  const handleSubscriptionSuccess = async () => {
    // Refresh subscription state after user creates/upgrades subscription
    await refreshSubscription();
    // Remember that user chose a subscription option for legal-status tracking
    try {
      localStorage.setItem(LEGAL_STATUS_SUB_CHOICE_KEY, 'true');
    } catch (e) {
      // Ignore localStorage failures (e.g., private mode)
    }
    // Try to enable tracking again
    if (patent) {
      try {
        setTrackingLoading(true);
        await trackingApi.savePreferences({
          patentId: patent.publicationNumber,
          trackLifecycleEvents: true,
          trackStatusChanges: true,
          trackRenewalsExpiry: true,
          enableDashboardAlerts: true,
          enableEmailNotifications: false
        });
        setIsTracking(true);
        toast.success('Patent tracking enabled successfully!');
      } catch (err: any) {
        console.error('Error enabling tracking after subscription:', err);
        toast.error('Failed to enable tracking. Please try again.');
      } finally {
        setTrackingLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPatentDetails();
    checkTrackingStatus();

    // Refresh subscription when page becomes visible (tab focus)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [publicationNumber, refreshSubscription]);

  const checkTrackingStatus = async () => {
    if (!publicationNumber) return;

    try {
      const tracking = await trackingApi.isTracking(publicationNumber);
      setIsTracking(tracking);
    } catch (err) {
      console.error('Error checking tracking status:', err);
      setIsTracking(false);
    }
  };

  const handleLoadError = (err: any) => {
    console.error("Error loading patent details:", err);
    const message = err.response?.status === 404
      ? "Patent details are available only for items returned in search results."
      : "Failed to load patent details. Please try again.";
    setError(message);
  };

  const loadPatentDetails = async () => {
    if (!publicationNumber) {
      setError("No publication number provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await patentDetailAPI.getDetail(publicationNumber);
      setPatent(data);
    } catch (err: any) {
      handleLoadError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookmark = async (bookmarked: boolean) => {
    const source = patent?.source || "PATENTSVIEW";
    if (bookmarked) {
      await patentDetailAPI.unbookmark(patent!.publicationNumber);
    } else {
      await patentDetailAPI.bookmark(patent!.publicationNumber, source);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!patent) return;

    setIsBookmarking(true);
    try {
      await updateBookmark(patent.bookmarked);
      setPatent({ ...patent, bookmarked: !patent.bookmarked });
    } catch (err: any) {
      console.error("Error toggling bookmark:", err);
      alert("Failed to update bookmark. Please try again.");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleCopy = () => {
    if (patent) {
      navigator.clipboard.writeText(patent.publicationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTrackingClick = async () => {
    if (!patent) return;

    // Check subscription by calling the API directly
    if (!isTracking) {
      // If the user previously selected a subscription option specifically
      // for legal-status tracking, avoid showing the modal again and try
      // to enable tracking directly. If enabling fails with a subscription
      // error, fall back to showing the modal.
      const alreadyHandled = (() => {
        try {
          return localStorage.getItem(LEGAL_STATUS_SUB_CHOICE_KEY) === 'true';
        } catch (e) {
          return false;
        }
      })();

      if (alreadyHandled) {
        setTrackingLoading(true);
        try {
          await trackingApi.savePreferences({
            patentId: patent.publicationNumber,
            trackLifecycleEvents: true,
            trackStatusChanges: true,
            trackRenewalsExpiry: true,
            enableDashboardAlerts: true,
            enableEmailNotifications: false
          });

          setIsTracking(true);
          navigate(`/patents/${patent.publicationNumber}/track`);
          return;
        } catch (err: any) {
          console.error('Error enabling tracking (post-choice):', err);
          if (err.isSubscriptionError || err.response?.status === 403) {
            setShowUpgradeModal(true);
            return;
          }
          const errorMessage = err.response?.data?.message || err.message || 'Failed to enable tracking';
          toast.error(`Failed to enable tracking: ${errorMessage}`);
          return;
        } finally {
          setTrackingLoading(false);
        }
      }

      try {
        const subscription = await subscriptionApi.getActiveSubscription();
        
        // If no active subscription, show upgrade modal
        if (!subscription) {
          setShowUpgradeModal(true);
          return;
        }

        // Check tier limits based on actual subscription
        if (checkLimit('patents', 1)) {
          toast.error(`Your plan allows tracking up to ${tierLimits?.maxPatentsTracked || 10} patents`);
          setShowUpgradeModal(true);
          return;
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
        // If error checking subscription, show upgrade modal
        setShowUpgradeModal(true);
        return;
      }
    }

    if (isTracking) {
      // Already tracking - navigate to config page
      navigate(`/patents/${patent.publicationNumber}/track`);
    } else {
      // Not tracking - enable with defaults then navigate
      setTrackingLoading(true);
      try {
        await trackingApi.savePreferences({
          patentId: patent.publicationNumber,
          trackLifecycleEvents: true,
          trackStatusChanges: true,
          trackRenewalsExpiry: true,
          enableDashboardAlerts: true,
          enableEmailNotifications: false
        });

        setIsTracking(true);
        navigate(`/patents/${patent.publicationNumber}/track`);
      } catch (err: any) {
        console.error('Error enabling tracking:', err);
        
        // Check if it's a subscription error
        if (err.isSubscriptionError || err.response?.status === 403) {
          setShowUpgradeModal(true);
        } else {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to enable tracking';
          toast.error(`Failed to enable tracking: ${errorMessage}`);
        }
      } finally {
        setTrackingLoading(false);
      }
    }
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

  const extractCpcCode = (url: string): string => {
    // Extract CPC code from URL like "https://...api/v1/cpc_group/A61F2:2415/"
    const match = url.match(/cpc_(?:group|subclass)\/([^\/]+)\/?/);
    if (match?.[1]) {
      return match[1].replace(/:/g, '/');
    }
    return url;
  };

  // Use abstractText if abstract is not available
  const displayAbstract = patent?.abstract || patent?.abstractText;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading patent details...</p>
        </div>
      </div>
    );
  }

  if (error || !patent) {
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
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Error Loading Patent</h2>
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
                    {patent.title || "Patent Details"}
                  </h1>
                  
                  {/* Publication Number with Copy */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl text-slate-700 font-mono font-medium">
                      {patent.publicationNumber}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Copy publication number"
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
                    {isTracking && (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Tracking Active
                      </span>
                    )}
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {patent.jurisdiction}
                    </span>
                    {patent.source && (
                      <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {patent.source}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Track Patent Button */}
                  <button
                    onClick={handleTrackingClick}
                    disabled={trackingLoading}
                    className={`px-4 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-medium text-sm flex items-center gap-2 ${
                      isTracking
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    } disabled:opacity-50`}
                    title={
                      isTracking
                        ? 'Configure tracking preferences'
                        : `Enable tracking for this patent${usage ? ` (${getLimitDisplay('patents')})` : ''}`
                    }
                  >
                    {trackingLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Radio className="w-4 h-4" />
                    )}
                    {isTracking ? 'Configure Tracking' : 'Enable Tracking'}
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={handleBookmarkToggle}
                    disabled={isBookmarking}
                    className={`p-4 rounded-xl transition-all shadow-md hover:shadow-lg ${
                      patent.bookmarked
                        ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    } disabled:opacity-50`}
                    title={patent.bookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    {isBookmarking ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Star
                        className={`w-6 h-6 ${patent.bookmarked ? "fill-current" : ""}`}
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
                  <p className="text-slate-900 font-medium">{formatDate(patent.filingDate)}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Grant Date</p>
                  <p className="text-slate-900 font-medium">{formatDate(patent.grantDate)}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Publication Date</p>
                  <p className="text-slate-900 font-medium">{formatDate(patent.publicationDate)}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">WIPO Kind</p>
                  <p className="text-slate-900 font-medium">{patent.wipoKind || "—"}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Times Cited</p>
                  <p className="text-slate-900 font-medium">
                    {patent.timesCited ?? "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Total Citations</p>
                  <p className="text-slate-900 font-medium">
                    {patent.totalCitations ?? "—"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Parties Section */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
            >
              <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Parties
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inventors */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Inventors</h3>
                  </div>
                  {patent.inventors && patent.inventors.length > 0 ? (
                    <ul className="space-y-2">
                      {patent.inventors.map((inventor, index) => (
                        <li key={index} className="text-slate-700 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {inventor}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 italic">Not disclosed</p>
                  )}
                </div>

                {/* Assignees */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Assignees</h3>
                  </div>
                  {patent.assignees && patent.assignees.length > 0 ? (
                    <ul className="space-y-2">
                      {patent.assignees.map((assignee, index) => (
                        <li key={index} className="text-slate-700 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {assignee}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 italic">Not disclosed</p>
                  )}
                </div>
              </div>
            </motion.div>
}
            {/* Classification Section */}
            {!!(patent.cpcClasses?.length || patent.ipcClasses?.length) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
              >
                <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
                  <Tag className="w-6 h-6" />
                  Classifications
                </h2>

                {/* CPC Classes */}
                {patent.cpcClasses && patent.cpcClasses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">CPC Classes</h3>
                    <div className="flex flex-wrap gap-2">
                      {patent.cpcClasses.map((cpc, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-mono border border-blue-200"
                        >
                          {extractCpcCode(cpc)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* IPC Classes */}
                {patent.ipcClasses && patent.ipcClasses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">IPC Classes</h3>
                    <div className="flex flex-wrap gap-2">
                      {patent.ipcClasses.map((ipc, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-mono border border-purple-200"
                        >
                          {ipc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Abstract Section - Moved to bottom */}
            {displayAbstract && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
              >
                <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Abstract
                </h2>

                <div className="relative">
                  <p
                    className={`text-slate-700 leading-relaxed ${
                      !abstractExpanded ? "line-clamp-5" : ""
                    }`}
                  >
                    {displayAbstract}
                  </p>

                  {displayAbstract.length > 300 && (
                    <button
                      onClick={() => setAbstractExpanded(!abstractExpanded)}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                    >
                      {abstractExpanded ? (
                        <>
                          Read less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Citation Summary Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CitationSummary
                citationNetwork={patent.citationNetwork || undefined}
                patentId={patent.publicationNumber}
                source={patent.source}
              />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Subscription Upgrade Modal */}
      <SubscriptionUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        showCreateOption={!isActive}
        onSubscriptionSuccess={handleSubscriptionSuccess}
      />
    </div>
  );
}

export default PatentDetailPage;
