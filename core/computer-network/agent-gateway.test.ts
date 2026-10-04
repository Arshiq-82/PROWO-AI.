import assert from "node:assert/strict";
import test from "node:test";
import { DeviceHealthManager } from "../health-monitor/health-manager";
import { NetworkSecurityManager } from "../network-security/security-manager";

test("authenticated trusted device can pass low-risk network authorization", () => {
  const security = new NetworkSecurityManager();

  security.registerDevice({
    deviceId: "device-1",
    authenticated: true,
    trusted: true,
    permissions: ["read_status", "connect"],
  });

  const result = security.authorize(
    "device-1",
    "read_status",
    "low"
  );

  assert.equal(result.allowed, true);
  assert.equal(result.requiresApproval, false);
});

test("health monitor recognizes a fresh heartbeat", () => {
  const health = new DeviceHealthManager();

  const result = health.heartbeat({
    deviceId: "device-1",
    timestamp: new Date().toISOString(),
    latencyMs: 25,
  });

  assert.equal(result.status, "healthy");
  assert.equal(result.snapshot.consecutiveMisses, 0);
});
