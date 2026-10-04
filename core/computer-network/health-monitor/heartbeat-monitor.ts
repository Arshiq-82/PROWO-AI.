import { HeartbeatRecord, HealthThresholds } from "./types";

export class HeartbeatMonitor {
  private readonly lastHeartbeats = new Map<string, HeartbeatRecord>();
  private readonly misses = new Map<string, number>();

  constructor(
    private readonly thresholds: HealthThresholds = {
      heartbeatIntervalMs: 10_000,
      degradedAfterMs: 30_000,
      offlineAfterMs: 90_000,
      maxConsecutiveMisses: 3,
      degradedLatencyMs: 1_000,
    }
  ) {}

  recordHeartbeat(heartbeat: HeartbeatRecord): void {
    this.lastHeartbeats.set(heartbeat.deviceId, heartbeat);
    this.misses.set(heartbeat.deviceId, 0);
  }

  recordMiss(deviceId: string): number {
    const count = (this.misses.get(deviceId) ?? 0) + 1;
    this.misses.set(deviceId, count);
    return count;
  }

  getLastHeartbeat(deviceId: string): HeartbeatRecord | undefined {
    const heartbeat = this.lastHeartbeats.get(deviceId);
    return heartbeat ? { ...heartbeat } : undefined;
  }

  getMisses(deviceId: string): number {
    return this.misses.get(deviceId) ?? 0;
  }

  getThresholds(): HealthThresholds {
    return { ...this.thresholds };
  }
}
