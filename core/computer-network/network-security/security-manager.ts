import { NetworkAccessController } from "./access-controller";
import { NetworkSecurityPolicy } from "./security-policy";
import {
  DeviceSecurityContext,
  NetworkPermission,
  NetworkRiskLevel,
  SecurityCheckResult,
} from "./types";

export class NetworkSecurityManager {
  private readonly devices = new Map<string, DeviceSecurityContext>();

  constructor(
    private readonly policy: NetworkSecurityPolicy = new NetworkSecurityPolicy(),
    private readonly access: NetworkAccessController = new NetworkAccessController(policy)
  ) {}

  registerDevice(context: DeviceSecurityContext): void {
    this.devices.set(context.deviceId, {
      ...context,
      permissions: [...context.permissions],
      capabilities: [...(context.capabilities ?? [])],
    });
  }

  updateDevice(
    deviceId: string,
    changes: Partial<Omit<DeviceSecurityContext, "deviceId">>
  ): DeviceSecurityContext | undefined {
    const current = this.devices.get(deviceId);
    if (!current) return undefined;

    const updated: DeviceSecurityContext = {
      ...current,
      ...changes,
      deviceId,
      permissions: changes.permissions
        ? [...changes.permissions]
        : [...current.permissions],
      capabilities: changes.capabilities
        ? [...changes.capabilities]
        : [...(current.capabilities ?? [])],
    };

    this.devices.set(deviceId, updated);
    return { ...updated };
  }

  authorize(
    deviceId: string,
    permission: NetworkPermission,
    risk: NetworkRiskLevel,
    context?: Record<string, unknown>
  ): SecurityCheckResult {
    const device = this.devices.get(deviceId);

    if (!device) {
      return {
        allowed: false,
        requiresApproval: false,
        deviceId,
        permission,
        reason: "Device security context was not found.",
      };
    }

    return this.access.check(
      { deviceId, permission, risk, context },
      device
    );
  }

  getDevice(deviceId: string): DeviceSecurityContext | undefined {
    const device = this.devices.get(deviceId);
    return device
      ? {
          ...device,
          permissions: [...device.permissions],
          capabilities: [...(device.capabilities ?? [])],
        }
      : undefined;
  }

  listDevices(): DeviceSecurityContext[] {
    return [...this.devices.values()].map((device) => ({
      ...device,
      permissions: [...device.permissions],
      capabilities: [...(device.capabilities ?? [])],
    }));
  }

  getPolicy(): NetworkSecurityPolicy {
    return this.policy;
  }
}
