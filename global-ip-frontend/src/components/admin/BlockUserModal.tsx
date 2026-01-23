/**
 * Block/Unblock User Modal
 * Modal for blocking or unblocking a user account
 */

import { AlertTriangle, X, Shield } from 'lucide-react';
import { useState } from 'react';

interface BlockUserModalProps {
  readonly isOpen: boolean;
  readonly userId: string;
  readonly username: string;
  readonly email: string;
  readonly isBlocked: boolean;
  readonly currentBlockReason?: string;
  readonly isLoading: boolean;
  readonly onConfirm: (reason?: string) => Promise<void>;
  readonly onCancel: () => void;
}

export function BlockUserModal({
  isOpen,
  userId,
  username,
  email,
  isBlocked,
  currentBlockReason,
  isLoading,
  onConfirm,
  onCancel,
}: BlockUserModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = async () => {
    if (!isBlocked && !reason.trim()) {
      alert('Please enter a reason for blocking this user.');
      return;
    }
    await onConfirm(reason);
    setReason('');
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  if (!isOpen) return null;

  const getButtonText = () => {
    if (isLoading) {
      return isBlocked ? 'Unblocking...' : 'Blocking...';
    }
    return isBlocked ? 'Unblock User' : 'Block User';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isBlocked ? 'Unblock User' : 'Block User'}
          </h2>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 transition disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Banner */}
          <div className={`${isBlocked ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex gap-3 mb-4`}>
            <AlertTriangle className={`w-5 h-5 ${isBlocked ? 'text-blue-600' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-sm font-medium ${isBlocked ? 'text-blue-900' : 'text-red-900'}`}>
                {isBlocked ? 'Unblock Action' : 'Permanent Action'}
              </p>
              <p className={`text-xs ${isBlocked ? 'text-blue-800' : 'text-red-800'} mt-1`}>
                {isBlocked
                  ? 'This user will be able to log in again immediately. They must provide their credentials to access the system.'
                  : 'Blocking this user will immediately log them out and prevent them from accessing the system.'}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-lg mb-4">
            <div>
              <p className="text-xs text-slate-600">Username</p>
              <p className="text-sm font-semibold text-slate-900">{username}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Email</p>
              <p className="text-sm font-semibold text-slate-900">{email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">User ID</p>
              <p className="text-xs font-mono text-slate-700">{userId}</p>
            </div>
            {isBlocked && currentBlockReason && (
              <div>
                <p className="text-xs text-slate-600">Current Block Reason</p>
                <p className="text-sm text-slate-900">{currentBlockReason}</p>
              </div>
            )}
          </div>

          {/* Reason Input (for blocking only) */}
          {!isBlocked && (
            <div className="mb-4">
              <label htmlFor="block-reason" className="block text-sm font-medium text-slate-700 mb-2">
                Reason for Blocking
              </label>
              <textarea
                id="block-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason (e.g., Suspicious activity, Terms violation)"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
                rows={3}
              />
              <p className="text-xs text-slate-500 mt-1">
                This reason will be logged and may be communicated to the user.
              </p>
            </div>
          )}

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex gap-2">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                {isBlocked
                  ? 'The user will need to contact an administrator to restore access.'
                  : 'Active sessions for this user will be terminated immediately.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              isBlocked
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
