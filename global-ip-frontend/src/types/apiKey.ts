/**
 * API Key Types
 * TypeScript interfaces for API Key management
 */

export type ApiKeyStatus = 'ACTIVE' | 'REVOKED';

export interface ApiKey {
  id: string;
  name: string;
  maskedKey: string; // e.g., "abcd12••••"
  status: ApiKeyStatus;
  createdAt: string; // ISO format
  lastUsedAt?: string; // ISO format, optional
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  maskedKey: string;
  status: ApiKeyStatus;
  createdAt: string;
  lastUsedAt?: string;
}

export interface CreateApiKeyRequest {
  name: string;
}

export interface CreateApiKeyResponse {
  apiKey: string; // Full API key shown only once (per backend: CreatedApiKey.apiKey)
}

export interface RevokeApiKeyRequest {
  id: string;
}

export interface ApiKeyListResponse extends Array<ApiKeyResponse> {}
