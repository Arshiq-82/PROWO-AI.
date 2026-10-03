import {
  AgentTask,
  AgentTaskResult,
} from "./types";

export type AgentTaskExecutor = (
  task: AgentTask
) => Promise<unknown>;

export class AgentTaskHandler {
  private readonly executors = new Map<
    string,
    AgentTaskExecutor
  >();

  register(type: string, executor: AgentTaskExecutor): void {
    if (this.executors.has(type)) {
      throw new Error(
        `Agent task executor "${type}" is already registered.`
      );
    }

    this.executors.set(type, executor);
  }

  async execute(task: AgentTask): Promise<AgentTaskResult> {
    const startedAt = new Date().toISOString();
    const executor = this.executors.get(task.type);

    if (!executor) {
      return {
        taskId: task.id,
        success: false,
        error: `No executor registered for task type "${task.type}".`,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }

    if (task.requiresApproval) {
      return {
        taskId: task.id,
        success: false,
        error: "Task requires approval before agent execution.",
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }

    try {
      const output = await executor(task);

      return {
        taskId: task.id,
        success: true,
        output,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Agent task execution failed.",
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }
  }
}
