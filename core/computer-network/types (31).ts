export type CapabilityCategory =
  | "system" | "hardware" | "runtime" | "browser"
  | "filesystem" | "network" | "software" | "security" | "custom";

export interface DeviceCapability {
  id: string;
  category: CapabilityCategory;
  name: string;
  version?: string;
  available: boolean;
  metadata?: Record<string, unknown>;
}

export interface DeviceCapabilitySnapshot {
  deviceId: string;
  collectedAt: string;
  capabilities: DeviceCapability[];
}

export interface CapabilityRequirement {
  category: CapabilityCategory;
  name: string;
  version?: string;
  required?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CapabilityMatchResult {
  matched: boolean;
  deviceId: string;
  missing: CapabilityRequirement[];
  incompatible: CapabilityRequirement[];
  score: number;
}

export interface CapabilityNegotiationRequest {
  deviceId: string;
  capabilities: DeviceCapability[];
}

export interface CapabilityNegotiationResult {
  accepted: boolean;
  deviceId: string;
  snapshot?: DeviceCapabilitySnapshot;
  error?: string;
}
