export interface AuthenticatedIdentity {
  userId: string;
  sessionId?: string;
  roles: string[];
  metadata?: Record<string, unknown>;
}

export interface AuthenticationRequest {
  authorization?: string;
  sessionId?: string;
}

export interface AuthenticationResult {
  authenticated: boolean;
  identity?: AuthenticatedIdentity;
  error?: string;
}

export interface AuthenticationPort {
  authenticate(request: AuthenticationRequest): Promise<AuthenticationResult>;
}

export interface AuthenticatedRequestContext {
  identity: AuthenticatedIdentity;
}
