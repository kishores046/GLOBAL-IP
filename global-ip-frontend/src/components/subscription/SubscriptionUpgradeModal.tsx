/**
 * Subscription Upgrade Modal Component
 * Shows when user needs to subscribe or upgrade to access a feature
 */

import { useState } from 'react';
import { X, Check, AlertCircle, Zap, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routeConfig';
import type { SubscriptionTier, MonitoringType } from '../../types/subscription';
import { FEATURE_MATRIX, formatLimit } from '../../types/subscription';

interface SubscriptionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: MonitoringType;
  requiredTier?: SubscriptionTier;
  message?: string;
  showCreateOption?: boolean;
  onSubscriptionSuccess?: () => void;
}

export function SubscriptionUpgradeModal({
  isOpen,
  onClose,
  feature,
  requiredTier,
  message,
  showCreateOption = true,
  onSubscriptionSuccess,
}: SubscriptionUpgradeModalProps) {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('PRO');

  const handleUpgrade = () => {
    onClose();
    if (onSubscriptionSuccess) {
      onSubscriptionSuccess();
    }
    navigate(ROUTES.SUBSCRIPTIONS);
  };

  const handleCreateSubscription = () => {
    onClose();
    if (onSubscriptionSuccess) {
      onSubscriptionSuccess();
    }
    navigate(ROUTES.SUBSCRIPTIONS);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {showCreateOption ? 'Subscription Required' : 'Upgrade Required'}
                </h3>
                <p className="text-slate-600 mt-1">
                  {message ||
                    (feature
                      ? `This feature requires an active subscription for ${feature}.`
                      : 'This feature requires an active subscription.')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Plan Comparison */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Available Plans</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {/* BASIC Plan */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-6 border-2 rounded-xl transition-all cursor-pointer ${
                  selectedTier === 'BASIC'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedTier('BASIC')}
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-lg font-bold text-slate-900">BASIC</h5>
                  {selectedTier === 'BASIC' && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    {formatLimit(FEATURE_MATRIX.BASIC.maxCompetitors)} competitors
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    {formatLimit(FEATURE_MATRIX.BASIC.maxPatentsTracked)} patents tracked
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Weekly sync
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4" />
                    No real-time alerts
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4" />
                    No analytics dashboards
                  </li>
                </ul>
              </motion.div>

              {/* PRO Plan */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-6 border-2 rounded-xl transition-all cursor-pointer relative ${
                  selectedTier === 'PRO'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-blue-300 hover:border-blue-400'
                }`}
                onClick={() => setSelectedTier('PRO')}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h5 className="text-lg font-bold text-slate-900">PRO</h5>
                  </div>
                  {selectedTier === 'PRO' && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    {formatLimit(FEATURE_MATRIX.PRO.maxCompetitors)} competitors
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    {formatLimit(FEATURE_MATRIX.PRO.maxPatentsTracked)} patents tracked
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Daily sync
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Real-time alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Analytics dashboards
                  </li>
                </ul>
              </motion.div>

              {/* ENTERPRISE Plan */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-6 border-2 rounded-xl transition-all cursor-pointer ${
                  selectedTier === 'ENTERPRISE'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedTier('ENTERPRISE')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <h5 className="text-lg font-bold text-slate-900">ENTERPRISE</h5>
                  </div>
                  {selectedTier === 'ENTERPRISE' && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Unlimited competitors
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Unlimited patents tracked
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    6-hour sync
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Real-time alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Full analytics suite
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            {showCreateOption ? (
              <button
                onClick={handleCreateSubscription}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg font-semibold"
              >
                Create Subscription
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg font-semibold"
              >
                Upgrade Plan
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

