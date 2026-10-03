import {
  AgentGatewaySession,
  AgentGatewaySessionState,
} from "./types";

export class ConnectionSessionManager {
  private readonly sessions = new Map<
    string,
    AgentGatewaySession
  >();

  create(
    sessionId: string,
    deviceId: string,
    metadata?: Record<string, unknown>
  ): AgentGatewaySession {
    const now = new Date().toISOString();

    const session: AgentGatewaySession = {
      sessionId,
      deviceId,
      state: "connected",
      connectedAt: now,
      lastSeenAt: now,
      metadata,
    };

    this.sessions.set(sessionId, session);
    return { ...session };
  }

  get(
    sessionId: string
  ): AgentGatewaySession | undefined {
    const session = this.sessions.get(sessionId);
    return session ? { ...session } : undefined;
  }

  list(): AgentGatewaySession[] {
    return [...this.sessions.values()].map((session) => ({
      ...session,
    }));
  }

  forDevice(
    deviceId: string
  ): AgentGatewaySession[] {
    return this.list().filter(
      (session) => session.deviceId === deviceId
    );
  }

  touch(sessionId: string): void {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return;
    }

    session.lastSeenAt = new Date().toISOString();
    session.state = "connected";
  }

  setState(
    sessionId: string,
    state: AgentGatewaySessionState
  ): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      session.state = state;
    }
  }

  remove(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
