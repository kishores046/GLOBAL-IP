/**
 * Create Subscription Page
 * Allows users to create new subscriptions
 */

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { AnalystSidebar } from '../components/dashboard/AnalystSidebar';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';
import { ArrowLeft, Plus, Zap, AlertCircle } from 'lucide-react';
import subscriptionApi from '../services/subscriptionApi';
import { ROLES, ROUTES } from '../routes/routeConfig';
import type { CreateSubscriptionRequest } from '../types/subscription';
import { toast } from 'sonner';

const SUBSCRIPTION_TYPES = [
  {
    id: 'LEGAL_STATUS',
    label: 'Legal Status Monitoring',
    description: 'Track legal status changes and updates',
    icon: '⚖️',
  },
  {
    id: 'COMPETITOR_FILING',
    label: 'Competitor Filing Tracking',
    description: 'Monitor competitor IP filings and activity',
    icon: '🎯',
  },
];

const TIER_OPTIONS = [
  {
    id: 'BASIC',
    label: 'Basic',
    features: ['Core features', 'Email support', '100 requests/month'],
    color: 'blue',
  },
  {
    id: 'PRO',
    label: 'Professional',
    features: ['All Basic features', 'Priority support', '1000 requests/month', 'Advanced analytics'],
    color: 'purple',
  },
  {
    id: 'ENTERPRISE',
    label: 'Enterprise',
    features: ['All features', '24/7 support', 'Unlimited requests', 'Custom integrations'],
    color: 'amber',
  },
];

const ALERT_FREQUENCIES = [
  { id: 'DAILY', label: 'Daily' },
  { id: 'WEEKLY', label: 'Weekly' },
  { id: 'MONTHLY', label: 'Monthly' },
  { id: 'ON_DEMAND', label: 'On Demand' },
];

