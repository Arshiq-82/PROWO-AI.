import {
  Orchestrator,
  OrchestratorResult,
  ProwoRequest,
  TaskPlan,
} from "../orchestrator/types";

export class OrchestratorService {
  constructor(private readonly orchestrator: Orchestrator) {}

  async handle(request: ProwoRequest): Promise<OrchestratorResult> {
    const plan = await this.orchestrator.plan(request);
    return this.orchestrator.execute(request, plan);
  }

  async createPlan(request: ProwoRequest): Promise<TaskPlan> {
    return this.orchestrator.plan(request);
  }
}
