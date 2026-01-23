/**
 * User Activity Modal Component
 * Displays user activity statistics and usage patterns
 */

import { X, Loader2 } from 'lucide-react';
import { useUserActivity } from '../../hooks/useUsers';
import { formatDistanceToNow } from 'date-fns';

interface UserActivityModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const UserActivityModal: React.FC<UserActivityModalProps> = ({ 
  userId, 
  isOpen, 
  onClose 
}) => {
  const { data: activity, isLoading, error } = useUserActivity(userId, isOpen);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-title"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="activity-modal-title" className="text-2xl font-bold text-blue-900">User Activity</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600">Loading activity data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Failed to load user activity. Please try again.
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && activity && (
          <>
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Username</p>
                <p className="text-lg font-semibold text-slate-900">{activity.username}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Email</p>
                <p className="text-lg font-semibold text-slate-900">{activity.email}</p>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">API Requests</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    {activity.requestsLast24h}
                  </p>
                  <p className="text-sm text-slate-600">Last 24 Hours</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {activity.requestsLast7d}
                  </p>
                  <p className="text-sm text-slate-600">Last 7 Days</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="text-4xl font-bold text-purple-600 mb-2">
                    {activity.requestsLast30d}
                  </p>
                  <p className="text-sm text-slate-600">Last 30 Days</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Last Activity</p>
                <p className="text-lg font-semibold text-slate-900">
                  {activity.lastActivity 
                    ? formatDistanceToNow(new Date(activity.lastActivity), { addSuffix: true })
                    : 'Never'
                  }
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Most Used Service</p>
                <p className="text-lg font-semibold text-slate-900">
                  {activity.mostUsedService}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
