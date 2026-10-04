import { ApiRequestHandler } from "./request-handler";
import { ApiRouteRegistry } from "./route-registry";
import { ApiHandler, ApiRequest, ApiResponse } from "./types";

export class ProwoApiServer {
  readonly routes: ApiRouteRegistry;
  readonly requestHandler: ApiRequestHandler;

  constructor(
    authenticate?: (request: ApiRequest) => Promise<boolean> | boolean
  ) {
    this.routes = new ApiRouteRegistry();

    this.requestHandler = new ApiRequestHandler(this.routes, {
      authenticate,
    });
  }

  async handle(request: ApiRequest): Promise<ApiResponse> {
    return this.requestHandler.handle(request);
  }

  registerRoute(
    method: string,
    path: string,
    handler: ApiHandler,
    authenticationRequired = true
  ): void {
    this.routes.register(
      method,
      path,
      handler,
      authenticationRequired
    );
  }
}

export { ProwoApiServer as ApiServer };
