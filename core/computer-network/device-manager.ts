import {
  ConnectedDevice,
  DeviceStatus,
} from "./types";

export class DeviceManager {
  private readonly devices = new Map<string, ConnectedDevice>();

  register(device: ConnectedDevice): ConnectedDevice {
    this.devices.set(device.id, device);
    return device;
  }

  get(deviceId: string): ConnectedDevice | undefined {
    return this.devices.get(deviceId);
  }

  list(): ConnectedDevice[] {
    return Array.from(this.devices.values());
  }

  updateStatus(deviceId: string, status: DeviceStatus): ConnectedDevice {
    const device = this.devices.get(deviceId);

    if (!device) {
      throw new Error(`Device "${deviceId}" was not found.`);
    }

    const updated: ConnectedDevice = {
      ...device,
      status,
      lastHeartbeatAt: new Date().toISOString(),
    };

    this.devices.set(deviceId, updated);
    return updated;
  }

  heartbeat(deviceId: string): ConnectedDevice {
    return this.updateStatus(deviceId, "online");
  }

  remove(deviceId: string): boolean {
    return this.devices.delete(deviceId);
  }
}
