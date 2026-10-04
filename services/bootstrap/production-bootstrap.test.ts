import assert from "node:assert/strict";
import test from "node:test";
import { createProductionApplication } from "./production-bootstrap";

class FakeDatabase {
  async insert(record: Record<string, unknown>) {
    return record;
  }
  async findById() {
    return undefined;
  }
  async update() {
    return undefined;
  }
}

test("creates a production application from injected dependencies", async () => {
  const app = createProductionApplication(
    {
      database: new FakeDatabase(),
      authService: {
        authenticate: async () => ({
          authenticated: true,
          identity: { userId: "user-1", roles: ["user"] },
        }),
      },
      orchestratorController: {
        submit: async () => ({ statusCode: 200, body: {} }),
        execute: async () => ({ statusCode: 200, body: {} }),
      } as never,
    },
    "test"
  );

  assert.equal(app.environment, "test");
  assert.ok(app.apiRegistry);

  await app.start();
  await app.stop();
});
