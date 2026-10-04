import { CapabilityDiscoverer, DiscoveryContext } from "./types";
import { DeviceCapability } from "../device-capabilities/types";

export class SystemCapabilityDiscovery implements CapabilityDiscoverer {
  async discover(context: DiscoveryContext): Promise<DeviceCapability[]> {
    const platform = this.getPlatform();
    return [
      { id: "system.platform", category: "system", name: platform, available: true, metadata: { deviceId: context.deviceId } },
      { id: "system.node", category: "runtime", name: "node", version: this.getNodeVersion(), available: true },
    ];
  }

  private getPlatform(): string {
    return typeof process !== "undefined" ? process.platform : "unknown";
  }

  private getNodeVersion(): string {
    return typeof process !== "undefined" ? process.versions.node : "unknown";
  }
}
