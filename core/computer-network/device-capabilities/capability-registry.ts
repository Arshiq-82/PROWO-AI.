import { DeviceCapability, DeviceCapabilitySnapshot } from "./types";

export class CapabilityRegistry {
  private readonly snapshots = new Map<string, DeviceCapabilitySnapshot>();

  register(deviceId: string, capabilities: DeviceCapability[]): DeviceCapabilitySnapshot {
    const snapshot = {
      deviceId,
      collectedAt: new Date().toISOString(),
      capabilities: capabilities.map((c) => ({ ...c, metadata: c.metadata ? { ...c.metadata } : undefined })),
    };
    this.snapshots.set(deviceId, snapshot);
    return this.clone(snapshot);
  }

  get(deviceId: string): DeviceCapabilitySnapshot | undefined {
    const snapshot = this.snapshots.get(deviceId);
    return snapshot ? this.clone(snapshot) : undefined;
  }

  remove(deviceId: string): boolean { return this.snapshots.delete(deviceId); }

  list(): DeviceCapabilitySnapshot[] {
    return [...this.snapshots.values()].map((s) => this.clone(s));
  }

  has(deviceId: string, category: DeviceCapability["category"], name: string): boolean {
    const snapshot = this.snapshots.get(deviceId);
    return !!snapshot?.capabilities.some(
      (c) => c.category === category && c.name === name && c.available
    );
  }

  private clone(snapshot: DeviceCapabilitySnapshot): DeviceCapabilitySnapshot {
    return {
      ...snapshot,
      capabilities: snapshot.capabilities.map((c) => ({
        ...c, metadata: c.metadata ? { ...c.metadata } : undefined,
      })),
    };
  }
}
