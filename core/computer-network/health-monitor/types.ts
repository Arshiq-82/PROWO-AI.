export type DeviceHealthStatus =
  | "healthy"
  | "degraded"
  | "unresponsive"
  | "offline"
  | "unknown";

export interface HeartbeatRecord {
  deviceId: string;
  timestamp: string;
  latencyMs?: number;
  sequence?: number;
  metadata?: Record<string, unknown>;
}

export interface DeviceHealthSnapshot {
  deviceId: string;
  status: DeviceHealthStatus;
  lastHeartbeatAt?: string;
  heartbeatAgeMs?: number;
  latencyMs?: number;
  consecutiveMisses: number;
  checkedAt: string;
  reasons: string[];
  metadata?: Record<string, unknown>;
}

export interface HealthThresholds {
  heartbeatIntervalMs: number;
  degradedAfterMs: number;
  offlineAfterMs: number;
  maxConsecutiveMisses: number;
  degradedLatencyMs: number;
}

export interface HealthResult {
  deviceId: string;
  status: DeviceHealthStatus;
  snapshot: DeviceHealthSnapshot;
}
