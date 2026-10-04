import { DeviceHealthEvaluator } from "./device-health";
import { HeartbeatMonitor } from "./heartbeat-monitor";
import {
  DeviceHealthSnapshot,
  HealthResult,
  HeartbeatRecord,
  HealthThresholds,
} from "./types";

export class DeviceHealthManager {
  private readonly snapshots = new Map<string, DeviceHealthSnapshot>();

  constructor(
    private readonly heartbeatMonitor: HeartbeatMonitor = new HeartbeatMonitor(),
    private readonly evaluator: DeviceHealthEvaluator = new DeviceHealthEvaluator()
  ) {}

  heartbeat(heartbeat: HeartbeatRecord): HealthResult {
    this.heartbeatMonitor.recordHeartbeat(heartbeat);

    const snapshot = this.evaluator.evaluate(
      heartbeat.deviceId,
      heartbeat,
      0
    );

    this.snapshots.set(heartbeat.deviceId, snapshot);
    return {
      deviceId: heartbeat.deviceId,
      status: snapshot.status,
      snapshot: { ...snapshot, reasons: [...snapshot.reasons] },
    };
  }

  miss(deviceId: string): HealthResult {
    const misses = this.heartbeatMonitor.recordMiss(deviceId);
    const snapshot = this.evaluator.evaluate(
      deviceId,
      this.heartbeatMonitor.getLastHeartbeat(deviceId),
      misses
    );

    this.snapshots.set(deviceId, snapshot);
    return {
      deviceId,
      status: snapshot.status,
      snapshot: { ...snapshot, reasons: [...snapshot.reasons] },
    };
  }

  check(deviceId: string, now = new Date()): HealthResult {
    const snapshot = this.evaluator.evaluate(
      deviceId,
      this.heartbeatMonitor.getLastHeartbeat(deviceId),
      this.heartbeatMonitor.getMisses(deviceId),
      now
    );

    this.snapshots.set(deviceId, snapshot);
    return {
      deviceId,
      status: snapshot.status,
      snapshot: { ...snapshot, reasons: [...snapshot.reasons] },
    };
  }

  get(deviceId: string): DeviceHealthSnapshot | undefined {
    const snapshot = this.snapshots.get(deviceId);
    return snapshot
      ? { ...snapshot, reasons: [...snapshot.reasons] }
      : undefined;
  }

  list(): DeviceHealthSnapshot[] {
    return [...this.snapshots.values()].map((snapshot) => ({
      ...snapshot,
      reasons: [...snapshot.reasons],
    }));
  }

  isAvailable(deviceId: string): boolean {
    const snapshot = this.snapshots.get(deviceId);
    return snapshot?.status === "healthy" || snapshot?.status === "degraded";
  }

  thresholds(): HealthThresholds {
    return this.heartbeatMonitor.getThresholds();
  }
}
