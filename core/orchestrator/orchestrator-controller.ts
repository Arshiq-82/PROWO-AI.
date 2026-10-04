import { OrchestratorService } from "./orchestrator-service";
import {
  OrchestratorResult,
  ProwoRequest,
  TaskPlan,
} from "./types";
import { OrchestratorApprovalGate } from "./approval-gate";

export interface ControllerResult {
  accepted: boolean;
  status: "planned" | "running" | "completed" | "failed" | "awaiting_approval";
  plan?: TaskPlan;
  result?: OrchestratorResult;
  approvalId?: string;
  reason?: string;
}

export class OrchestratorController {
  constructor(
    private readonly service: OrchestratorService,
    private readonly approvalGate?: OrchestratorApprovalGate
  ) {}

  async submit(request: ProwoRequest): Promise<ControllerResult> {
    const plan = await this.service.createPlan(request);

    const approvalStep = plan.steps.find(
      (step) => step.status === "awaiting_approval"
    );

    if (approvalStep && this.approvalGate) {
      const approval = this.approvalGate.request({
        taskId: request.id,
        action: "execute_program",
        reason: approvalStep.description,
        userId: request.id,
        projectId: request.projectId,
        metadata: {
          planId: plan.id,
          stepId: approvalStep.id,
        },
      });

      return {
        accepted: true,
        status: "awaiting_approval",
        plan,
        approvalId: approval.approvalId,
        reason: approval.reason,
      };
    }

    const result = await this.service.handle(request);

    return {
      accepted: result.status !== "failed",
      status: this.mapStatus(result.status),
      plan,
      result,
      reason: result.error,
    };
  }

  private mapStatus(
    status: OrchestratorResult["status"]
  ): ControllerResult["status"] {
    if (status === "planning") return "planned";
    if (status === "testing") return "running";
    if (status === "completed") return "completed";
    if (status === "awaiting_approval") return "awaiting_approval";
    return "failed";
  }
}
