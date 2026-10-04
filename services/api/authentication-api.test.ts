import assert from "node:assert/strict";
import test from "node:test";
import { AuthenticatedRequestResolver } from "./authenticated-request";
import { AuthenticatedOrchestrationController } from "./authenticated-orchestration-controller";

test("rejects unauthenticated requests", async () => {
  const resolver = new AuthenticatedRequestResolver({
    authenticate: async () => ({
      authenticated: false,
      error: "Invalid session.",
    }),
  });

  const orchestration = {
    submit: async () => ({
      statusCode: 200,
      body: {},
    }),
    execute: async () => ({
      statusCode: 200,
      body: {},
    }),
  } as never;

  const controller = new AuthenticatedOrchestrationController(
    resolver,
    orchestration
  );

  const response = await controller.submit({
    headers: {
      authorization: "Bearer invalid",
    },
    body: {
      userId: "attacker-supplied-id",
      message: "Build something.",
    },
  });

  assert.equal(response.statusCode, 401);
});

test("uses authenticated identity instead of client-supplied userId", async () => {
  const resolver = new AuthenticatedRequestResolver({
    authenticate: async () => ({
      authenticated: true,
      identity: {
        userId: "real-user",
        sessionId: "session-1",
        roles: ["user"],
      },
    }),
  });

  let received: any;

  const orchestration = {
    submit: async (request: any) => {
      received = request;
      return {
        statusCode: 200,
        body: { status: "completed" },
      };
    },
    execute: async () => ({
      statusCode: 200,
      body: { status: "completed" },
    }),
  } as never;

  const controller = new AuthenticatedOrchestrationController(
    resolver,
    orchestration
  );

  const response = await controller.submit({
    headers: {
      authorization: "Bearer valid",
    },
    body: {
      userId: "attacker-supplied-id",
      message: "Build a program.",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(received.body.userId, "real-user");
});
