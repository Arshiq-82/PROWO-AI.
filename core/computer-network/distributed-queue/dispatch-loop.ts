import { DistributedQueueManager } from "./queue-manager";
import { QueueLease } from "./types";

export interface DispatchTarget {
  workerId: string;
  dispatch(taskId: string): Promise<boolean> | boolean;
}

export interface DispatchLoopOptions {
  leaseDurationMs?: number;
  maxPerCycle?: number;
}

export class QueueDispatchLoop {
  private running = false;

  constructor(
    private readonly queue: DistributedQueueManager,
    private readonly options: DispatchLoopOptions = {}
  ) {}

  async dispatchOnce(targets: DispatchTarget[]): Promise<QueueLease[]> {
    const leases: QueueLease[] = [];
    const limit = this.options.maxPerCycle ?? targets.length;

    for (const target of targets.slice(0, limit)) {
      const lease = this.queue.leaseNext(
        target.workerId,
        this.options.leaseDurationMs ?? 30_000
      );

      if (!lease) break;

      const accepted = await target.dispatch(lease.taskId);

      if (accepted) {
        this.queue.markDispatched(lease.taskId);
        leases.push(lease);
      } else {
        this.queue.fail(lease.taskId, "Worker rejected task dispatch.");
      }
    }

    return leases;
  }

  start(
    targetsProvider: () => DispatchTarget[],
    intervalMs = 1_000
  ): void {
    if (this.running) return;

    this.running = true;

    const loop = async (): Promise<void> => {
      while (this.running) {
        await this.dispatchOnce(targetsProvider());
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    };

    void loop();
  }

  stop(): void {
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }
}
