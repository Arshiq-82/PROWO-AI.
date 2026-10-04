import {
  NetworkEngine,
  EngineAdapter,
  failure,
  success,
} from "./types";
import { TargetExecutionContext, TargetExecutionOutput } from "../executors/types";

export class NetworkEngineAdapter implements EngineAdapter {
  constructor(
    private readonly engine: NetworkEngine,
    private readonly devicesProvider?: () => unknown[]
  ) {}

  async execute(
    context: TargetExecutionContext
  ): Promise<TargetExecutionOutput> {
    try {
      const result = await this.engine.submit(
        {
          taskId: context.request.taskId,
          priority: this.priority(context),
          payload: context.request.metadata ?? {},
          preferredDeviceId: context.request.preferredDeviceId,
          maxAttempts: context.request.metadata?.maxAttempts as number | undefined,
          timeoutMs: context.request.timeoutMs,
          metadata: context.request.metadata,
        },
        this.devicesProvider?.()
      );

      return success("connected_device", result, {
        deviceId: context.request.preferredDeviceId,
      });
    } catch (error) {
      return failure("connected_device", error);
    }
  }

  private priority(
    context: TargetExecutionContext
  ): "critical" | "high" | "normal" | "low" {
    const value = context.request.metadata?.priority;

    if (
      value === "critical" ||
      value === "high" ||
      value === "normal" ||
      value === "low"
    ) {
      return value;
    }

    return "normal";
  }
}