export function CreateSubscriptionPage() {
  const navigate = useNavigate();
  const { getRole, hasRole } = useAuth();
  const userRole = getRole()?.toUpperCase();
  const isUserRole = hasRole('USER');
  const isAnalyst = userRole === ROLES.ANALYST;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateSubscriptionRequest>({
    type: 'LEGAL_STATUS',
    tier: 'BASIC',
    alertFrequency: 'WEEKLY',
    emailAlertsEnabled: false,
    dashboardAlertsEnabled: true,
  });

  // Filter subscription types based on role
  const availableSubscriptionTypes = isUserRole 
    ? SUBSCRIPTION_TYPES.filter(t => t.id === 'LEGAL_STATUS')
    : SUBSCRIPTION_TYPES;

  // Debug logging
  console.log('[CreateSubscriptionPage] User role:', userRole, 'isUserRole:', isUserRole, 'availableTypes:', availableSubscriptionTypes.length);

  const handleTypeChange = (type: string) => {
    setFormData({ ...formData, type: type as CreateSubscriptionRequest['type'] });
  };

  const handleTierChange = (tier: string) => {
    setFormData({ ...formData, tier: tier as CreateSubscriptionRequest['tier'] });
  };

  const handleAlertFrequencyChange = (frequency: string) => {
    setFormData({ ...formData, alertFrequency: frequency as CreateSubscriptionRequest['alertFrequency'] });
  };

  const handleAlertToggle = (type: 'email' | 'dashboard') => {
    if (type === 'email') {
      setFormData({ ...formData, emailAlertsEnabled: !formData.emailAlertsEnabled });
    } else {
      setFormData({ ...formData, dashboardAlertsEnabled: !formData.dashboardAlertsEnabled });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one alert type is enabled
    if (!formData.emailAlertsEnabled && !formData.dashboardAlertsEnabled) {
      toast.error('Please enable at least one alert type');
      return;
    }

    try {
      setLoading(true);
      await subscriptionApi.createSubscription(formData);
      toast.success('Subscription created successfully!');
      // Navigate to role-specific subscriptions page
      const subscriptionRoute = isUserRole ? ROUTES.SUBSCRIPTIONS : ROUTES.ANALYST_SUBSCRIPTIONS;
      navigate(subscriptionRoute);
    } catch (error: any) {
      // Handle duplicate subscription error
      if (error?.response?.status === 403 && error?.response?.data?.error?.includes('already exists')) {
        toast.info('You already have an active subscription for this type. Redirecting to subscriptions...');
        const subscriptionRoute = isUserRole ? ROUTES.SUBSCRIPTIONS : ROUTES.ANALYST_SUBSCRIPTIONS;
        setTimeout(() => navigate(subscriptionRoute), 2000);
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to create subscription';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedType = SUBSCRIPTION_TYPES.find((t) => t.id === formData.type);
  const selectedTier = TIER_OPTIONS.find((t) => t.id === formData.tier);
  const inAnalystLayout = useContext(AnalystLayoutContext);

  const inner = (
    <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(isUserRole ? ROUTES.SUBSCRIPTIONS : ROUTES.ANALYST_SUBSCRIPTIONS)}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Subscriptions</span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold text-blue-900 dark:text-white">Create Subscription</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Choose a subscription type and tier to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Subscription Type */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Step 1: Choose Subscription Type</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSubscriptionTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeChange(type.id)}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      formData.type === type.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                        : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      {formData.type === type.id && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{type.label}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Tier Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Step 2: Select Tier</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TIER_OPTIONS.map((tier) => {
                  const colorMap = {
                    blue: 'border-blue-200 dark:border-blue-600/50 bg-blue-50 dark:bg-blue-900/20',
                    purple: 'border-purple-200 dark:border-purple-600/50 bg-purple-50 dark:bg-purple-900/20',
                    amber: 'border-amber-200 dark:border-amber-600/50 bg-amber-50 dark:bg-amber-900/20',
                  };

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleTierChange(tier.id)}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        formData.tier === tier.id
                          ? `border-${tier.color}-600 ${colorMap[tier.color as keyof typeof colorMap]}`
                          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">{tier.label}</h3>
                        {formData.tier === tier.id && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="text-sm text-blue-600 dark:text-blue-400 font-bold mt-0.5">✓</span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Alert Configuration */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Step 3: Alert Configuration</h2>

              {/* Alert Frequency */}
              <fieldset className="mb-8">
                <legend className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
                  Alert Frequency
                </legend>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ALERT_FREQUENCIES.map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => handleAlertFrequencyChange(freq.id)}
                      className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                        formData.alertFrequency === freq.id
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Alert Types */}
              <fieldset>
                <legend className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
                  Notification Preferences
                </legend>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors bg-white dark:bg-slate-800">
                    <input
                      id="email-alerts"
                      type="checkbox"
                      checked={formData.emailAlertsEnabled}
                      onChange={() => handleAlertToggle('email')}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
                      aria-label="Email Alerts"
                    />
                    <label htmlFor="email-alerts" className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">Email Alerts</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via email</p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors bg-white dark:bg-slate-800">
                    <input
                      id="dashboard-alerts"
                      type="checkbox"
                      checked={formData.dashboardAlertsEnabled}
                      onChange={() => handleAlertToggle('dashboard')}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
                      aria-label="Dashboard Alerts"
                    />
                    <label htmlFor="dashboard-alerts" className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">Dashboard Alerts</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">See alerts in your dashboard</p>
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-750 rounded-lg border border-blue-200 dark:border-slate-600 p-6">
              <div className="flex gap-3 mb-4">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Subscription Summary</h3>
                  <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                      <strong>Type:</strong> {selectedType?.label}
                    </p>
                    <p>
                      <strong>Tier:</strong> {selectedTier?.label}
                    </p>
                    <p>
                      <strong>Frequency:</strong>{' '}
                      {ALERT_FREQUENCIES.find((f) => f.id === formData.alertFrequency)?.label} Alerts
                    </p>
                    <p>
                      <strong>Notifications:</strong>{' '}
                      {[
                        formData.emailAlertsEnabled && 'Email',
                        formData.dashboardAlertsEnabled && 'Dashboard',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {!formData.emailAlertsEnabled && !formData.dashboardAlertsEnabled && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-200">Alert configuration required</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Please enable at least one notification method
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(isUserRole ? ROUTES.SUBSCRIPTIONS : ROUTES.ANALYST_SUBSCRIPTIONS)}
                className="px-6 py-3 border border-slate-400 rounded-lg text-white font-medium hover:bg-slate-700 transition-colors dark:border-slate-500 dark:text-white dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  (!formData.emailAlertsEnabled && !formData.dashboardAlertsEnabled)
                }
                className={`flex-1 px-6 py-3 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  loading || (!formData.emailAlertsEnabled && !formData.dashboardAlertsEnabled)
                    ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Subscription
                  </>
                )}
              </button>
            </div>
          </form>
    </div>
  );

  if (inAnalystLayout) {
    return (
      <main className="flex-1 p-8 overflow-y-auto dark:bg-slate-900">{inner}</main>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {isAnalyst ? <AnalystSidebar /> : <Sidebar />}
      <main className="flex-1 p-8 overflow-y-auto dark:bg-slate-900">{inner}</main>
    </div>
  );
}

export default CreateSubscriptionPage;
