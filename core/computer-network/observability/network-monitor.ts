import { NetworkLogger } from "./network-logger";
import { NetworkMetricsCollector } from "./metrics-collector";
import { NetworkHealthReport, NetworkSnapshot } from "./types";

export class NetworkMonitor {
  constructor(
    private readonly logger: NetworkLogger = new NetworkLogger(),
    private readonly metrics: NetworkMetricsCollector = new NetworkMetricsCollector()
  ) {}

  recordSnapshot(snapshot: NetworkSnapshot): NetworkHealthReport {
    this.metrics.gauge("network.connected_devices", snapshot.connectedDevices);
    this.metrics.gauge("network.healthy_devices", snapshot.healthyDevices);
    this.metrics.gauge("network.degraded_devices", snapshot.degradedDevices);
    this.metrics.gauge("network.offline_devices", snapshot.offlineDevices);
    this.metrics.gauge("network.queued_tasks", snapshot.queuedTasks);
    this.metrics.gauge("network.running_tasks", snapshot.runningTasks);
    this.metrics.gauge("network.completed_tasks", snapshot.completedTasks);
    this.metrics.gauge("network.failed_tasks", snapshot.failedTasks);

    if (snapshot.averageLatencyMs !== undefined) {
      this.metrics.histogram(
        "network.average_latency_ms",
        snapshot.averageLatencyMs
      );
    }

    const warnings: string[] = [];

    if (snapshot.offlineDevices > 0) {
      warnings.push(`${snapshot.offlineDevices} device(s) are offline.`);
    }

    if (snapshot.degradedDevices > 0) {
      warnings.push(`${snapshot.degradedDevices} device(s) are degraded.`);
    }

    if (snapshot.failedTasks > 0) {
      warnings.push(`${snapshot.failedTasks} task(s) have failed.`);
    }

    if (
      snapshot.queuedTasks > 0 &&
      snapshot.runningTasks === 0
    ) {
      warnings.push("Tasks are queued but no tasks are currently running.");
    }

    const healthy = warnings.length === 0;

    this.logger.info(
      "network.snapshot",
      healthy
        ? "Network snapshot is healthy."
        : "Network snapshot contains warnings.",
      { metadata: { snapshot, warnings } }
    );

    return {
      healthy,
      snapshot: { ...snapshot },
      warnings,
    };
  }

  getLogger(): NetworkLogger {
    return this.logger;
  }

  getMetrics(): NetworkMetricsCollector {
    return this.metrics;
  }
}
