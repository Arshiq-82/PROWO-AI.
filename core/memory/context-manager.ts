import {
  ContextBundle,
  MemoryQuery,
} from "./types";
import { MemoryRetriever } from "./retrieval";

export class ContextManager {
  constructor(private readonly retriever: MemoryRetriever) {}

  buildContext(query: MemoryQuery): ContextBundle {
    const memories = this.retriever.search(query);

    const text = memories
      .map(
        ({ memory, score }) =>
          `[${memory.type} | relevance ${score.toFixed(2)}]\n${memory.content}`
      )
      .join("\n\n");

    return {
      memories,
      text,
    };
  }
}
