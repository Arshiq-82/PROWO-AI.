import {
  ConnectedDeviceExecutionAdapter,
  TargetExecutionContext,
  TargetExecutionOutput,
  TargetExecutor,
} from "./types";

export class ConnectedDeviceExecutor implements TargetExecutor {
  readonly target = "connected_device" as const;

  constructor(private readonly adapter: ConnectedDeviceExecutionAdapter) {}

  async execute(
    context: TargetExecutionContext
  ): Promise<TargetExecutionOutput> {
    if (!context.request.preferredDeviceId) {
      return {
        target: this.target,
        success: false,
        error: "A connected device is required for remote execution.",
      };
    }

    try {
      const output = await this.adapter.execute(context);

      return {
        target: this.target,
        success: true,
        output,
        metadata: {
          deviceId: context.request.preferredDeviceId,
        },
      };
    } catch (error) {
      return {
        target: this.target,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          deviceId: context.request.preferredDeviceId,
        },
      };
    }
  }
}
