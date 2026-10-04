export type NetworkLogLevel = "debug" | "info" | "warn" | "error";

export type NetworkMetricType =
  | "counter"
  | "gauge"
  | "histogram";

export interface NetworkLogEntry {
  id: string;
  timestamp: string;
  level: NetworkLogLevel;
  event: string;
  deviceId?: string;
  taskId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface NetworkMetric {
  name: string;
  type: NetworkMetricType;
  value: number;
  timestamp: string;
  labels?: Record<string, string>;
}

export interface NetworkSnapshot {
  timestamp: string;
  connectedDevices: number;
  healthyDevices: number;
  degradedDevices: number;
  offlineDevices: number;
  queuedTasks: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageLatencyMs?: number;
}

export interface NetworkHealthReport {
  healthy: boolean;
  snapshot: NetworkSnapshot;
  warnings: string[];
}
