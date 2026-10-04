import {
  OrchestrationController,
  OrchestrationHttpRequest,
  OrchestrationHttpResponse,
} from "../orchestration/orchestration-controller";
import { AuthenticatedRequestResolver } from "./authenticated-request";
import { AuthenticationRequest } from "./authentication-types";

export interface AuthenticatedOrchestrationRequest
  extends OrchestrationHttpRequest {
  headers?: Record<string, string | undefined>;
  auth?: AuthenticationRequest;
}

export class AuthenticatedOrchestrationController {
  constructor(
    private readonly resolver: AuthenticatedRequestResolver,
    private readonly orchestration: OrchestrationController
  ) {}

  async submit(
    request: AuthenticatedOrchestrationRequest
  ): Promise<OrchestrationHttpResponse> {
    const authentication = await this.resolver.resolve(
      request.auth ?? {
        authorization:
          request.headers?.authorization ??
          request.headers?.Authorization,
      }
    );

    if (!authentication.identity) {
      return {
        statusCode: 401,
        body: {
          error: authentication.error ?? "Authentication required.",
        },
      };
    }

    return this.orchestration.submit({
      ...request,
      body: {
        ...request.body,
        userId: authentication.identity.userId,
      },
    });
  }

  async execute(
    request: AuthenticatedOrchestrationRequest
  ): Promise<OrchestrationHttpResponse> {
    const authentication = await this.resolver.resolve(
      request.auth ?? {
        authorization:
          request.headers?.authorization ??
          request.headers?.Authorization,
      }
    );

    if (!authentication.identity) {
      return {
        statusCode: 401,
        body: {
          error: authentication.error ?? "Authentication required.",
        },
      };
    }

    return this.orchestration.execute(request);
  }
}
