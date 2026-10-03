import {
  AgentIdentity,
  AgentRegistrationRequest,
  AgentRegistrationResult,
} from "./types";
import { AgentTokenManager } from "./token-manager";
import { AgentAuthenticator } from "./agent-authenticator";

export class AgentRegistrationService {
  private readonly agents = new Map<
    string,
    AgentIdentity
  >();

  constructor(
    private readonly tokenManager: AgentTokenManager,
    private readonly authenticator: AgentAuthenticator
  ) {}

  register(
    request: AgentRegistrationRequest
  ): AgentRegistrationResult {
    try {
      this.validate(request);

      const agentId =
        this.createAgentId(request.deviceId);

      const identity =
        this.authenticator.createIdentity(
          agentId,
          request.deviceId,
          request.deviceName,
          request.platform,
          request.version,
          request.metadata
        );

      const issued =
        this.tokenManager.issue(agentId);

      this.agents.set(agentId, identity);

      return {
        registered: true,
        agent: { ...identity },
        token: issued.token,
      };
    } catch (error) {
      return {
        registered: false,
        error:
          error instanceof Error
            ? error.message
            : "Agent registration failed.",
      };
    }
  }

  get(agentId: string): AgentIdentity | undefined {
    const agent = this.agents.get(agentId);
    return agent ? { ...agent } : undefined;
  }

  list(): AgentIdentity[] {
    return [...this.agents.values()].map(
      (agent) => ({ ...agent })
    );
  }

  revoke(agentId: string): boolean {
    const agent = this.agents.get(agentId);

    if (!agent) {
      return false;
    }

    this.tokenManager.revokeForAgent(agentId);
    this.agents.delete(agentId);
    return true;
  }

  authenticate(
    token: string,
    agentId?: string
  ) {
    const result =
      this.authenticator.authenticate(
        token,
        agentId
      );

    if (!result.authenticated || !result.agent) {
      const resolvedAgentId = agentId;

      if (resolvedAgentId) {
        const agent = this.agents.get(
          resolvedAgentId
        );

        if (agent) {
          result.agent = { ...agent };
        }
      }

      return result;
    }

    const agent = this.agents.get(
      result.agent.agentId
    );

    if (!agent) {
      return {
        authenticated: false,
        error: "Agent is no longer registered.",
      };
    }

    agent.lastAuthenticatedAt =
      new Date().toISOString();

    result.agent = { ...agent };
    return result;
  }

  private validate(
    request: AgentRegistrationRequest
  ): void {
    if (!request.deviceId.trim()) {
      throw new Error("deviceId is required.");
    }

    if (!request.deviceName.trim()) {
      throw new Error("deviceName is required.");
    }

    if (!request.platform.trim()) {
      throw new Error("platform is required.");
    }

    if (!request.version.trim()) {
      throw new Error("version is required.");
    }

    if (!request.registrationKey.trim()) {
      throw new Error(
        "registrationKey is required."
      );
    }
  }

  private createAgentId(deviceId: string): string {
    return `agent_${deviceId}_${Date.now()}`;
  }
}
