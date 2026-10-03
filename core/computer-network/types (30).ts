import { AgentGatewaySession } from "../agent-gateway/types";
import { AgentAuthenticationResult } from "../agent-auth/types";

export interface SecureGatewaySession {
  session: AgentGatewaySession;
  agentId: string;
  authenticatedAt: string;
  lastVerifiedAt: string;
}

export interface GatewayAuthRequest {
  sessionId: string;
  token: string;
  deviceId: string;
}

export interface GatewayAuthResult {
  authenticated: boolean;
  session?: SecureGatewaySession;
  error?: string;
}

export interface GatewaySecurityPolicy {
  requireAuthentication: boolean;
  verifyDeviceIdentity: boolean;
  maxSessionAgeMs: number;
}

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
}
