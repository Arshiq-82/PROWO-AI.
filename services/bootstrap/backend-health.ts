export interface BackendHealth {
  status: "starting" | "ready" | "stopped";
  timestamp: string;
  services: {
    api: "ready" | "stopped";
    orchestration: "ready" | "stopped";
    authentication: "ready" | "stopped";
    database: "ready" | "stopped";
  };
}

export class BackendHealthMonitor {
  private status: BackendHealth["status"] = "stopped";

  markReady(): void {
    this.status = "ready";
  }

  markStarting(): void {
    this.status = "starting";
  }

  markStopped(): void {
    this.status = "stopped";
  }

  snapshot(): BackendHealth {
    const ready = this.status === "ready";

    return {
      status: this.status,
      timestamp: new Date().toISOString(),
      services: {
        api: ready ? "ready" : "stopped",
        orchestration: ready ? "ready" : "stopped",
        authentication: ready ? "ready" : "stopped",
        database: ready ? "ready" : "stopped",
      },
    };
  }
}
