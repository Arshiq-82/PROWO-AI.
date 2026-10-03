export type PermissionEffect = "allow" | "deny";

export type PermissionRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type PermissionAction =
  | "read_file"
  | "write_file"
  | "delete_file"
  | "execute_program"
  | "network_request"
  | "browser_automation"
  | "computer_control"
  | "install_software"
  | "access_secret";

export interface PermissionRule {
  id: string;
  action: PermissionAction;
  effect: PermissionEffect;
  risk: PermissionRisk;
  requiresApproval: boolean;
  scopes?: string[];
  description: string;
}

export interface PermissionContext {
  userId: string;
  projectId?: string;
  deviceId?: string;
  action: PermissionAction;
  resource?: string;
  metadata?: Record<string, unknown>;
}

export interface PermissionDecision {
  allowed: boolean;
  requiresApproval: boolean;
  risk: PermissionRisk;
  reason: string;
  ruleId?: string;
}

export interface ApprovalRequest {
  id: string;
  context: PermissionContext;
  status: "pending" | "approved" | "rejected" | "expired";
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  action: PermissionAction;
  result: "allowed" | "denied" | "approved" | "rejected";
  resource?: string;
  projectId?: string;
  deviceId?: string;
  details?: Record<string, unknown>;
}
