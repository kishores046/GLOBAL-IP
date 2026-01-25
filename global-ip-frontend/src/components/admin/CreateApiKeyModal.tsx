/**
 * Create API Key Modal
 * Modal for creating a new API key with one-time display
 * 
 * API KEY SECURITY RULES:
 * ❌ Never cache raw API key
 * ❌ Never log raw API key
 * ❌ Never show raw key again after modal closes
 */

import { useState } from 'react';
import { X, Copy, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CreateApiKeyModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => Promise<string>; // Returns raw API key (apiKey field from backend)
  readonly isLoading: boolean;
}

export function CreateApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: Readonly<CreateApiKeyModalProps>) {
  const [step, setStep] = useState<'confirm' | 'display'>('confirm'); // 'confirm' or 'display'
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUserCopied, setHasUserCopied] = useState(false);

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const rawKey = await onSubmit();
      
      if (!rawKey) {
        throw new Error('No API key returned from server');
      }
      
      setApiKey(rawKey);
      setStep('display');
      setHasUserCopied(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to create API key:', error);
      setError(errorMsg);
      toast.error(`Failed to create API key: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setHasUserCopied(true);
      toast.success('API key copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([apiKey], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `api-key-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('API key downloaded');
    setHasUserCopied(true);
  };

  const handleClose = () => {
    // Only allow close if user has copied/downloaded the key (or on display step)
    if (step === 'confirm' || hasUserCopied) {
      // Reset state
      setStep('confirm');
      setApiKey('');
      setIsSubmitting(false);
      setError(null);
      setHasUserCopied(false);
      onClose();
    } else {
      toast.error('Please copy or download your API key before closing');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {step === 'confirm' ? 'Create API Key' : 'Your API Key'}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={step === 'display' && !hasUserCopied}
            title={step === 'display' && !hasUserCopied ? 'Please copy or download your key first' : ''}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'confirm' ? (
            <>
              {/* Confirm Step */}
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Error</p>
                      <p className="text-xs text-red-800 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Create New API Key
                    </p>
                    <p className="text-xs text-blue-800 mt-1">
                      A new API key will be generated. The key name will be automatically derived from your account.
                    </p>
                  </div>
                </div>

                {/* Warning Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      ⚠️ Important
                    </p>
                    <p className="text-xs text-amber-800 mt-1">
                      This API key will be shown only once. You must copy it now and store it securely. We cannot show it again.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Display Step */}
              <div className="space-y-4">
                {/* Success Banner */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      ✓ API Key Created Successfully
                    </p>
                    <p className="text-xs text-green-800 mt-1">
                      Copy or download your key now. We won't show it again.
                    </p>
                  </div>
                </div>

                {/* API Key Display */}
                <div>
                  <label htmlFor="api-key-display" className="block text-sm font-medium text-slate-700 mb-2">
                    Your API Key
                  </label>
                  <div id="api-key-display" className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm break-all select-all border border-slate-700">
                    {apiKey}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    This key will not be displayed again. Store it securely.
                  </p>
                </div>

                {/* Copy Instructions */}
                <p className="text-xs text-slate-600">
                  Use this key in API requests:
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
                  X-API-KEY: {apiKey.substring(0, 20)}...
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-slate-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>

              {/* Close Button - Only enabled after user copies/downloads */}
              <button
                onClick={handleClose}
                disabled={!hasUserCopied}
                className="w-full mt-3 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title={!hasUserCopied ? 'Please copy or download your key first' : ''}
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
