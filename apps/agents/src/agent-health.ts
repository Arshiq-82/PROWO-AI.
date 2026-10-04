export interface AgentHealthSnapshot {
  deviceId: string;
  status: "starting" | "healthy" | "degraded" | "offline";
  lastHeartbeatAt?: string;
  latencyMs?: number;
  error?: string;
}

export class AgentHealth {
  private snapshotValue: AgentHealthSnapshot;

  constructor(deviceId: string) {
    this.snapshotValue = {
      deviceId,
      status: "starting",
    };
  }

  markHealthy(latencyMs?: number): void {
    this.snapshotValue = {
      ...this.snapshotValue,
      status: "healthy",
      lastHeartbeatAt: new Date().toISOString(),
      latencyMs,
      error: undefined,
    };
  }

  markDegraded(error?: string): void {
    this.snapshotValue = {
      ...this.snapshotValue,
      status: "degraded",
      error,
    };
  }

  markOffline(error?: string): void {
    this.snapshotValue = {
      ...this.snapshotValue,
      status: "offline",
      error,
    };
  }

  snapshot(): AgentHealthSnapshot {
    return { ...this.snapshotValue };
  }
}
