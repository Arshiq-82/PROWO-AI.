import {
  MemoryMatch,
  MemoryQuery,
  MemoryRecord,
} from "./types";
import { MemoryStore } from "./memory-store";

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

function scoreMemory(query: string, memory: MemoryRecord): number {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return 0;
  }

  const content = memory.content.toLowerCase();

  let matches = 0;

  for (const token of queryTokens) {
    if (content.includes(token)) {
      matches += 1;
    }
  }

  return matches / queryTokens.length;
}

export class MemoryRetriever {
  constructor(private readonly store: MemoryStore) {}

  search(query: MemoryQuery): MemoryMatch[] {
    const candidates = this.store.list(query);

    return candidates
      .map((memory) => ({
        memory,
        score: scoreMemory(query.query, memory),
      }))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, query.limit ?? 10);
  }
}
