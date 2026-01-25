import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, CheckCircle, Loader2, Bell, CheckSquare } from 'lucide-react';
import { trackingApi, TrackingPreferences } from '../../services/trackingAPI';
import { useAuth } from '../../context/AuthContext';

// Define types locally since they're not exported from the API
type TrackingType = 'PATENT' | 'TRADEMARK';
type JurisdictionType = 'US' | 'EP' | 'CN' | 'JP' | 'KR' | 'IN' | 'GB' | 'DE' | 'FR';
type SourceType = 'PATENTSVIEW' | 'EPO' | 'UNIFIED';

interface TrackingPayload {
  externalId: string;
  type: TrackingType;
  jurisdiction: JurisdictionType;
  source: SourceType;
  trackLifecycle: boolean;
  trackRenewals: boolean;
  trackStatusChanges: boolean;
  enableAlerts: boolean;
  enableEmailNotifications: boolean;
}

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TrackingType; // 'PATENT' | 'TRADEMARK'
  externalId: string;
  title?: string;
  jurisdiction?: string;
  filingDate?: string;
  currentStatus?: string;
  source?: SourceType;
  onTrackingSuccess?: () => void;
}

export function TrackingModal({
  isOpen,
  onClose,
  type,
  externalId,
  title,
  jurisdiction = 'US',
  filingDate,
  currentStatus,
  source = 'PATENTSVIEW',
  onTrackingSuccess,
}: TrackingModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isUserRole = user?.role === 'USER';
  const isAnalystRole = user?.role === 'ANALYST' || user?.role === 'ADMIN';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Tracking preferences
  const [trackLifecycle, setTrackLifecycle] = useState(true);
  const [trackRenewals, setTrackRenewals] = useState(true);
  const [trackStatusChanges, setTrackStatusChanges] = useState(true);
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(false);

  const handleConfirmTracking = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create tracking preferences object
      const preferences: TrackingPreferences = {
        patentId: externalId,
        trackLifecycleEvents: trackLifecycle,
        trackStatusChanges: trackStatusChanges,
        trackRenewalsExpiry: trackRenewals,
        enableDashboardAlerts: enableAlerts,
        enableEmailNotifications: enableEmailNotifications,
      };

      // Save tracking preferences
      await trackingApi.savePreferences(preferences);

      setSuccess(true);
      onTrackingSuccess?.();

      // Navigate to lifecycle page after 2 seconds to show success state
      setTimeout(() => {
        onClose();
        setSuccess(false);
        
        // Navigate to the appropriate lifecycle page based on user role
        const dashboardPrefix = isUserRole ? '/user' : '/analyst';
        if (type === 'PATENT') {
          navigate(`${dashboardPrefix}/lifecycle/patents?publicationNumber=${encodeURIComponent(externalId)}`);
        } else {
          navigate(`${dashboardPrefix}/lifecycle/trademarks?trademarkId=${encodeURIComponent(externalId)}`);
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enable tracking';
      setError(errorMessage);
      console.error('Tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalTitle = type === 'PATENT' ? 'Track Patent Lifecycle' : 'Track Trademark Lifecycle';
  const statusLabel = type === 'PATENT' ? 'Patent Status' : 'Trademark Status';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-800">
            <h2 className="text-xl font-semibold text-white">{modalTitle}</h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-white hover:bg-blue-800 rounded-lg p-1 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Read-only Info Section */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
                {type === 'PATENT' ? 'Patent Details' : 'Trademark Details'}
              </h3>

              <div className="space-y-3">
                {/* ID */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {type === 'PATENT' ? 'Publication Number' : 'Trademark ID'}
                  </label>
                  <div className="px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 font-mono text-sm">
                    {externalId}
                  </div>
                </div>

                {/* Title */}
                {title && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {type === 'PATENT' ? 'Title' : 'Name'}
                    </label>
                    <div className="px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm line-clamp-2">
                      {title}
                    </div>
                  </div>
                )}

                {/* Jurisdiction */}
                {jurisdiction && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Jurisdiction
                    </label>
                    <div className="px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm font-medium">
                      {jurisdiction}
                    </div>
                  </div>
                )}

                {/* Filing Date */}
                {filingDate && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Filing Date
                    </label>
                    <div className="px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm">
                      {new Date(filingDate).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Current Status */}
                {currentStatus && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {statusLabel}
                    </label>
                    <div className="px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm">
                      {currentStatus}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && !success && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Success!</p>
                  <p className="text-sm text-green-800">
                    {type === 'PATENT' ? 'Patent' : 'Trademark'} tracking enabled.
                  </p>
                </div>
              </div>
            )}

            {/* Tracking Preferences Section */}
            {!success && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
                  {isUserRole ? 'Legal Status Tracking' : 'Tracking Preferences'}
                </h3>

                {isUserRole ? (
                  /* USER ROLE: Legal Status Only */
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Legal Status Tracking:</strong> Track changes to the {type === 'PATENT' ? 'patent' : 'trademark'} legal status.
                      </p>
                    </div>

                    {/* Track Status Changes */}
                    <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={trackStatusChanges}
                        onChange={(e) => setTrackStatusChanges(e.target.checked)}
                        disabled={loading}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Monitor Legal Status</p>
                        <p className="text-xs text-slate-600">
                          Get notified of status changes and important updates
                        </p>
                      </div>
                    </label>

                    {/* Enable Alerts */}
                    <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={enableAlerts}
                        onChange={(e) => setEnableAlerts(e.target.checked)}
                        disabled={loading}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Dashboard Alerts</p>
                        <p className="text-xs text-slate-600">
                          Receive alerts in your dashboard
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  /* ANALYST ROLE: Full Tracking Options */
                  <div className="space-y-3">
                    {/* Track Lifecycle */}
                    <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={trackLifecycle}
                        onChange={(e) => setTrackLifecycle(e.target.checked)}
                        disabled={loading}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Track Lifecycle Events</p>
                        <p className="text-xs text-slate-600">
                          Monitor filing, grant, expiration, and status changes
                        </p>
                      </div>
                    </label>

                    {/* Track Status Changes */}
                    <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={trackStatusChanges}
                        onChange={(e) => setTrackStatusChanges(e.target.checked)}
                        disabled={loading}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Track Status Changes</p>
                        <p className="text-xs text-slate-600">
                          Get notified when {type === 'PATENT' ? 'patent status' : 'trademark status'} updates
                        </p>
                      </div>
                    </label>

                    {/* Track Renewals */}
                    <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={trackRenewals}
                        onChange={(e) => setTrackRenewals(e.target.checked)}
                        disabled={loading}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Track Renewals & Expiry</p>
                        <p className="text-xs text-slate-600">
                          Monitor renewal deadlines and expiration dates
                        </p>
                      </div>
                    </label>

                    {/* Enable Alerts */}
                    <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={enableAlerts}
                        onChange={(e) => setEnableAlerts(e.target.checked)}
                        disabled={loading}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-slate-900 text-sm flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          Enable Dashboard Alerts
                        </p>
                        <p className="text-xs text-slate-600">
                          Receive in-app notifications for important events
                        </p>
                      </div>
                    </label>

                    {/* Enable Email Notifications */}
                    <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={enableEmailNotifications}
                        onChange={(e) => setEnableEmailNotifications(e.target.checked)}
                        disabled={loading}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Enable Email Notifications</p>
                        <p className="text-xs text-slate-600">
                          Get email alerts for critical updates (optional)
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Info Box */}
            {!success && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Note:</strong> Tracking is disabled by default. You must explicitly enable it by clicking
                  "Confirm Tracking" below. No data will be collected until you do.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmTracking}
              disabled={loading || success}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Tracking Enabled
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" />
                  Confirm Tracking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
