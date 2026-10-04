export type NetworkPermission =
  | "connect"
  | "send_command"
  | "execute_task"
  | "read_status"
  | "read_files"
  | "write_files"
  | "install_software"
  | "access_network"
  | "access_secrets";

export type NetworkRiskLevel = "low" | "medium" | "high" | "critical";

export interface DeviceSecurityContext {
  deviceId: string;
  authenticated: boolean;
  trusted: boolean;
  permissions: NetworkPermission[];
  capabilities?: string[];
  metadata?: Record<string, unknown>;
}

export interface SecurityPolicyRule {
  permission: NetworkPermission;
  minimumRisk: NetworkRiskLevel;
  requiresApproval: boolean;
  enabled: boolean;
}

export interface SecurityCheckRequest {
  deviceId: string;
  permission: NetworkPermission;
  risk: NetworkRiskLevel;
  context?: Record<string, unknown>;
}

export interface SecurityCheckResult {
  allowed: boolean;
  requiresApproval: boolean;
  reason?: string;
  deviceId: string;
  permission: NetworkPermission;
}
