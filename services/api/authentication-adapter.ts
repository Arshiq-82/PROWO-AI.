import {
  AuthenticationPort,
  AuthenticationRequest,
  AuthenticationResult,
} from "./authentication-types";

export interface AuthServicePort {
  authenticateSession?: (sessionId: string) => {
    authenticated: boolean;
    userId?: string;
    sessionId?: string;
    error?: string;
  };
  authenticate?: (request: AuthenticationRequest) =>
    | AuthenticationResult
    | Promise<AuthenticationResult>;
}

export class AuthenticationAdapter implements AuthenticationPort {
  constructor(private readonly authService: AuthServicePort) {}

  async authenticate(
    request: AuthenticationRequest
  ): Promise<AuthenticationResult> {
    if (this.authService.authenticate) {
      const result = await this.authService.authenticate(request);
      if (!result.authenticated || !result.identity) {
        return { authenticated: false, error: result.error ?? "Authentication failed." };
      }
      return result;
    }

    const sessionId = this.resolveSessionId(request);
    if (!sessionId || !this.authService.authenticateSession) {
      return { authenticated: false, error: "Authentication session is required." };
    }

    const result = this.authService.authenticateSession(sessionId);
    if (!result.authenticated || !result.userId) {
      return { authenticated: false, error: result.error ?? "Authentication failed." };
    }

    return {
      authenticated: true,
      identity: { userId: result.userId, sessionId: result.sessionId ?? sessionId, roles: [] },
    };
  }

  private resolveSessionId(request: AuthenticationRequest): string | undefined {
    if (request.sessionId) return request.sessionId;
    const authorization = request.authorization?.trim();
    if (!authorization) return undefined;
    const [scheme, token] = authorization.split(/\s+/, 2);
    return scheme?.toLowerCase() === "bearer" && token ? token : undefined;
  }
}
