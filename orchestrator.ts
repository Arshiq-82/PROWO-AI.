import {
  Orchestrator,
  OrchestratorResult,
  ProwoRequest,
  TaskPlan,
} from "./types";

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function detectTaskKind(message: string): "program" | "workflow" {
  const workflowTerms = [
    "workflow",
    "automate",
    "automation",
    "every day",
    "when",
    "then",
    "trigger",
    "schedule",
  ];

  const normalized = message.toLowerCase();

  return workflowTerms.some((term) => normalized.includes(term))
    ? "workflow"
    : "program";
}

export class ProwoOrchestrator implements Orchestrator {
  async plan(request: ProwoRequest): Promise<TaskPlan> {
    const kind = detectTaskKind(request.message);

    const steps =
      kind === "workflow"
        ? [
            {
              id: createId("step"),
              title: "Understand requirements",
              description: "Extract the trigger, actions, conditions and expected result.",
              status: "planning" as const,
              dependencies: [],
            },
            {
              id: createId("step"),
              title: "Design workflow",
              description: "Convert the requirement into executable workflow steps.",
              status: "queued" as const,
              dependencies: [],
            },
            {
              id: createId("step"),
              title: "Validate workflow",
              description: "Check dependencies, permissions and execution requirements.",
              status: "queued" as const,
              dependencies: [],
            },
            {
              id: createId("step"),
              title: "Prepare execution",
              description: "Create the workflow definition and execution plan.",
              status: "queued" as const,
              dependencies: [],
            },
          ]
        : [
            {
              id: createId("step"),
              title: "Understand requirements",
              description: "Determine the application's purpose, inputs and outputs.",
              status: "planning" as const,
              dependencies: [],
            },
            {
              id: createId("step"),
              title: "Design program",
              description: "Choose the architecture, files, dependencies and runtime.",
              status: "queued" as const,
              dependencies: [],
            },
            {
              id: createId("step"),
              title: "Generate code",
              description: "Generate the required source files and configuration.",
              status: "queued" as const,
              dependencies: [],
            },
            {
              id: createId("step"),
              title: "Validate and test",
              description: "Check the generated project before execution or packaging.",
              status: "queued" as const,
              dependencies: [],
            },
          ];

    return {
      id: createId("plan"),
      kind,
      objective: request.message,
      steps,
    };
  }

  async execute(
    request: ProwoRequest,
    plan: TaskPlan
  ): Promise<OrchestratorResult> {
    return {
      requestId: request.id,
      status: "completed",
      plan,
      output: {
        message:
          "Execution pipeline initialized. AI model routing and execution engines will provide the actual implementation.",
      },
    };
  }
}
