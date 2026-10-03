import { ApiRouteRegistry } from "./route-registry";
import { ApiRequest, ApiResponse } from "./types";

export interface ApiRequestHandlerOptions {
  authenticate?: (request: ApiRequest) => Promise<boolean> | boolean;
}

export class ApiRequestHandler {
  constructor(
    private readonly routes: ApiRouteRegistry,
    private readonly options: ApiRequestHandlerOptions = {}
  ) {}

  async handle(request: ApiRequest): Promise<ApiResponse> {
    const route = this.routes.get(request.method, request.path);

    if (!route) {
      return this.json(404, {
        error: "Route not found.",
        path: request.path,
      });
    }

    if (route.authenticationRequired) {
      const authenticated = await this.options.authenticate?.(request);

      if (!authenticated) {
        return this.json(401, {
          error: "Authentication required.",
        });
      }
    }

    try {
      return await route.handler(request);
    } catch (error) {
      return this.json(500, {
        error: error instanceof Error ? error.message : "Internal server error.",
      });
    }
  }

  private json(status: number, body: unknown): ApiResponse {
    return {
      status,
      headers: {
        "content-type": "application/json",
      },
      body,
    };
  }
}
