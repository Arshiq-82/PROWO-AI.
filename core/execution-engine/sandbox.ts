import { SandboxPolicy } from "./types";

export const defaultSandboxPolicy: SandboxPolicy = {
  allowNetwork: false,
  allowedWorkingDirectories: [],
  maxExecutionTimeMs: 120_000,
  maxOutputBytes: 2_000_000,
};

export class SandboxPolicyManager {
  private policy: SandboxPolicy;

  constructor(policy: SandboxPolicy = defaultSandboxPolicy) {
    this.policy = {
      ...policy,
      allowedWorkingDirectories: [
        ...policy.allowedWorkingDirectories,
      ],
    };
  }

  getPolicy(): SandboxPolicy {
    return {
      ...this.policy,
      allowedWorkingDirectories: [
        ...this.policy.allowedWorkingDirectories,
      ],
    };
  }

  validateWorkingDirectory(directory: string): void {
    if (this.policy.allowedWorkingDirectories.length === 0) {
      throw new Error(
        "No execution working directory has been explicitly allowed."
      );
    }

    const allowed = this.policy.allowedWorkingDirectories.some(
      (base) =>
        directory === base ||
        directory.startsWith(`${base}/`) ||
        directory.startsWith(`${base}\\`)
    );

    if (!allowed) {
      throw new Error(
        `Execution directory is outside the sandbox: ${directory}`
      );
    }
  }

  validateTimeout(timeoutMs?: number): number {
    const requested = timeoutMs ?? this.policy.maxExecutionTimeMs;

    if (requested <= 0) {
      throw new Error("Execution timeout must be greater than zero.");
    }

    return Math.min(requested, this.policy.maxExecutionTimeMs);
  }

  validateNetworkAccess(allowNetwork = false): void {
    if (allowNetwork && !this.policy.allowNetwork) {
      throw new Error("Network access is disabled by the sandbox policy.");
    }
  }
}
