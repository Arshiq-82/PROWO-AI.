import { AgentCommand, AgentEvent } from "../protocol/types";
import { AgentGateway } from "../agent-gateway/agent-gateway";
import { GatewaySessionAuthenticator } from "./session-authenticator";
import { GatewaySecurity } from "./gateway-security";
import {
  GatewayAuthRequest,
  GatewayAuthResult,
} from "./types";

export class AuthenticatedAgentGateway {
  constructor(
    private readonly gateway: AgentGateway,
    private readonly authenticator:
      GatewaySessionAuthenticator,
    private readonly security: GatewaySecurity =
      new GatewaySecurity()
  ) {}

  authenticate(
    request: GatewayAuthRequest
  ): GatewayAuthResult {
    return this.authenticator.authenticate(
      request
    );
  }

  async send(
    sessionId: string,
    command: AgentCommand
  ): Promise<void> {
    const session =
      this.authenticator.get(sessionId);

    const security =
      this.security.check(
        session,
        command.deviceId
      );

    if (!security.allowed) {
      throw new Error(
        security.reason ??
          "Gateway security check failed."
      );
    }

    this.authenticator.touch(sessionId);

    await this.gateway.send(
      sessionId,
      command
    );
  }

  async receive(
    sessionId: string,
    raw: unknown
  ): Promise<AgentEvent> {
    const session =
      this.authenticator.get(sessionId);

    const security =
      this.security.check(session);

    if (!security.allowed) {
      throw new Error(
        security.reason ??
          "Gateway security check failed."
      );
    }

    this.authenticator.touch(sessionId);

    return this.gateway.handleMessage(
      sessionId,
      raw
    );
  }

  revoke(sessionId: string): void {
    this.authenticator.revoke(sessionId);
  }
}
