import { ApprovalManager } from "../../permissions/approval-manager";
import {
  LocalEngine,
  NetworkEngine,
  WorkflowEngine,
  CodeEngine,
  ToolSystem,
} from "../integrations/types";
import { ComputerNetworkOrchestrator } from "../../computer-network/network-orchestrator/network-orchestrator";

export interface OrchestratorEngineDependencies {
  approvals: ApprovalManager;
  execution: LocalEngine;
  workflow: WorkflowEngine;
  code: CodeEngine;
  tools: ToolSystem;
  network: NetworkEngine;
}

export interface OrchestratorComposition {
  controller: unknown;
  runtime: unknown;
  service: unknown;
  executors: unknown;
  network?: ComputerNetworkOrchestrator;
}
