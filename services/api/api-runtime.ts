import { ApiServer } from "./api-server";
import { BackendApplication } from "../bootstrap/types";

export interface ApiRuntime {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface ApiServerPort {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export class BackendApiRuntime implements ApiRuntime {
  constructor(
    private readonly server: ApiServerPort,
    private readonly backend: BackendApplication
  ) {}

  async start(): Promise<void> {
    await this.backend.start();
    await this.server.start();
  }

  async stop(): Promise<void> {
    await this.server.stop();
    await this.backend.stop();
  }
}
