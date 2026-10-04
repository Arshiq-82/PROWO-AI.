import { DeviceCandidate } from "./types";

export interface SelectionScoreInput {
  capabilityScore: number;
  resourceScore: number;
  securityScore: number;
  capabilityWeight: number;
  resourceWeight: number;
  securityWeight: number;
}

export class SelectionScorer {
  score(input: SelectionScoreInput): number {
    const totalWeight = input.capabilityWeight + input.resourceWeight + input.securityWeight;
    if (totalWeight <= 0) return 0;
    const score = input.capabilityScore * input.capabilityWeight + input.resourceScore * input.resourceWeight + input.securityScore * input.securityWeight;
    return Math.max(0, Math.min(1, score / totalWeight));
  }

  rank(candidates: DeviceCandidate[]): DeviceCandidate[] {
    return [...candidates].sort((a, b) => b.totalScore - a.totalScore);
  }
}
