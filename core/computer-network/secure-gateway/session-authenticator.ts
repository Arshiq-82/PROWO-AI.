import { AgentRegistrationService } from "../agent-auth/registration-service";
import { AgentGateway } from "../agent-gateway/agent-gateway";
import {
  GatewayAuthRequest,
  GatewayAuthResult,
  SecureGatewaySession,
} from "./types";

export class GatewaySessionAuthenticator {
  private readonly authenticated =
    new Map<string, SecureGatewaySession>();

  constructor(
    private readonly registration:
      AgentRegistrationService,
    private readonly gateway: AgentGateway
  ) {}

  authenticate(
    request: GatewayAuthRequest
  ): GatewayAuthResult {
    const session =
      this.gateway.getSession(request.sessionId);

    if (!session) {
      return {
        authenticated: false,
        error: "Gateway session not found.",
      };
    }

    if (session.deviceId !== request.deviceId) {
      return {
        authenticated: false,
        error: "Device does not match gateway session.",
      };
    }

    const result =
      this.registration.authenticate(
        request.token
      );

    if (
      !result.authenticated ||
      !result.agent
    ) {
      return {
        authenticated: false,
        error:
          result.error ??
          "Agent authentication failed.",
      };
    }

    if (result.agent.deviceId !== request.deviceId) {
      return {
        authenticated: false,
        error: "Authenticated agent does not match device.",
      };
    }

    const now = new Date().toISOString();

    const secureSession: SecureGatewaySession = {
      session: { ...session },
      agentId: result.agent.agentId,
      authenticatedAt: now,
      lastVerifiedAt: now,
    };

    this.authenticated.set(
      request.sessionId,
      secureSession
    );

    return {
      authenticated: true,
      session: { ...secureSession },
    };
  }

  get(
    sessionId: string
  ): SecureGatewaySession | undefined {
    const session = this.authenticated.get(sessionId);
    return session ? { ...session } : undefined;
  }

  revoke(sessionId: string): void {
    this.authenticated.delete(sessionId);
  }

  touch(sessionId: string): void {
    const session = this.authenticated.get(sessionId);

    if (session) {
      session.lastVerifiedAt =
        new Date().toISOString();
    }
  }
}
