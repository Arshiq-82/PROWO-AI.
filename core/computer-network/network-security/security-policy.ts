import {
  NetworkPermission,
  NetworkRiskLevel,
  SecurityPolicyRule,
} from "./types";

const RISK_WEIGHT: Record<NetworkRiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export class NetworkSecurityPolicy {
  private readonly rules = new Map<NetworkPermission, SecurityPolicyRule>([
    ["connect", { permission: "connect", minimumRisk: "low", requiresApproval: false, enabled: true }],
    ["send_command", { permission: "send_command", minimumRisk: "medium", requiresApproval: true, enabled: true }],
    ["execute_task", { permission: "execute_task", minimumRisk: "high", requiresApproval: true, enabled: true }],
    ["read_status", { permission: "read_status", minimumRisk: "low", requiresApproval: false, enabled: true }],
    ["read_files", { permission: "read_files", minimumRisk: "medium", requiresApproval: true, enabled: true }],
    ["write_files", { permission: "write_files", minimumRisk: "high", requiresApproval: true, enabled: true }],
    ["install_software", { permission: "install_software", minimumRisk: "critical", requiresApproval: true, enabled: true }],
    ["access_network", { permission: "access_network", minimumRisk: "high", requiresApproval: true, enabled: true }],
    ["access_secrets", { permission: "access_secrets", minimumRisk: "critical", requiresApproval: true, enabled: false }],
  ]);

  get(permission: NetworkPermission): SecurityPolicyRule {
    const rule = this.rules.get(permission);
    if (!rule) throw new Error(`No security rule exists for ${permission}.`);
    return { ...rule };
  }

  update(
    permission: NetworkPermission,
    changes: Partial<Omit<SecurityPolicyRule, "permission">>
  ): SecurityPolicyRule {
    const current = this.get(permission);
    const next: SecurityPolicyRule = {
      ...current,
      ...changes,
      permission,
    };

    this.rules.set(permission, next);
    return { ...next };
  }

  allowsRisk(
    configuredRisk: NetworkRiskLevel,
    requestedRisk: NetworkRiskLevel
  ): boolean {
    return RISK_WEIGHT[requestedRisk] <= RISK_WEIGHT[configuredRisk];
  }

  list(): SecurityPolicyRule[] {
    return [...this.rules.values()].map((rule) => ({ ...rule }));
  }
}
