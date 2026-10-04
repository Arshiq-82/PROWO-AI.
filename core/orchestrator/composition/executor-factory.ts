import { ConnectedDeviceExecutor } from "../executors/connected-device-executor";
import { CodeTargetExecutor } from "../executors/code-executor";
import { LocalTargetExecutor } from "../executors/local-executor";
import { ToolTargetExecutor } from "../executors/tool-executor";
import { WorkflowTargetExecutor } from "../executors/workflow-executor";
import { CodeEngineAdapter } from "../integrations/code-engine-adapter";
import { LocalEngineAdapter } from "../integrations/local-engine-adapter";
import { NetworkEngineAdapter } from "../integrations/network-engine-adapter";
import { ToolSystemAdapter } from "../integrations/tool-system-adapter";
import { WorkflowEngineAdapter } from "../integrations/workflow-engine-adapter";
import { TargetExecutorRegistry } from "../target-executor-registry";
import { OrchestratorEngineDependencies } from "./types";

export function registerEngineExecutors(
  registry: TargetExecutorRegistry,
  dependencies: OrchestratorEngineDependencies
): void {
  registry.register(
    "local",
    new LocalTargetExecutor(
      new LocalEngineAdapter(dependencies.execution)
    )
  );

  registry.register(
    "connected_device",
    new ConnectedDeviceExecutor(
      new NetworkEngineAdapter(dependencies.network)
    )
  );

  registry.register(
    "workflow",
    new WorkflowTargetExecutor(
      new WorkflowEngineAdapter(dependencies.workflow)
    )
  );

  registry.register(
    "code_generation",
    new CodeTargetExecutor(
      new CodeEngineAdapter(dependencies.code)
    )
  );

  registry.register(
    "external_tool",
    new ToolTargetExecutor(
      new ToolSystemAdapter(dependencies.tools)
    )
  );
}
