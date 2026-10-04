import { CapabilityMatchResult, CapabilityRequirement, DeviceCapabilitySnapshot } from "./types";

export class CapabilityMatcher {
  match(snapshot: DeviceCapabilitySnapshot, requirements: CapabilityRequirement[]): CapabilityMatchResult {
    const missing: CapabilityRequirement[] = [];
    const incompatible: CapabilityRequirement[] = [];

    for (const requirement of requirements) {
      const capability = snapshot.capabilities.find(
        (c) => c.category === requirement.category && c.name === requirement.name && c.available
      );

      if (!capability) {
        missing.push(requirement);
      } else if (
        requirement.version &&
        capability.version &&
        !this.versionSatisfies(capability.version, requirement.version)
      ) {
        incompatible.push(requirement);
      }
    }

    const total = requirements.length;
    const score = total === 0 ? 1 : (total - missing.length - incompatible.length) / total;

    return {
      matched: missing.length === 0 && incompatible.length === 0,
      deviceId: snapshot.deviceId,
      missing,
      incompatible,
      score: Math.max(0, score),
    };
  }

  rank(snapshots: DeviceCapabilitySnapshot[], requirements: CapabilityRequirement[]): CapabilityMatchResult[] {
    return snapshots.map((s) => this.match(s, requirements)).sort((a, b) => b.score - a.score);
  }

  private versionSatisfies(actual: string, required: string): boolean {
    const a = this.parseVersion(actual);
    const r = this.parseVersion(required);

    for (let i = 0; i < Math.max(a.length, r.length); i++) {
      const av = a[i] ?? 0;
      const rv = r[i] ?? 0;
      if (av > rv) return true;
      if (av < rv) return false;
    }
    return true;
  }

  private parseVersion(version: string): number[] {
    return version.replace(/^[^\d]*/, "").split(".").map((part) => {
      const value = Number.parseInt(part, 10);
      return Number.isFinite(value) ? value : 0;
    });
  }
}
