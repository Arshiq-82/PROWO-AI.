import {
  AgentAuthenticationResult,
  AgentIdentity,
} from "./types";
import { AgentTokenManager } from "./token-manager";

export class AgentAuthenticator {
  constructor(
    private readonly tokenManager: AgentTokenManager
  ) {}

  authenticate(
    token: string,
    expectedAgentId?: string
  ): AgentAuthenticationResult {
    if (!token.trim()) {
      return {
        authenticated: false,
        error: "Agent token is required.",
      };
    }

    const tokenRecord =
      this.tokenManager.verify(token);

    if (!tokenRecord) {
      return {
        authenticated: false,
        error: "Invalid or expired agent token.",
      };
    }

    if (
      expectedAgentId &&
      tokenRecord.agentId !== expectedAgentId
    ) {
      return {
        authenticated: false,
        error: "Agent identity does not match token.",
      };
    }

    return {
      authenticated: true,
      token,
    };
  }

  createIdentity(
    agentId: string,
    deviceId: string,
    deviceName: string,
    platform: string,
    version: string,
    metadata?: Record<string, unknown>
  ): AgentIdentity {
    return {
      agentId,
      deviceId,
      deviceName,
      platform,
      version,
      createdAt: new Date().toISOString(),
      metadata,
    };
  }
}
