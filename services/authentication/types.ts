export type IdentityStatus = "active" | "suspended" | "disabled";

export interface UserIdentity {
  id: string;
  email: string;
  displayName?: string;
  status: IdentityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialRecord {
  userId: string;
  provider: string;
  credentialId: string;
  secretHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AuthenticationResult {
  authenticated: boolean;
  userId?: string;
  sessionId?: string;
  error?: string;
}
