import { ResourceThresholds } from "./types";

export class ResourceThresholdManager {
  private thresholds: ResourceThresholds = {
    maxCpuUsagePercent: 80, maxMemoryUsagePercent: 85, maxStorageUsagePercent: 90, maxGpuUsagePercent: 90,
  };

  get(): ResourceThresholds { return { ...this.thresholds }; }

  update(changes: Partial<ResourceThresholds>): ResourceThresholds {
    const next = { ...this.thresholds, ...changes };
    this.validate(next);
    this.thresholds = next;
    return this.get();
  }

  reset(): ResourceThresholds {
    this.thresholds = { maxCpuUsagePercent: 80, maxMemoryUsagePercent: 85, maxStorageUsagePercent: 90, maxGpuUsagePercent: 90 };
    return this.get();
  }

  private validate(thresholds: ResourceThresholds): void {
    for (const value of [thresholds.maxCpuUsagePercent, thresholds.maxMemoryUsagePercent, thresholds.maxStorageUsagePercent, thresholds.maxGpuUsagePercent]) {
      if (value !== undefined && (value < 0 || value > 100)) throw new Error("Resource thresholds must be between 0 and 100.");
    }
  }
}
