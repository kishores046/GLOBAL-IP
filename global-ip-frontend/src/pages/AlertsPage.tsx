import { useState, useEffect, useContext } from "react";
import { Bell, Lock, Clock, Zap, FileText, Users, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { AnalystLayoutContext } from "../components/dashboard/AnalystLayout";
import { motion } from "motion/react";
import { useSubscription } from "../context/SubscriptionContext";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAuth } from "../context/AuthContext";
import { SubscriptionUpgradeModal } from "../components/subscription/SubscriptionUpgradeModal";
import { toast } from "sonner";

interface PatentTrackingEvent {
  patentId: string;
  eventType: "LIFECYCLE_UPDATE" | "STATUS_CHANGE" | "RENEWAL_REMINDER" | "EXPIRY_WARNING";
  message: string;
  previousValue?: string;
  currentValue?: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

interface CompetitorFilingEvent {
  competitorId: number;
  competitorCode: string;
  newFilings: number;
  latestPatentId: string;
  timestamp: string;
}

interface WebSocketAlert {
  id: string;
  type: "PATENT_EVENT" | "COMPETITOR_EVENT";
  message: string;
  data: PatentTrackingEvent | CompetitorFilingEvent;
  timestamp: string;
  severity?: "INFO" | "WARNING" | "CRITICAL";
}

export function AlertsPage() {
  const { isActive, subscription, tierLimits, refreshSubscription } = useSubscription();
  const { user } = useAuth();
  const { shouldConnect, subscribeToPatentEvents, subscribeToCompetitorEvents, connect, disconnect } =
    useWebSocket();
  const [webSocketAlerts, setWebSocketAlerts] = useState<WebSocketAlert[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'patents' | 'competitors'>('all');

  // Helper function to format patent event messages
  const formatPatentEventMessage = (event: PatentTrackingEvent): string => {
    switch (event.eventType) {
      case "LIFECYCLE_UPDATE":
        return `Patent ${event.patentId} lifecycle changed: ${event.message}`;
      case "STATUS_CHANGE":
        return `Patent ${event.patentId} status: ${event.previousValue} → ${event.currentValue}`;
      case "RENEWAL_REMINDER":
        return `Patent ${event.patentId} renewal: ${event.message}`;
      case "EXPIRY_WARNING":
        return `Patent ${event.patentId} expiry: ${event.message}`;
      default:
        return event.message;
    }
  };

  // Helper function to format competitor event messages
  const formatCompetitorEventMessage = (event: CompetitorFilingEvent): string => {
    return `${event.competitorCode} filed ${event.newFilings} new patent(s). Latest: ${event.latestPatentId}`;
  };

  // Helper function to get icon based on severity or event type
  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "WARNING":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "INFO":
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  // Connect WebSocket if subscription allows real-time alerts
  useEffect(() => {
    if (shouldConnect && user?.userId) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        connect(user.userId, token);

        // Subscribe to patent events
        const unsubscribePatent = subscribeToPatentEvents((event) => {
          console.log('Patent tracking event received:', event);
          const patentEvent = event.data as PatentTrackingEvent;
          const wsAlert: WebSocketAlert = {
            id: `patent-${Date.now()}-${Math.random()}`,
            type: "PATENT_EVENT",
            message: formatPatentEventMessage(patentEvent),
            data: patentEvent,
            timestamp: new Date().toLocaleString(),
            severity: patentEvent.severity,
          };
          setWebSocketAlerts((prev) => [wsAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
          
          // Toast notification with severity-based styling
          let toastType: 'error' | 'warning' | 'info' = 'info';
          if (patentEvent.severity === 'CRITICAL') {
            toastType = 'error';
          } else if (patentEvent.severity === 'WARNING') {
            toastType = 'warning';
          }

          const duration = patentEvent.severity === 'CRITICAL' ? 10000 : 5000;
          
          toast[toastType](
            `Patent Alert: ${patentEvent.eventType}`,
            {
              description: patentEvent.message,
              duration,
            }
          );
        });

        // Subscribe to competitor events
        const unsubscribeCompetitor = subscribeToCompetitorEvents((event) => {
          console.log('Competitor filing event received:', event);
          const competitorEvent = event.data as CompetitorFilingEvent;
          const wsAlert: WebSocketAlert = {
            id: `competitor-${Date.now()}-${Math.random()}`,
            type: "COMPETITOR_EVENT",
            message: formatCompetitorEventMessage(competitorEvent),
            data: competitorEvent,
            timestamp: new Date().toLocaleString(),
            severity: "INFO",
          };
          setWebSocketAlerts((prev) => [wsAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
          
          toast.info(
            `Competitor Alert: New Filings`,
            {
              description: `${competitorEvent.competitorCode} filed ${competitorEvent.newFilings} patent(s)`,
              duration: 5000,
            }
          );
        });

        return () => {
          unsubscribePatent();
          unsubscribeCompetitor();
          disconnect();
        };
      }
    } else if (!shouldConnect) {
      disconnect();
    }
  }, [shouldConnect, user?.userId, connect, disconnect, subscribeToPatentEvents, subscribeToCompetitorEvents]);

  // Refresh subscription when modal closes to check if user created a subscription
  const handleModalClose = async () => {
    setShowUpgradeModal(false);
    // Refresh subscription to check if user created one
    await refreshSubscription();
  };

  // Refresh subscription when page becomes visible (tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshSubscription]);

  // Hide dashboard if no subscription
  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="flex">
          {!useContext(AnalystLayoutContext) && <Sidebar />}
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <div className="max-w-2xl mx-auto mt-16">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-12 border border-blue-200/50 shadow-xl text-center">
                  <div className="inline-block p-4 bg-slate-100 rounded-full mb-6">
                    <Lock className="w-12 h-12 text-slate-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Alerts Dashboard Unavailable</h2>
                  <p className="text-slate-600 mb-8">
                    You need an active subscription to access the alerts dashboard.
                  </p>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Create Subscription
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
        <SubscriptionUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          showCreateOption={true}
        />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Unresolved":
        return "bg-yellow-100 text-yellow-700";
      case "Resondue":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Filter alerts based on active filter
  const filteredAlerts = webSocketAlerts.filter((alert) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'patents') return alert.type === 'PATENT_EVENT';
    if (activeFilter === 'competitors') return alert.type === 'COMPETITOR_EVENT';
    return true;
  });

  // Dynamic styling for alerts container and badge based on active filter
  const wsContainerClasses = `bg-white/70 backdrop-blur-xl rounded-2xl p-6 transition-all shadow-xl mb-8 ${
    activeFilter === 'patents'
      ? 'border border-green-200/50 hover:border-green-300/50'
      : activeFilter === 'competitors'
      ? 'border border-purple-200/50 hover:border-purple-300/50'
      : 'border border-green-200/50 hover:border-green-300/50'
  }`;

  const countBadgeClass = `${
    activeFilter === 'patents'
      ? 'ml-auto text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full'
      : activeFilter === 'competitors'
      ? 'ml-auto text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full'
      : 'ml-auto text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full'
  }`;

  const iconBgClass = `${activeFilter === 'competitors' ? 'from-purple-500 to-purple-600' : 'from-green-500 to-green-600'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        {!useContext(AnalystLayoutContext) && <Sidebar />}
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl text-blue-900 mb-2">Alerts</h1>
                    <p className="text-slate-600">
                      {subscription?.tier === 'BASIC'
                        ? 'Weekly summary only'
                        : 'Live WebSocket updates and real-time alerts'}
                    </p>
                  </div>
                  {tierLimits?.realTimeAlerts && (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Real-time Active
                    </span>
                  )}
                </div>
              </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-slate-900 font-semibold">Patent Tracking</div>
                <p className="text-xs text-slate-600 mt-1">Real-time patent status alerts</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-slate-900 font-semibold">Competitor Filing</div>
                <p className="text-xs text-slate-600 mt-1">Real-time competitor filing alerts</p>
              </motion.div>
            </div>

            {/* Main Content - Real-time WebSocket Alerts */}
            <div className="w-full">

              {/* Filter Buttons */}
              <div className="flex gap-3 mb-6 flex-wrap">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/70 text-slate-700 border border-blue-200/50 hover:border-blue-300/50 hover:bg-white/90'
                  }`}
                >
                  All Alerts ({webSocketAlerts.length})
                </button>
                <button
                  onClick={() => setActiveFilter('patents')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeFilter === 'patents'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/70 text-slate-700 border border-blue-200/50 hover:border-blue-300/50 hover:bg-white/90'
                  }`}
                >
                  Patents ({webSocketAlerts.filter(a => a.type === 'PATENT_EVENT').length})
                </button>
                <button
                  onClick={() => setActiveFilter('competitors')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeFilter === 'competitors'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/70 text-slate-700 border border-purple-200/50 hover:border-purple-300/50 hover:bg-white/90'
                  }`}
                >
                  Competitors ({webSocketAlerts.filter(a => a.type === 'COMPETITOR_EVENT').length})
                </button>
              </div>

