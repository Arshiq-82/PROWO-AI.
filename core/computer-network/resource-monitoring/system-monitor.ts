import { SystemResourceSnapshot } from "./types";

export interface SystemResourceProvider {
  cpuUsagePercent(): Promise<number>;
  memory(): Promise<{ totalBytes: number; freeBytes: number }>;
  storageUsagePercent?(): Promise<number>;
  activeProcesses?(): Promise<number>;
  uptimeSeconds?(): Promise<number>;
  gpu?(): Promise<{ usagePercent: number; memoryUsagePercent: number }>;
}

export class SystemMonitor {
  constructor(private readonly provider?: SystemResourceProvider) {}

  async collect(deviceId: string): Promise<SystemResourceSnapshot> {
    const cpu = this.provider ? await this.provider.cpuUsagePercent() : 0;
    const memory = this.provider ? await this.provider.memory() : { totalBytes: 0, freeBytes: 0 };
    const snapshot: SystemResourceSnapshot = {
      deviceId,
      collectedAt: new Date().toISOString(),
      cpuUsagePercent: this.clamp(cpu),
      memoryUsagePercent: memory.totalBytes > 0 ? this.clamp(((memory.totalBytes - memory.freeBytes) / memory.totalBytes) * 100) : 0,
      memoryTotalBytes: memory.totalBytes,
      memoryFreeBytes: memory.freeBytes,
    };
    if (this.provider?.storageUsagePercent) snapshot.storageUsagePercent = this.clamp(await this.provider.storageUsagePercent());
    if (this.provider?.activeProcesses) snapshot.activeProcesses = await this.provider.activeProcesses();
    if (this.provider?.uptimeSeconds) snapshot.uptimeSeconds = await this.provider.uptimeSeconds();
    if (this.provider?.gpu) {
      const gpu = await this.provider.gpu();
      snapshot.gpuUsagePercent = this.clamp(gpu.usagePercent);
      snapshot.gpuMemoryUsagePercent = this.clamp(gpu.memoryUsagePercent);
    }
    return snapshot;
  }

  private clamp(value: number): number { return Math.max(0, Math.min(100, value)); }
}
