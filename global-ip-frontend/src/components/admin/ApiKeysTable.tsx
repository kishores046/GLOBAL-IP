/**
 * API Keys List Table
 * Table displaying API keys with actions
 */

import { Trash2, Key, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { ApiKeyResponse } from '../../types/apiKey';

interface ApiKeysTableProps {
  keys: ApiKeyResponse[];
  isLoading: boolean;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
  onRevoke: (id: string, name: string) => void;
}

export function ApiKeysTable({
  keys,
  isLoading,
  isAdmin,
  hasActiveSubscription,
  onRevoke,
}: ApiKeysTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-center text-slate-600 mt-3">Loading API keys...</p>
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Key className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No API Keys Yet</h3>
          <p className="text-slate-600 mt-2">Create your first API key to get started with programmatic access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-slate-700">Name</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-slate-700">Key</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-slate-700">Status</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-slate-700">Created</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-slate-700">Last Used</span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-semibold text-slate-700">Actions</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200">
            {keys.map((key) => (
              <tr key={key.id} className="hover:bg-slate-50 transition">
                {/* Name */}
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">{key.name}</p>
                </td>

                {/* Masked Key */}
                <td className="px-6 py-4">
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                    {key.maskedKey}
                  </code>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {key.status === 'ACTIVE' ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          Revoked
                        </span>
                      </>
                    )}
                  </div>
                </td>

                {/* Created At */}
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">
                    {format(new Date(key.createdAt), 'MMM d, yyyy')}
                  </p>
                </td>

                {/* Last Used At */}
                <td className="px-6 py-4">
                  {key.lastUsedAt ? (
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="w-3 h-3" />
                      {format(new Date(key.lastUsedAt), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Never</p>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  {key.status === 'ACTIVE' && isAdmin && hasActiveSubscription ? (
                    <button
                      onClick={() => onRevoke(key.id, key.name)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                      title="Revoke this API key"
                    >
                      <Trash2 className="w-4 h-4" />
                      Revoke
                    </button>
                  ) : key.status === 'REVOKED' ? (
                    <span className="text-xs text-slate-400 italic">No actions available</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
