import {
  DeviceHealthSnapshot,
  DeviceHealthStatus,
  HealthThresholds,
  HeartbeatRecord,
} from "./types";

export class DeviceHealthEvaluator {
  constructor(
    private readonly thresholds: HealthThresholds = {
      heartbeatIntervalMs: 10_000,
      degradedAfterMs: 30_000,
      offlineAfterMs: 90_000,
      maxConsecutiveMisses: 3,
      degradedLatencyMs: 1_000,
    }
  ) {}

  evaluate(
    deviceId: string,
    heartbeat: HeartbeatRecord | undefined,
    consecutiveMisses: number,
    now = new Date()
  ): DeviceHealthSnapshot {
    const checkedAt = now.toISOString();

    if (!heartbeat) {
      return {
        deviceId,
        status: "unknown",
        consecutiveMisses,
        checkedAt,
        reasons: ["No heartbeat has been received."],
      };
    }

    const heartbeatAgeMs = Math.max(
      0,
      now.getTime() - new Date(heartbeat.timestamp).getTime()
    );

    const reasons: string[] = [];
    let status: DeviceHealthStatus = "healthy";

    if (
      heartbeatAgeMs >= this.thresholds.offlineAfterMs ||
      consecutiveMisses >= this.thresholds.maxConsecutiveMisses
    ) {
      status = "offline";
      reasons.push("Heartbeat is outside the offline threshold.");
    } else if (
      heartbeatAgeMs >= this.thresholds.degradedAfterMs ||
      (heartbeat.latencyMs ?? 0) >= this.thresholds.degradedLatencyMs
    ) {
      status = "degraded";
      reasons.push("Heartbeat freshness or latency indicates degradation.");
    }

    return {
      deviceId,
      status,
      lastHeartbeatAt: heartbeat.timestamp,
      heartbeatAgeMs,
      latencyMs: heartbeat.latencyMs,
      consecutiveMisses,
      checkedAt,
      reasons,
      metadata: heartbeat.metadata,
    };
  }
}
