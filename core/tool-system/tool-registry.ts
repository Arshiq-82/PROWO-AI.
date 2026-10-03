import { ProwoTool, ToolDefinition } from "./types";

export class ToolRegistry {
  private readonly tools = new Map<string, ProwoTool>();

  register(tool: ProwoTool): void {
    if (this.tools.has(tool.definition.id)) {
      throw new Error(`Tool "${tool.definition.id}" is already registered.`);
    }

    this.tools.set(tool.definition.id, tool);
  }

  unregister(toolId: string): boolean {
    return this.tools.delete(toolId);
  }

  get(toolId: string): ProwoTool | undefined {
    return this.tools.get(toolId);
  }

  getDefinition(toolId: string): ToolDefinition | undefined {
    return this.tools.get(toolId)?.definition;
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.definition);
  }

  has(toolId: string): boolean {
    return this.tools.has(toolId);
  }
}
