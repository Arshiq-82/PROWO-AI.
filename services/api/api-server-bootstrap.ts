import { BackendApplication } from "../bootstrap/types";
import { ApiServerPort, BackendApiRuntime } from "./api-runtime";
import { createApiRuntime } from "./create-api-runtime";

export interface ApiServerBootstrapDependencies {
  server: ApiServerPort;
  backend: BackendApplication;
}

export class ApiServerBootstrap {
  private readonly runtime: BackendApiRuntime;

  constructor(dependencies: ApiServerBootstrapDependencies) {
    this.runtime = createApiRuntime(dependencies);
  }

  start(): Promise<void> {
    return this.runtime.start();
  }

  stop(): Promise<void> {
    return this.runtime.stop();
  }
}
