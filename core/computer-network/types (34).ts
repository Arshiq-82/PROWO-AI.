import { CapabilityRequirement } from "../device-capabilities/types";
import { SystemResourceSnapshot } from "../resource-monitoring/types";

export interface DeviceSelectionRequirements {
  capabilities?: CapabilityRequirement[];
  minScore?: number;
  requireOnline?: boolean;
  resourceWeight?: number;
  capabilityWeight?: number;
}

export interface DeviceCandidate {
  deviceId: string;
  online: boolean;
  capabilityScore: number;
  resourceScore: number;
  securityScore: number;
  totalScore: number;
  eligible: boolean;
  reasons: string[];
}

export interface DeviceSelectionResult {
  selectedDeviceId?: string;
  candidates: DeviceCandidate[];
  reason?: string;
}

export interface DeviceSelectionContext {
  deviceId: string;
  online: boolean;
  capabilityScore: number;
  resources?: SystemResourceSnapshot;
  securityScore?: number;
}
