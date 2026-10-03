import { Session } from "./types";

export interface SessionManagerOptions {
  defaultLifetimeMs?: number;
}

export class SessionManager {
  private readonly sessions = new Map<string, Session>();
  private readonly defaultLifetimeMs: number;

  constructor(options: SessionManagerOptions = {}) {
    this.defaultLifetimeMs =
      options.defaultLifetimeMs ?? 1000 * 60 * 60 * 24;
  }

  createSession(
    userId: string,
    metadata?: Record<string, unknown>,
    lifetimeMs = this.defaultLifetimeMs
  ): Session {
    const now = Date.now();

    const session: Session = {
      id: this.createId(),
      userId,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + lifetimeMs).toISOString(),
      metadata,
    };

    this.sessions.set(session.id, session);
    return { ...session };
  }

  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return undefined;
    }

    if (this.isExpired(session)) {
      this.revokeSession(sessionId);
      return undefined;
    }

    return { ...session };
  }

  revokeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session || session.revokedAt) {
      return false;
    }

    const revoked: Session = {
      ...session,
      revokedAt: new Date().toISOString(),
    };

    this.sessions.set(sessionId, revoked);
    return true;
  }

  isValid(sessionId: string): boolean {
    return this.getSession(sessionId) !== undefined;
  }

  private isExpired(session: Session): boolean {
    return Date.now() >= new Date(session.expiresAt).getTime();
  }

  private createId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}
