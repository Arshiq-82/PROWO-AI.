export type IntegrationCategory =
  | "ai"
  | "database"
  | "storage"
  | "communication"
  | "productivity"
  | "payments"
  | "analytics"
  | "custom";

export type IntegrationAuthType =
  | "api_key"
  | "bearer"
  | "basic"
  | "oauth2"
  | "none";

export interface IntegrationDefinition {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  baseUrl?: string;
  authType: IntegrationAuthType;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

export interface IntegrationCredential {
  integrationId: string;
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface IntegrationRequest {
  integrationId: string;
  userId: string;
  method: string;
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
}

export interface IntegrationResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  data?: T;
  error?: string;
}
