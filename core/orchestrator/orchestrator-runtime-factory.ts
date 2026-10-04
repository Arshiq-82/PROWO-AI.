import { ApprovalManager } from "../permissions/approval-manager";
import { OrchestratorService } from "./orchestrator-service";
import { OrchestratorRuntime } from "./orchestrator-runtime";
import { OrchestratorRuntimeAdapter } from "./orchestrator-runtime-adapter";
import { OrchestratorController } from "./orchestrator-controller";
import { TargetExecutorRegistry } from "./target-executor-registry";
import { OrchestratorApprovalGate } from "./approval-gate";

export interface OrchestratorRuntimeBundle {
  runtime: OrchestratorRuntime;
  adapter: OrchestratorRuntimeAdapter;
  service: OrchestratorService;
  controller: OrchestratorController;
  executors: TargetExecutorRegistry;
}

export function createOrchestratorRuntime(
  approvals: ApprovalManager,
  registerExecutors?: (registry: TargetExecutorRegistry) => void
): OrchestratorRuntimeBundle {
  const executors = new TargetExecutorRegistry();
  registerExecutors?.(executors);

  const runtime = new OrchestratorRuntime(
    undefined,
    executors.snapshot()
  );

  const adapter = new OrchestratorRuntimeAdapter(runtime);
  const service = new OrchestratorService(adapter);
  const approvalGate = new OrchestratorApprovalGate(approvals);
  const controller = new OrchestratorController(service, approvalGate);

  return {
    runtime,
    adapter,
    service,
    controller,
    executors,
  };
}