              {/* WebSocket Real-time Alerts Section */}
              {filteredAlerts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={wsContainerClasses}
                >
                  <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 bg-gradient-to-br ${iconBgClass} rounded-lg flex items-center justify-center`}>
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                      <h2 className="text-2xl text-slate-900 font-semibold">Real-time WebSocket Alerts</h2>
                      <span className={countBadgeClass}>
                        {filteredAlerts.length} {activeFilter === 'all' ? 'incoming' : activeFilter}
                      </span>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredAlerts.map((wsAlert, index) => {
                      const isPerfect = wsAlert.type === "PATENT_EVENT";
                      const patentData = isPerfect ? (wsAlert.data as PatentTrackingEvent) : null;
                      const competitorData = !isPerfect ? (wsAlert.data as CompetitorFilingEvent) : null;

                      // Get severity color
                      let severityColor = 'bg-green-50 border-l-green-500';
                      if (wsAlert.severity === 'CRITICAL') {
                        severityColor = 'bg-red-50 border-l-red-500';
                      } else if (wsAlert.severity === 'WARNING') {
                        severityColor = 'bg-yellow-50 border-l-yellow-500';
                      }

                      // Get severity background
                      let severityBg = 'bg-green-100 text-green-800';
                      if (wsAlert.severity === 'CRITICAL') {
                        severityBg = 'bg-red-100 text-red-800';
                      } else if (wsAlert.severity === 'WARNING') {
                        severityBg = 'bg-yellow-100 text-yellow-800';
                      }

                      return (
                        <motion.div
                          key={wsAlert.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-lg border-l-4 transition-all ${
                            isPerfect ? severityColor : "bg-purple-50 border-l-purple-500"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="mt-0.5">
                                {getSeverityIcon(wsAlert.severity)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {isPerfect && patentData ? (
                                    <>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${severityBg}`}>
                                        {patentData.eventType.replace(/_/g, ' ')}
                                      </span>
                                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                                        PATENT
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                                      COMPETITOR
                                    </span>
                                  )}
                                  <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {wsAlert.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 mb-2">{wsAlert.message}</p>
                                
                                {/* Patent Event Details */}
                                {isPerfect && patentData && (
                                  <div className="text-xs text-slate-600 space-y-1 mt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="font-semibold">Patent ID:</span>
                                        <span className="ml-1 text-blue-600 font-mono">{patentData.patentId}</span>
                                      </div>
                                      <div>
                                        <span className="font-semibold">Severity:</span>
                                        <span className="ml-1 font-bold">{patentData.severity}</span>
                                      </div>
                                    </div>
                                    {patentData.previousValue && (
                                      <div>
                                        <span className="font-semibold">Previous:</span>
                                        <span className="ml-1 text-slate-500">{patentData.previousValue}</span>
                                      </div>
                                    )}
                                    {patentData.currentValue && (
                                      <div>
                                        <span className="font-semibold">Current:</span>
                                        <span className="ml-1 text-slate-500">{patentData.currentValue}</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Competitor Event Details */}
                                {!isPerfect && competitorData && (
                                  <div className="text-xs text-slate-600 space-y-1 mt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="font-semibold">Competitor:</span>
                                        <span className="ml-1 text-purple-600 font-semibold">{competitorData.competitorCode}</span>
                                      </div>
                                      <div>
                                        <span className="font-semibold">New Filings:</span>
                                        <span className="ml-1 text-green-600 font-bold">{competitorData.newFilings}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-semibold">Latest Patent:</span>
                                      <span className="ml-1 text-blue-600 font-mono">{competitorData.latestPatentId}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Empty State for WebSocket Alerts - No alerts received */}
              {webSocketAlerts.length === 0 && tierLimits?.realTimeAlerts && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-50/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 transition-all shadow-xl mb-8 text-center"
                >
                  <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                    <Bell className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Alerts</h3>
                  <p className="text-slate-600">No alerts have arrived from the WebSocket backend yet.</p>
                  <p className="text-xs text-slate-500 mt-2">Patent tracking and competitor filing alerts will appear here as they arrive</p>
                </motion.div>
              )}

              {/* Empty State - Filtered results empty */}
              {webSocketAlerts.length > 0 && filteredAlerts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-slate-50/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 transition-all shadow-xl mb-8 text-center"
                >
                  <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No {activeFilter} Alerts</h3>
                  <p className="text-slate-600">No {activeFilter} alerts match the current filter.</p>
                  <p className="text-xs text-slate-500 mt-2">Try selecting a different filter to view other alerts</p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Subscription Upgrade Modal */}
      <SubscriptionUpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleModalClose}
        showCreateOption={!isActive}
      />
    </div>
  );
}