import { DeviceCapability } from "../device-capabilities/types";

export interface DiscoveryContext {
  deviceId: string;
  metadata?: Record<string, unknown>;
}

export interface CapabilityDiscoverer {
  discover(context: DiscoveryContext): Promise<DeviceCapability[]>;
}

export interface DiscoveryResult {
  deviceId: string;
  capabilities: DeviceCapability[];
  discoveredAt: string;
  warnings: string[];
}
