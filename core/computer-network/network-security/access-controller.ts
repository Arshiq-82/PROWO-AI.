import { NetworkSecurityPolicy } from "./security-policy";
import {
  DeviceSecurityContext,
  SecurityCheckRequest,
  SecurityCheckResult,
} from "./types";

export class NetworkAccessController {
  constructor(private readonly policy: NetworkSecurityPolicy = new NetworkSecurityPolicy()) {}

  check(
    request: SecurityCheckRequest,
    device: DeviceSecurityContext
  ): SecurityCheckResult {
    if (request.deviceId !== device.deviceId) {
      return {
        allowed: false,
        requiresApproval: false,
        deviceId: request.deviceId,
        permission: request.permission,
        reason: "Device identity does not match the security context.",
      };
    }

    if (!device.authenticated) {
      return {
        allowed: false,
        requiresApproval: false,
        deviceId: request.deviceId,
        permission: request.permission,
        reason: "Device is not authenticated.",
      };
    }

    if (!device.trusted) {
      return {
        allowed: false,
        requiresApproval: false,
        deviceId: request.deviceId,
        permission: request.permission,
        reason: "Device is not trusted.",
      };
    }

    if (!device.permissions.includes(request.permission)) {
      return {
        allowed: false,
        requiresApproval: false,
        deviceId: request.deviceId,
        permission: request.permission,
        reason: "Device does not have the requested network permission.",
      };
    }

    const rule = this.policy.get(request.permission);

    if (!rule.enabled) {
      return {
        allowed: false,
        requiresApproval: false,
        deviceId: request.deviceId,
        permission: request.permission,
        reason: "Network permission is disabled by policy.",
      };
    }

    if (!this.policy.allowsRisk(rule.minimumRisk, request.risk)) {
      return {
        allowed: false,
        requiresApproval: false,
        deviceId: request.deviceId,
        permission: request.permission,
        reason: "Requested risk exceeds the configured network policy.",
      };
    }

    return {
      allowed: true,
      requiresApproval: rule.requiresApproval,
      deviceId: request.deviceId,
      permission: request.permission,
    };
  }
}
