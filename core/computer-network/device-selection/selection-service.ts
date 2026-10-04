import { CapabilityMatcher } from "../device-capabilities/capability-matcher";
import { DeviceCapabilitySnapshot } from "../device-capabilities/types";
import { DeviceResourceMonitor } from "../resource-monitoring/resource-monitor";
import { SelectionScorer } from "./selection-scoring";
import { DeviceSelector } from "./device-selector";
import { DeviceSelectionContext, DeviceSelectionRequirements, DeviceSelectionResult } from "./types";

export class DeviceSelectionService {
  private readonly selector: DeviceSelector;

  constructor(capabilityMatcher: CapabilityMatcher, resourceMonitor: DeviceResourceMonitor, scorer?: SelectionScorer) {
    this.selector = new DeviceSelector(capabilityMatcher, resourceMonitor, scorer);
  }

  select(contexts: DeviceSelectionContext[], snapshots: DeviceCapabilitySnapshot[], requirements: DeviceSelectionRequirements = {}): DeviceSelectionResult {
    const candidates = this.selector.evaluate(contexts, snapshots, requirements);
    const eligible = candidates.filter((candidate) => candidate.eligible).sort((a, b) => b.totalScore - a.totalScore);
    if (eligible.length === 0) return { candidates, reason: "No eligible device matched the requirements." };
    const minimumScore = requirements.minScore ?? 0;
    const selected = eligible.find((candidate) => candidate.totalScore >= minimumScore);
    if (!selected) return { candidates, reason: "Eligible devices exist, but none reached the minimum score." };
    return { selectedDeviceId: selected.deviceId, candidates, reason: `Selected ${selected.deviceId} with score ${selected.totalScore.toFixed(3)}.` };
  }
}
