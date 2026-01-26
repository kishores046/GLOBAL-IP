/**
 * API Key Settings Page
 * Page for managing API keys with subscription awareness
 */

import { useEffect, useState, useContext } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { AnalystSidebar } from '../components/dashboard/AnalystSidebar';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';
import { Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import apiKeyService from '../services/apiKeyService';
import { CreateApiKeyModal } from '../components/admin/CreateApiKeyModal';
import { RevokeApiKeyModal } from '../components/admin/RevokeApiKeyModal';
import { ApiKeysTable } from '../components/admin/ApiKeysTable';
import type { ApiKeyResponse } from '../types/apiKey';
import { toast } from 'sonner';
import { ROLES } from '../routes/routeConfig';

export function ApiKeySettingsPage() {
  const { user, hasRole, getRole } = useAuth();
  const { isActive: hasActiveSubscription } = useSubscription();

  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');
  const [selectedKeyName, setSelectedKeyName] = useState<string>('');

  // Check if user is admin
  const isAdmin = hasRole([ROLES.ADMIN]);
  
  // Check if user is analyst - with fallback checks
  const userRole = getRole()?.toUpperCase();
  const allRoles = user?.roles?.map(r => typeof r === 'string' ? r.toUpperCase() : r?.roleType?.toUpperCase()).filter(Boolean) || [];
  const isAnalyst = userRole === ROLES.ANALYST || allRoles.includes(ROLES.ANALYST);
  const isInAnalystLayout = useContext(AnalystLayoutContext);
  
  // Debug logging
  console.log('ApiKeySettingsPage - Role Check:', { userRole, allRoles, isAnalyst, ROLES_ANALYST: ROLES.ANALYST });

  // Load API keys on mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      const keys = await apiKeyService.getApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApiKey = async (): Promise<string> => {
    try {
      const response = await apiKeyService.createApiKey();
      // Refresh the list to show the new key
      await loadApiKeys();
      return response.apiKey;
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error;
    }
  };

  const handleRevokeClick = (id: string, name: string) => {
    setSelectedKeyId(id);
    setSelectedKeyName(name);
    setShowRevokeModal(true);
  };

  const handleConfirmRevoke = async () => {
    try {
      setIsCreating(true);
      await apiKeyService.revokeApiKey(selectedKeyId);
      toast.success('API key revoked successfully');
      await loadApiKeys();
      setShowRevokeModal(false);
      setSelectedKeyId('');
      setSelectedKeyName('');
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      toast.error('Failed to revoke API key');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        {!isInAnalystLayout && (isAnalyst ? <AnalystSidebar /> : <Sidebar />)}

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-blue-900 mb-2">
                    API Keys
                  </h1>
                  <p className="text-slate-600">
                    API keys allow programmatic access to Global IP monitoring APIs.
                    An active subscription is required for API usage.
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Key className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Create Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                title="Create a new API key for programmatic access"
              >
                <Key className="w-4 h-4" />
                Create API Key
              </button>
            </div>

            {/* API Keys Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-md">
              <ApiKeysTable
                keys={apiKeys}
                isLoading={isLoading}
                isAdmin={isAdmin}
                hasActiveSubscription={hasActiveSubscription}
                onRevoke={handleRevokeClick}
              />
            </div>

            {/* Usage Hint */}
            {apiKeys.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  How to Use Your API Key
                </h3>
                <p className="text-sm text-blue-800">
                  Include your API key in the X-API-KEY header for all API requests:
                </p>
                <pre className="mt-3 bg-blue-900 text-blue-100 p-3 rounded text-xs overflow-x-auto">
                  {`X-API-KEY: YOUR_API_KEY_HERE`}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateApiKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateApiKey}
        isLoading={isCreating}
      />

      <RevokeApiKeyModal
        isOpen={showRevokeModal}
        keyName={selectedKeyName}
        isLoading={isCreating}
        onConfirm={handleConfirmRevoke}
        onCancel={() => {
          setShowRevokeModal(false);
          setSelectedKeyId('');
          setSelectedKeyName('');
        }}
      />
    </div>
  );
}
