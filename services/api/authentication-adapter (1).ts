import {
  AuthenticationPort,
  AuthenticationRequest,
  AuthenticationResult,
} from "./authentication-types";
import { AuthService } from "../authentication/auth-service";

export interface AuthServicePort {
  authenticateSession(sessionId: string): {
    authenticated: boolean;
    userId?: string;
    sessionId?: string;
    error?: string;
  };
}

export class AuthenticationAdapter implements AuthenticationPort {
  constructor(private readonly authService: AuthServicePort) {}

  async authenticate(
    request: AuthenticationRequest
  ): Promise<AuthenticationResult> {
    const sessionId = this.resolveSessionId(request);

    if (!sessionId) {
      return {
        authenticated: false,
        error: "Authentication session is required.",
      };
    }

    const result = this.authService.authenticateSession(sessionId);

    if (!result.authenticated || !result.userId) {
      return {
        authenticated: false,
        error: result.error ?? "Authentication failed.",
      };
    }

    return {
      authenticated: true,
      identity: {
        userId: result.userId,
        sessionId: result.sessionId ?? sessionId,
        roles: [],
      },
    };
  }

  private resolveSessionId(request: AuthenticationRequest): string | undefined {
    if (request.sessionId) {
      return request.sessionId;
    }

    const authorization = request.authorization?.trim();

    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.split(/\s+/, 2);

    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return undefined;
    }

    return token;
  }
}
