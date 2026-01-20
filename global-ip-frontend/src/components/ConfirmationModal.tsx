/**
 * Confirmation Modal Component
 * Generic reusable modal for confirmations with loading state
 */

import { AlertCircle, Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly isDangerous?: boolean; // Shows warning color if true
  readonly isLoading?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className={`p-6 border-b ${isDangerous ? 'bg-red-50' : 'bg-blue-50'}`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-6 h-6 ${isDangerous ? 'text-red-600' : 'text-blue-600'}`} />
            <h2 className={`text-lg font-semibold ${isDangerous ? 'text-red-900' : 'text-blue-900'}`}>
              {title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-700">{message}</p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
