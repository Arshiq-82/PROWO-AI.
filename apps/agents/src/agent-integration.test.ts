import assert from "node:assert/strict";
import test from "node:test";
import { createAgentConfig } from "./agent-config";
import { AgentTaskExecutor } from "./agent-task-executor";
import { createAgentApplication } from "./agent-bootstrap";
import { AgentTransportBridge } from "./agent-transport";

test("creates an agent configuration", () => {
  const config = createAgentConfig(
    "device-1",
    "ws://localhost:3000"
  );

  assert.equal(config.deviceId, "device-1");
  assert.equal(config.serverUrl, "ws://localhost:3000");
  assert.equal(config.heartbeatIntervalMs, 15_000);
});

test("blocks approval-required local work without approval", async () => {
  const executor = new AgentTaskExecutor({
    execute: async () => ({
      taskId: "task-1",
      success: true,
    }),
  });

  const result = await executor.execute({
    taskId: "task-1",
    action: "execute_program",
    requiresApproval: true,
    approved: false,
  });

  assert.equal(result.success, false);
  assert.match(result.error ?? "", /approval/i);
});

test("agent application starts and stops its transport", async () => {
  const calls: string[] = [];

  const transport = new AgentTransportBridge({
    connect: async () => {
      calls.push("connect");
    },
    disconnect: async () => {
      calls.push("disconnect");
    },
    send: async () => {},
    onMessage: () => {},
    state: () => "connected",
  });

  const app = createAgentApplication({
    config: createAgentConfig("device-1", "ws://localhost:3000"),
    transport,
    executor: new AgentTaskExecutor({
      execute: async (request) => ({
        taskId: request.taskId,
        success: true,
      }),
    }),
  });

  await app.start();
  await app.stop();

  assert.deepEqual(calls, ["connect", "disconnect"]);
  assert.equal(app.health.snapshot().status, "offline");
});
