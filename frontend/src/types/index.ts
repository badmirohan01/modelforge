export interface AuthResponse {
  token: string;
  email: string;
  message: string;
}

export interface ModelResponse {
  id: string;
  name: string;
  description: string;
  inputSchema: string;
  isPublic: boolean;
  createdAt: string;
  latestVersion: number;
  latestVersionId: string;
  inferEndpoint: string;
  totalCalls: number;
  avgLatencyMs: number;
}

export interface ModelUploadResponse {
  modelId: string;
  versionId: string;
  versionNumber: number;
  name: string;
  inferEndpoint: string;
  message: string;
}

export interface InferResponse {
  prediction: number | string;
  probabilities: number[] | null;
  latencyMs: number;
  modelId: string;
}

export interface InferenceLogResponse {
  id: number;
  modelId: string;
  versionId: string;
  versionNumber: number;
  status: 'SUCCESS' | 'FAILED';
  latencyMs: number;
  errorMessage: string | null;
  calledAt: string;
}

export interface ApiKeyResponse {
  id: string;
  label: string;
  rawKey: string | null;
  isActive: boolean;
  isGlobal: boolean;
  modelIds: string[];
  lastUsedAt: string | null;
  createdAt: string;
}

export interface ErrorResponse {
  message: string;
}
