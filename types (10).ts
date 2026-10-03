export type ToolRisk = "low" | "medium" | "high" | "critical";

export type ToolCategory =
  | "filesystem"
  | "program"
  | "workflow"
  | "network"
  | "document"
  | "computer"
  | "browser"
  | "data"
  | "custom";

export interface ToolInputSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  risk: ToolRisk;
  inputSchema: ToolInputSchema;
  requiresApproval?: boolean;
  enabled?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ToolExecutionContext {
  userId: string;
  projectId?: string;
  taskId?: string;
  deviceId?: string;
  metadata?: Record<string, unknown>;
}

export interface ToolExecutionRequest {
  toolId: string;
  input: Record<string, unknown>;
  context: ToolExecutionContext;
}

export interface ToolExecutionResult {
  success: boolean;
  output?: unknown;
  error?: string;
  startedAt: string;
  completedAt: string;
}

export interface ProwoTool {
  definition: ToolDefinition;
  execute(
    input: Record<string, unknown>,
    context: ToolExecutionContext
  ): Promise<unknown>;
}
