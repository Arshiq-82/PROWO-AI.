import { TransportMessage } from "./types";

export class MessageCodec {
  encode(message: TransportMessage): string {
    return JSON.stringify(message);
  }

  decode(raw: string): TransportMessage {
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Invalid transport message JSON.");
    }

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Transport message must be an object.");
    }

    const message = parsed as Record<string, unknown>;

    if (
      typeof message.id !== "string" ||
      typeof message.type !== "string" ||
      typeof message.timestamp !== "string"
    ) {
      throw new Error(
        "Transport message requires id, type, and timestamp."
      );
    }

    return message as unknown as TransportMessage;
  }
}
