import { ResourceAvailability, ResourceMonitor, ResourceThresholds, SystemResourceSnapshot } from "./types";
import { SystemMonitor } from "./system-monitor";

export class DeviceResourceMonitor implements ResourceMonitor {
  constructor(private readonly systemMonitor: SystemMonitor) {}

  collect(deviceId: string): Promise<SystemResourceSnapshot> { return this.systemMonitor.collect(deviceId); }

  availability(snapshot: SystemResourceSnapshot, thresholds: ResourceThresholds = {
    maxCpuUsagePercent: 80, maxMemoryUsagePercent: 85, maxStorageUsagePercent: 90, maxGpuUsagePercent: 90,
  }): ResourceAvailability {
    const reasons: string[] = [];
    if (snapshot.cpuUsagePercent > thresholds.maxCpuUsagePercent) reasons.push("CPU usage is above the configured threshold.");
    if (snapshot.memoryUsagePercent > thresholds.maxMemoryUsagePercent) reasons.push("Memory usage is above the configured threshold.");
    if (snapshot.storageUsagePercent !== undefined && snapshot.storageUsagePercent > thresholds.maxStorageUsagePercent) reasons.push("Storage usage is above the configured threshold.");
    if (snapshot.gpuUsagePercent !== undefined && thresholds.maxGpuUsagePercent !== undefined && snapshot.gpuUsagePercent > thresholds.maxGpuUsagePercent) reasons.push("GPU usage is above the configured threshold.");
    const scores = [1 - snapshot.cpuUsagePercent / 100, 1 - snapshot.memoryUsagePercent / 100];
    if (snapshot.storageUsagePercent !== undefined) scores.push(1 - snapshot.storageUsagePercent / 100);
    if (snapshot.gpuUsagePercent !== undefined) scores.push(1 - snapshot.gpuUsagePercent / 100);
    const score = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    return { available: reasons.length === 0, score: Math.max(0, Math.min(1, score)), reasons };
  }
}
