import { CapabilityDiscoverer, DiscoveryContext, DiscoveryResult } from "./types";

export class CapabilityCollector {
  private readonly discoverers: CapabilityDiscoverer[] = [];

  register(discoverer: CapabilityDiscoverer): void {
    this.discoverers.push(discoverer);
  }

  async collect(context: DiscoveryContext): Promise<DiscoveryResult> {
    const capabilities = [];
    const warnings: string[] = [];

    for (const discoverer of this.discoverers) {
      try {
        capabilities.push(...await discoverer.discover(context));
      } catch (error) {
        warnings.push(error instanceof Error ? error.message : "Capability discovery failed.");
      }
    }

    const unique = new Map(capabilities.map((capability) => [capability.id, capability]));
    return {
      deviceId: context.deviceId,
      capabilities: [...unique.values()],
      discoveredAt: new Date().toISOString(),
      warnings,
    };
  }
}
