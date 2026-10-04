export interface SystemResourceSnapshot {
  deviceId: string;
  collectedAt: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  memoryTotalBytes?: number;
  memoryFreeBytes?: number;
  storageUsagePercent?: number;
  activeProcesses?: number;
  uptimeSeconds?: number;
  gpuUsagePercent?: number;
  gpuMemoryUsagePercent?: number;
}

export interface ResourceThresholds {
  maxCpuUsagePercent: number;
  maxMemoryUsagePercent: number;
  maxStorageUsagePercent: number;
  maxGpuUsagePercent?: number;
}

export interface ResourceAvailability {
  available: boolean;
  score: number;
  reasons: string[];
}

export interface ResourceMonitor {
  collect(deviceId: string): Promise<SystemResourceSnapshot>;
  availability(snapshot: SystemResourceSnapshot, thresholds?: ResourceThresholds): ResourceAvailability;
}
