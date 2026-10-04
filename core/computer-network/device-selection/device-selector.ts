import { CapabilityMatcher } from "../device-capabilities/capability-matcher";
import { DeviceCapabilitySnapshot } from "../device-capabilities/types";
import { DeviceResourceMonitor } from "../resource-monitoring/resource-monitor";
import { SelectionScorer } from "./selection-scoring";
import { DeviceCandidate, DeviceSelectionContext, DeviceSelectionRequirements } from "./types";

export class DeviceSelector {
  constructor(private readonly capabilityMatcher: CapabilityMatcher, private readonly resourceMonitor: DeviceResourceMonitor, private readonly scorer: SelectionScorer = new SelectionScorer()) {}

  evaluate(contexts: DeviceSelectionContext[], snapshots: DeviceCapabilitySnapshot[], requirements: DeviceSelectionRequirements = {}): DeviceCandidate[] {
    const capabilityRequirements = requirements.capabilities ?? [];
    const capabilityWeight = requirements.capabilityWeight ?? 0.45;
    const resourceWeight = requirements.resourceWeight ?? 0.40;
    const securityWeight = Math.max(0, 1 - capabilityWeight - resourceWeight);

    return contexts.map((context) => {
      const snapshot = snapshots.find((item) => item.deviceId === context.deviceId);
      const capabilityResult = snapshot ? this.capabilityMatcher.match(snapshot, capabilityRequirements) : {
        matched: capabilityRequirements.length === 0,
        deviceId: context.deviceId,
        missing: capabilityRequirements,
        incompatible: [],
        score: capabilityRequirements.length === 0 ? 1 : 0,
      };
      const resourceScore = context.resources ? this.resourceMonitor.availability(context.resources).score : 0;
      const securityScore = context.securityScore ?? 1;
      const reasons: string[] = [];

      if (requirements.requireOnline !== false && !context.online) reasons.push("Device is offline.");
      if (capabilityResult.missing.length > 0) reasons.push(`${capabilityResult.missing.length} required capabilities are missing.`);
      if (capabilityResult.incompatible.length > 0) reasons.push(`${capabilityResult.incompatible.length} capability requirements are incompatible.`);

      const eligible = (requirements.requireOnline === false || context.online) && capabilityResult.missing.length === 0 && capabilityResult.incompatible.length === 0 && securityScore > 0;
      const totalScore = this.scorer.score({ capabilityScore: capabilityResult.score, resourceScore, securityScore, capabilityWeight, resourceWeight, securityWeight });

      return { deviceId: context.deviceId, online: context.online, capabilityScore: capabilityResult.score, resourceScore, securityScore, totalScore, eligible, reasons };
    });
  }
}
