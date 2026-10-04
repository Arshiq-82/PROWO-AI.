import assert from "node:assert/strict";
import test from "node:test";
import { BackendApiRuntime } from "./api-runtime";

test("starts backend before the API server", async () => {
  const calls: string[] = [];

  const runtime = new BackendApiRuntime(
    {
      start: async () => {
        calls.push("server:start");
      },
      stop: async () => {
        calls.push("server:stop");
      },
    },
    {
      apiRegistry: {} as never,
      start: async () => {
        calls.push("backend:start");
      },
      stop: async () => {
        calls.push("backend:stop");
      },
    }
  );

  await runtime.start();

  assert.deepEqual(calls, [
    "backend:start",
    "server:start",
  ]);
});

test("stops API server before backend", async () => {
  const calls: string[] = [];

  const runtime = new BackendApiRuntime(
    {
      start: async () => {},
      stop: async () => {
        calls.push("server:stop");
      },
    },
    {
      apiRegistry: {} as never,
      start: async () => {},
      stop: async () => {
        calls.push("backend:stop");
      },
    }
  );

  await runtime.stop();

  assert.deepEqual(calls, [
    "server:stop",
    "backend:stop",
  ]);
});
