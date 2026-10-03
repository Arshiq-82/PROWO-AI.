import {
  GatewaySecurityPolicy,
  SecurityCheckResult,
  SecureGatewaySession,
} from "./types";

export class GatewaySecurity {
  constructor(
    private readonly policy: GatewaySecurityPolicy = {
      requireAuthentication: true,
      verifyDeviceIdentity: true,
      maxSessionAgeMs: 24 * 60 * 60 * 1000,
    }
  ) {}

  check(
    session?: SecureGatewaySession,
    deviceId?: string
  ): SecurityCheckResult {
    if (this.policy.requireAuthentication && !session) {
      return {
        allowed: false,
        reason: "Authentication is required.",
      };
    }

    if (!session) {
      return { allowed: true };
    }

    if (
      Date.now() -
        new Date(session.authenticatedAt).getTime() >
      this.policy.maxSessionAgeMs
    ) {
      return {
        allowed: false,
        reason: "Gateway authentication session expired.",
      };
    }

    if (
      this.policy.verifyDeviceIdentity &&
      deviceId &&
      session.session.deviceId !== deviceId
    ) {
      return {
        allowed: false,
        reason: "Device identity verification failed.",
      };
    }

    return { allowed: true };
  }
}
