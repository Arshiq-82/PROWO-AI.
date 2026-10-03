import {
  PermissionAction,
  PermissionContext,
  PermissionDecision,
  PermissionRule,
  PermissionRisk,
} from "./types";

const defaultRules: PermissionRule[] = [
  {
    id: "read-file",
    action: "read_file",
    effect: "allow",
    risk: "low",
    requiresApproval: false,
    description: "Read project files.",
  },
  {
    id: "write-file",
    action: "write_file",
    effect: "allow",
    risk: "medium",
    requiresApproval: true,
    description: "Create or modify project files.",
  },
  {
    id: "delete-file",
    action: "delete_file",
    effect: "deny",
    risk: "high",
    requiresApproval: true,
    description: "Delete files.",
  },
  {
    id: "execute-program",
    action: "execute_program",
    effect: "allow",
    risk: "high",
    requiresApproval: true,
    description: "Execute generated programs.",
  },
  {
    id: "network-request",
    action: "network_request",
    effect: "allow",
    risk: "medium",
    requiresApproval: true,
    description: "Access external network resources.",
  },
  {
    id: "browser-automation",
    action: "browser_automation",
    effect: "allow",
    risk: "high",
    requiresApproval: true,
    description: "Perform browser automation.",
  },
  {
    id: "computer-control",
    action: "computer_control",
    effect: "allow",
    risk: "critical",
    requiresApproval: true,
    description: "Control a connected computer.",
  },
  {
    id: "install-software",
    action: "install_software",
    effect: "deny",
    risk: "critical",
    requiresApproval: true,
    description: "Install software on a device.",
  },
  {
    id: "access-secret",
    action: "access_secret",
    effect: "deny",
    risk: "critical",
    requiresApproval: true,
    description: "Access credentials or secret material.",
  },
];

export class PermissionPolicyEngine {
  constructor(private readonly rules: PermissionRule[] = defaultRules) {}

  evaluate(context: PermissionContext): PermissionDecision {
    const rule = this.findRule(context.action);

    if (!rule) {
      return {
        allowed: false,
        requiresApproval: true,
        risk: "critical",
        reason: "No permission rule exists for this action.",
      };
    }

    if (rule.effect === "deny") {
      return {
        allowed: false,
        requiresApproval: rule.requiresApproval,
        risk: rule.risk,
        reason: rule.description,
        ruleId: rule.id,
      };
    }

    return {
      allowed: !rule.requiresApproval,
      requiresApproval: rule.requiresApproval,
      risk: rule.risk,
      reason: rule.description,
      ruleId: rule.id,
    };
  }

  setRule(rule: PermissionRule): void {
    const index = this.rules.findIndex(
      (current) => current.action === rule.action
    );

    if (index >= 0) {
      this.rules[index] = rule;
    } else {
      this.rules.push(rule);
    }
  }

  private findRule(action: PermissionAction): PermissionRule | undefined {
    return this.rules.find((rule) => rule.action === action);
  }
}

export function riskRequiresExplicitApproval(
  risk: PermissionRisk
): boolean {
  return risk === "high" || risk === "critical";
}
