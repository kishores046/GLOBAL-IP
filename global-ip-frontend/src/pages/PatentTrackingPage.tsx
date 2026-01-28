import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, AlertCircle, Save, Trash2 } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { useContext } from 'react';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';
import { trackingApi} from '../services/trackingAPI';

/**
 * Patent Tracking Page - CONFIG ONLY
 * 
 * Purpose: Configure tracking preferences for a specific patent
 * NO lifecycle data rendering
 * NO patent status display
 * ONLY checkboxes and save/delete actions
 */

interface TrackingPreferences {
  patentId: string;
  trackLifecycleEvents: boolean;
  trackStatusChanges: boolean;
  trackRenewalsExpiry: boolean;
  enableDashboardAlerts: boolean;
  enableEmailNotifications: boolean;
}
export function PatentTrackingPage() {
  const { publicationNumber } = useParams<{ publicationNumber: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tracking preferences state
  const [preferences, setPreferences] = useState<TrackingPreferences>({
    patentId: publicationNumber || '',
    trackLifecycleEvents: true,
    trackStatusChanges: true,
    trackRenewalsExpiry: true,
    enableDashboardAlerts: true,
    enableEmailNotifications: false
  });

  useEffect(() => {
    loadPreferences();
  }, [publicationNumber]);

  const loadPreferences = async () => {
    if (!publicationNumber) {
      setError('No publication number provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await trackingApi.getPreferences(publicationNumber);
      setPreferences({
        patentId: data.patentId || publicationNumber,
        trackLifecycleEvents: data.trackLifecycleEvents ?? true,
        trackStatusChanges: data.trackStatusChanges ?? true,
        trackRenewalsExpiry: data.trackRenewalsExpiry ?? true,
        enableDashboardAlerts: data.enableDashboardAlerts ?? true,
        enableEmailNotifications: data.enableEmailNotifications ?? false
      });
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError('Failed to load tracking preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!publicationNumber) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await trackingApi.savePreferences({
        ...preferences,
        patentId: publicationNumber
      });
      setSuccessMessage('Preferences saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleStopTracking = async () => {
    if (!publicationNumber) return;

    const confirmed = window.confirm(
      'Are you sure you want to stop tracking this patent? You will no longer receive notifications.'
    );

    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      await trackingApi.deletePreferences(publicationNumber);
      navigate(`/patents/${publicationNumber}`);
    } catch (err) {
      console.error('Error stopping tracking:', err);
      setError('Failed to stop tracking. Please try again.');
      setDeleting(false);
    }
  };

  const handleCheckboxChange = (field: keyof TrackingPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const inAnalystLayout = useContext(AnalystLayoutContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        {!inAnalystLayout && <DashboardHeader userName="Analyst" />}
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading tracking preferences...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {!inAnalystLayout && <DashboardHeader userName="Analyst" />}

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(`/patents/${publicationNumber}`)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Patent Details
            </button>

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl"
            >
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Tracking Preferences
              </h1>
              <p className="text-slate-600">
                Patent <span className="font-mono font-semibold">{publicationNumber}</span>
              </p>
            </motion.div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <p className="text-sm text-green-800 font-medium">{successMessage}</p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Preferences Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Configure Notifications</h3>

              <div className="space-y-4">
                {/* Track Lifecycle Events */}
                <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.trackLifecycleEvents}
                    onChange={(e) => handleCheckboxChange('trackLifecycleEvents', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Track Lifecycle Events</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Monitor filing, grant, expiration, and status changes
                    </p>
                  </div>
                </label>

                {/* Track Status Changes */}
                <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.trackStatusChanges}
                    onChange={(e) => handleCheckboxChange('trackStatusChanges', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Track Status Changes</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Get notified when patent status updates
                    </p>
                  </div>
                </label>

                {/* Track Renewals & Expiry */}
                <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.trackRenewalsExpiry}
                    onChange={(e) => handleCheckboxChange('trackRenewalsExpiry', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Track Renewals & Expiry</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Monitor renewal deadlines and expiration dates
                    </p>
                  </div>
                </label>

                {/* Enable Dashboard Alerts */}
                <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.enableDashboardAlerts}
                    onChange={(e) => handleCheckboxChange('enableDashboardAlerts', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Enable Dashboard Alerts</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Receive in-app notifications for important events
                    </p>
                  </div>
                </label>

                {/* Enable Email Notifications */}
                <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.enableEmailNotifications}
                    onChange={(e) => handleCheckboxChange('enableEmailNotifications', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Enable Email Notifications</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Get email alerts for critical updates (optional)
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  onClick={handleStopTracking}
                  disabled={deleting || saving}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Stopping...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Stop Tracking
                    </>
                  )}
                </button>

                <button
                  onClick={handleSavePreferences}
                  disabled={saving || deleting}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> Changes to your tracking preferences will take effect immediately.
                You can update these settings anytime.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
