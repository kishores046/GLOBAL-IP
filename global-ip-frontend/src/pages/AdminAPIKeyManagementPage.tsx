/**
 * Admin API Key Management Dashboard
 * Displays all API keys in the system with revocation capabilities
 * 
 * SECURITY RULES:
 * ❌ Do NOT show raw keys (only masked keys displayed)
 * ❌ Do NOT allow edit
 * ❌ Do NOT allow reactivation
 * ❌ Do NOT allow non-admin access
 */

import { useState } from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { AdminSidebar } from '../components/dashboard/AdminSidebar';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useAdminApiKeys, useRevokeApiKey } from '../hooks/useAdminApiKeys';
import type { AdminApiKeyFilters, AdminApiKeyResponse } from '../types/admin';
import { Trash2, Eye, Shield, AlertCircle } from 'lucide-react';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: string;
}

// Helper function to get toast background color
const getToastBgColor = (type: Toast['type']): string => {
  switch (type) {
    case 'success':
      return 'bg-green-600';
    case 'error':
      return 'bg-red-600';
    case 'info':
    default:
      return 'bg-blue-600';
  }
};

export function AdminAPIKeyManagementPage() {
  const [filters, setFilters] = useState<AdminApiKeyFilters>({
    page: 0,
    size: 20,
  });

  const [revokeModal, setRevokeModal] = useState<{
    isOpen: boolean;
    keyId?: string;
    keyName?: string;
  }>({
    isOpen: false,
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Queries and mutations
  const { data: apiKeysData, isLoading, error, refetch } = useAdminApiKeys(filters);
  const revokeMutation = useRevokeApiKey();

  // Handlers
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const openRevokeModal = (key: AdminApiKeyResponse) => {
    if (key.status !== 'ACTIVE') return; // Only allow revoking active keys
    setRevokeModal({
      isOpen: true,
      keyId: key.id,
      keyName: key.name,
    });
  };

  const closeRevokeModal = () => {
    setRevokeModal({ isOpen: false });
  };

  const handleRevokeConfirm = async () => {
    if (!revokeModal.keyId) return;

    try {
      await revokeMutation.mutateAsync(revokeModal.keyId);
      addToast('API key revoked successfully.', 'success');
      closeRevokeModal();
      await refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revoke API key';
      addToast(`Error: ${errorMessage}`, 'error');
    }
  };

  const removeToastAfterDelay = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { message, type, id };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => removeToastAfterDelay(id), 5000);
  };

  // Format date
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const apiKeys = apiKeysData?.content || [];
  const totalPages = apiKeysData?.totalPages || 0;
  const currentPage = apiKeysData?.number || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Admin" />

      <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-blue-900">API Key Management</h1>
              </div>
              <p className="text-slate-600">
                Global view of all API keys in the system. Audit-grade monitoring with irreversible revocation controls.
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900 font-medium">Security Note</p>
                <p className="text-sm text-amber-700">
                  Only masked keys are displayed for security. API keys are skeleton keys and belong under admin eyes only. Revocation is irreversible.
                </p>
              </div>
            </div>

            {/* Filters Card - Removed since backend only supports pagination */}

            {/* Table Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {/* Loading State */}
              {isLoading && (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" />
                    <span className="text-slate-600">Loading API keys...</span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-12 text-center">
                  <div className="text-red-600 font-medium">
                    Error loading API keys: {error.message}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && apiKeys.length === 0 && (
                <div className="p-12 text-center">
                  <Eye className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-lg">No API keys found</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              )}

              {/* Table */}
              {!isLoading && !error && apiKeys.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                          Key Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                          Masked Key
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                          Last Used At
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiKeys.map((key) => (
                        <tr
                          key={key.id}
                          className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                            key.status === 'REVOKED' ? 'bg-slate-100/50' : ''
                          }`}
                        >
                          <td className="px-6 py-4 text-sm text-slate-700 font-mono">
                            {key.userId}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                            {key.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                            {key.maskedKey}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                key.status === 'ACTIVE'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {key.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(key.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(key.lastUsedAt)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {key.status === 'ACTIVE' ? (
                              <button
                                onClick={() => openRevokeModal(key)}
                                disabled={revokeMutation.isPending}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Revoke this API key (irreversible)"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-xs font-medium">Revoke</span>
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!isLoading && !error && apiKeys.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                  <p className="text-sm text-slate-600">
                    Page {currentPage + 1} of {totalPages} (
                    {apiKeysData?.totalElements || 0} total keys)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0 || isLoading}
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages - 1, currentPage + 1))
                      }
                      disabled={currentPage >= totalPages - 1 || isLoading}
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Revoke Confirmation Modal */}
      <ConfirmationModal
        isOpen={revokeModal.isOpen}
        title="Revoke API Key?"
        message={`This will revoke the API key "${revokeModal.keyName}". This action is irreversible and will immediately stop all requests using this key.`}
        confirmText="Revoke Key"
        cancelText="Cancel"
        isDangerous
        isLoading={revokeMutation.isPending}
        onConfirm={handleRevokeConfirm}
        onCancel={closeRevokeModal}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {toasts.map((toast) => {
          const bgColor = getToastBgColor(toast.type);
          return (
            <div
              key={toast.id}
              className={`px-6 py-3 rounded-lg text-sm font-medium text-white animate-in fade-in-0 slide-in-from-right-4 duration-200 ${bgColor}`}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminAPIKeyManagementPage;
