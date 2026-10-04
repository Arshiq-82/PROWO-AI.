import { ApprovalManager } from "../permissions/approval-manager";
import { PermissionAction } from "../permissions/types";

export interface OrchestratorApprovalRequest {
  taskId: string;
  action: PermissionAction;
  reason: string;
  userId: string;
  projectId?: string;
  deviceId?: string;
  resource?: string;
  metadata?: Record<string, unknown>;
}

export interface OrchestratorApprovalResult {
  required: boolean;
  approved: boolean;
  approvalId?: string;
  reason?: string;
}

export class OrchestratorApprovalGate {
  constructor(private readonly approvals: ApprovalManager) {}

  request(input: OrchestratorApprovalRequest): OrchestratorApprovalResult {
    const approval = this.approvals.create({
      userId: input.userId,
      projectId: input.projectId,
      deviceId: input.deviceId,
      action: input.action,
      resource: input.resource ?? input.taskId,
      metadata: {
        reason: input.reason,
        ...(input.metadata ?? {}),
      },
    });

    return {
      required: true,
      approved: false,
      approvalId: approval.id,
      reason: "Execution requires approval.",
    };
  }

  approve(
    approvalId: string,
    userId: string
  ): OrchestratorApprovalResult {
    const approval = this.approvals.approve(approvalId, userId);

    return {
      required: true,
      approved: approval.status === "approved",
      approvalId,
      reason:
        approval.status === "approved"
          ? undefined
          : "Approval could not be completed.",
    };
  }

  reject(
    approvalId: string,
    userId: string
  ): OrchestratorApprovalResult {
    const approval = this.approvals.reject(approvalId, userId);

    return {
      required: true,
      approved: false,
      approvalId,
      reason:
        approval.status === "rejected"
          ? "Execution approval was rejected."
          : "Approval rejection could not be completed.",
    };
  }
}
