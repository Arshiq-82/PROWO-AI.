import { ConnectedDevice } from "./types";
import { DeviceManager } from "./device-manager";

export interface AgentRegistration {
  device: ConnectedDevice;
  registrationToken: string;
}

export class AgentRegistry {
  constructor(private readonly deviceManager: DeviceManager) {}

  register(registration: AgentRegistration): ConnectedDevice {
    // Token verification will be handled by the authentication/security
    // layer before production agents are accepted.
    if (!registration.registrationToken.trim()) {
      throw new Error("Agent registration token is required.");
    }

    return this.deviceManager.register(registration.device);
  }

  heartbeat(deviceId: string): ConnectedDevice {
    return this.deviceManager.heartbeat(deviceId);
  }
}
