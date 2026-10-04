import { CapabilityDiscoverer, DiscoveryContext } from "./types";
import { DeviceCapability } from "../device-capabilities/types";

export interface SoftwareProbe {
  name: string;
  category: DeviceCapability["category"];
  version?: string;
  available: boolean;
  metadata?: Record<string, unknown>;
}

export class SoftwareCapabilityDiscovery implements CapabilityDiscoverer {
  constructor(private readonly probes: SoftwareProbe[] = []) {}

  async discover(_context: DiscoveryContext): Promise<DeviceCapability[]> {
    return this.probes.map((probe) => ({
      id: `software.${probe.name}`,
      category: probe.category,
      name: probe.name,
      version: probe.version,
      available: probe.available,
      metadata: probe.metadata,
    }));
  }

  registerProbe(probe: SoftwareProbe): void {
    this.probes.push(probe);
  }
}
