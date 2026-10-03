import { ToolRegistry } from "./tool-registry";
import { ToolValidator } from "./tool-validator";
import {
  ToolExecutionRequest,
  ToolExecutionResult,
} from "./types";

export class ToolRunner {
  constructor(
    private readonly registry: ToolRegistry,
    private readonly validator: ToolValidator
  ) {}

  async run(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    const startedAt = new Date().toISOString();
    const tool = this.registry.get(request.toolId);

    if (!tool) {
      return {
        success: false,
        error: `Tool "${request.toolId}" is not registered.`,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }

    if (tool.definition.enabled === false) {
      return {
        success: false,
        error: `Tool "${request.toolId}" is disabled.`,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }

    const validation = this.validator.validateInput(
      tool.definition.inputSchema,
      request.input
    );

    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(" "),
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }

    if (tool.definition.requiresApproval) {
      return {
        success: false,
        error: `Tool "${request.toolId}" requires approval before execution.`,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }

    try {
      const output = await tool.execute(request.input, request.context);

      return {
        success: true,
        output,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Tool execution failed.",
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }
  }
}
