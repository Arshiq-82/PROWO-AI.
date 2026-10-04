import {
  OrchestratorTaskRequest,
  ExecutionPlan,
  ExecutionTarget,
}from "./runtime-types";
import { OrchestratorTaskRouter } from "./task-router";

export class ExecutionPlanner {
  constructor(
    private readonly router: OrchestratorTaskRouter = new OrchestratorTaskRouter()
  ) {}

  plan(request: OrchestratorTaskRequest): ExecutionPlan {
    const route = this.router.route(request);
    const steps = this.createSteps(request, route.target);

    return {
      taskId: request.taskId,
      target: route.target,
      steps,
      requiresApproval: steps.some((step) => step.requiresApproval),
      preferredDeviceId: request.preferredDeviceId,
      createdAt: new Date().toISOString(),
    };
  }

  private createSteps(request: OrchestratorTaskRequest, target: ExecutionTarget) {
    const base = {
      stepId: `${request.taskId}-prepare`,
      action: "prepare",
      description: "Validate task inputs and prepare execution context.",
      target,
      requiresApproval: false,
    };

    if (target === "connected_device") {
      return [
        base,
        {
          stepId: `${request.taskId}-select-device`,
          action: "select_device",
          description: "Select and validate a connected computer.",
          target,
          requiresApproval: false,
        },
        {
          stepId: `${request.taskId}-execute`,
          action: "execute_remote",
          description: "Dispatch the task to the selected connected computer.",
          target,
          requiresApproval: true,
        },
      ];
    }

    if (target === "workflow") {
      return [
        base,
        {
          stepId: `${request.taskId}-build-workflow`,
          action: "build_workflow",
          description: "Construct the requested workflow.",
          target,
          requiresApproval: false,
        },
        {
          stepId: `${request.taskId}-activate`,
          action: "activate_workflow",
          description: "Activate the workflow after policy checks.",
          target,
          requiresApproval: true,
        },
      ];
    }

    if (target === "code_generation") {
      return [
        base,
        {
          stepId: `${request.taskId}-generate`,
          action: "generate_code",
          description: "Generate the requested program files.",
          target,
          requiresApproval: false,
        },
        {
          stepId: `${request.taskId}-validate`,
          action: "validate_code",
          description: "Validate generated files before execution or delivery.",
          target,
          requiresApproval: false,
        },
      ];
    }

    if (target === "external_tool") {
      return [
        base,
        {
          stepId: `${request.taskId}-authorize`,
          action: "authorize_tool",
          description: "Validate permissions for the requested external tool.",
          target,
          requiresApproval: true,
        },
        {
          stepId: `${request.taskId}-execute`,
          action: "execute_tool",
          description: "Execute the authorized external operation.",
          target,
          requiresApproval: true,
        },
      ];
    }

    return [
      base,
      {
        stepId: `${request.taskId}-execute`,
        action: "execute_local",
        description: "Execute the task through the local Prowo runtime.",
        target,
        requiresApproval: false,
      },
    ];
  }
}
