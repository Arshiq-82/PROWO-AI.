import {
  CapabilityNegotiationRequest,
  CapabilityNegotiationResult,
  DeviceCapability,
} from "./types";
import { CapabilityRegistry } from "./capability-registry";

export class CapabilityNegotiator {
  constructor(private readonly registry: CapabilityRegistry) {}

  negotiate(request: CapabilityNegotiationRequest): CapabilityNegotiationResult {
    try {
      this.validate(request);
      const snapshot = this.registry.register(request.deviceId, request.capabilities);
      return { accepted: true, deviceId: request.deviceId, snapshot };
    } catch (error) {
      return {
        accepted: false,
        deviceId: request.deviceId,
        error: error instanceof Error ? error.message : "Capability negotiation failed.",
      };
    }
  }

  update(deviceId: string, capabilities: DeviceCapability[]): CapabilityNegotiationResult {
    return this.negotiate({ deviceId, capabilities });
  }

  private validate(request: CapabilityNegotiationRequest): void {
    if (!request.deviceId.trim()) throw new Error("deviceId is required.");
    if (!Array.isArray(request.capabilities)) throw new Error("capabilities must be an array.");
    for (const capability of request.capabilities) {
      if (!capability.id.trim()) throw new Error("Capability id is required.");
      if (!capability.name.trim()) throw new Error("Capability name is required.");
      if (!capability.category) throw new Error(`Capability "${capability.name}" requires a category.`);
    }
  }
}
