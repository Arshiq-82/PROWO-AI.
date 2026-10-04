import {
  AuthenticationPort,
  AuthenticatedIdentity,
  AuthenticationRequest,
}from "./authentication-types";

export interface ResolveIdentityResult {
  identity?: AuthenticatedIdentity;
  error?: string;
}

export class AuthenticatedRequestResolver {
  constructor(private readonly authentication: AuthenticationPort) {}

  async resolve(
    request: AuthenticationRequest
  ): Promise<ResolveIdentityResult> {
    const result = await this.authentication.authenticate(request);

    if (!result.authenticated || !result.identity) {
      return {
        error: result.error ?? "Authentication required.",
      };
    }

    return {
      identity: result.identity,
    };
  }
}
