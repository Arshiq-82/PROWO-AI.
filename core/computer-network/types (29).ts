export interface AgentRegistrationRequest {
  deviceId: string;
  deviceName: string;
  platform: string;
  version: string;
  registrationKey: string;
  metadata?: Record<string, unknown>;
}

export interface AgentIdentity {
  agentId: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  version: string;
  createdAt: string;
  lastAuthenticatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentAuthToken {
  tokenId: string;
  agentId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt?: string;
  revokedAt?: string;
}

export interface AgentAuthenticationResult {
  authenticated: boolean;
  agent?: AgentIdentity;
  token?: string;
  error?: string;
}

export interface AgentRegistrationResult {
  registered: boolean;
  agent?: AgentIdentity;
  token?: string;
  error?: string;
}
