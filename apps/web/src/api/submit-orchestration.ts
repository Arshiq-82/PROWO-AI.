import { OrchestrationState, OrchestrationStateManager } from "./orchestration-state";

export async function submitOrchestration(
  manager: OrchestrationStateManager,
  message: string,
  token?: string
): Promise<OrchestrationState> {
  if (!message.trim()) {
    return {
      status: "failed",
      error: "Message cannot be empty.",
    };
  }

  return manager.submit(
    {
      message: message.trim(),
    },
    token
  );
}
