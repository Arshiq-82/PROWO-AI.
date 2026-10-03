import { DesktopAgentBridge } from "./agent-bridge";
import { DesktopRuntime } from "./desktop-runtime";
import { DesktopConfig } from "./types";

const config: DesktopConfig = {
  backendUrl:
    process.env.PROWO_BACKEND_URL ?? "http://localhost:3000",
  userId: process.env.PROWO_USER_ID,
  deviceId: process.env.PROWO_DEVICE_ID,
  deviceName:
    process.env.PROWO_DEVICE_NAME ?? "Prowo Desktop",
  autoStartAgent: true,
};

const agent = new DesktopAgentBridge();
const runtime = new DesktopRuntime(config, agent);

async function start(): Promise<void> {
  await runtime.start();

  console.log("Prowo Desktop started.");
  console.log(runtime.getState());
}

start().catch((error) => {
  console.error("Prowo Desktop failed to start:", error);
  process.exitCode = 1;
});
