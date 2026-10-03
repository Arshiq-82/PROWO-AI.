import { IdentityStore } from "./identity-store";
import { SessionManager } from "./session-manager";
import { AuthenticationResult } from "./types";

export class AuthService {
  constructor(
    private readonly identities: IdentityStore,
    private readonly sessions: SessionManager
  ) {}

  authenticateSession(sessionId: string): AuthenticationResult {
    const session = this.sessions.getSession(sessionId);

    if (!session) {
      return {
        authenticated: false,
        error: "Invalid or expired session.",
      };
    }

    const user = this.identities.getUser(session.userId);

    if (!user) {
      return {
        authenticated: false,
        error: "User identity was not found.",
      };
    }

    if (user.status !== "active") {
      return {
        authenticated: false,
        error: "User account is not active.",
      };
    }

    return {
      authenticated: true,
      userId: user.id,
      sessionId: session.id,
    };
  }

  createSessionForUser(
    userId: string,
    metadata?: Record<string, unknown>
  ): AuthenticationResult {
    const user = this.identities.getUser(userId);

    if (!user) {
      return {
        authenticated: false,
        error: "User identity was not found.",
      };
    }

    if (user.status !== "active") {
      return {
        authenticated: false,
        error: "User account is not active.",
      };
    }

    const session = this.sessions.createSession(user.id, metadata);

    return {
      authenticated: true,
      userId: user.id,
      sessionId: session.id,
    };
  }

  revokeSession(sessionId: string): boolean {
    return this.sessions.revokeSession(sessionId);
  }
}
