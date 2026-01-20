/**
 * Revoke API Key Modal
 * Confirmation modal for revoking an API key
 */

import { AlertTriangle, X } from 'lucide-react';

interface RevokeApiKeyModalProps {
  isOpen: boolean;
  keyName: string;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function RevokeApiKeyModal({
  isOpen,
  keyName,
  isLoading,
  onConfirm,
  onCancel,
}: RevokeApiKeyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Revoke API Key</h2>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 transition disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">
                Permanent Action
              </p>
              <p className="text-xs text-red-800 mt-1">
                This API key will be permanently revoked and cannot be used again.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
            <div>
              <p className="text-xs text-slate-600">API Key Name</p>
              <p className="text-sm font-semibold text-slate-900">{keyName}</p>
            </div>
          </div>

          {/* Warning Message */}
          <p className="text-sm text-slate-600 mt-4">
            Any applications or services using this key will stop working immediately after revocation.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Revoking...' : 'Revoke Key'}
          </button>
        </div>
      </div>
    </div>
  );
}
