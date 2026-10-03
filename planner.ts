import { ProwoOrchestrator } from "../../core/orchestrator/orchestrator";
import { ProwoRequest } from "../../core/orchestrator/types";
import {
  PlannerRequest,
  PlannerResult,
} from "./types";

export class ProwoPlanner {
  private readonly orchestrator: ProwoOrchestrator;

  constructor(orchestrator = new ProwoOrchestrator()) {
    this.orchestrator = orchestrator;
  }

  async createPlan(request: PlannerRequest): Promise<PlannerResult> {
    const prowoRequest: ProwoRequest = {
      id: `request_${Date.now()}`,
      message: request.message,
      projectId: request.context.projectId,
      selectedModel: request.context.selectedModel,
      createdAt: new Date().toISOString(),
    };

    const plan = await this.orchestrator.plan(prowoRequest);

    return {
      kind: plan.kind,
      plan,
      assumptions: [],
      questions: [],
    };
  }
}
