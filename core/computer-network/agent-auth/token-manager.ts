import { createHash, randomBytes } from "crypto";
import { AgentAuthToken } from "./types";

export class AgentTokenManager {
  private readonly tokens = new Map<
    string,
    AgentAuthToken
  >();

  issue(
    agentId: string,
    expiresAt?: string
  ): { token: string; record: AgentAuthToken } {
    const token = `pat_${randomBytes(32).toString("hex")}`;
    const tokenId = `tok_${randomBytes(12).toString("hex")}`;

    const record: AgentAuthToken = {
      tokenId,
      agentId,
      tokenHash: this.hash(token),
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    this.tokens.set(tokenId, record);

    return {
      token,
      record: { ...record },
    };
  }

  verify(token: string): AgentAuthToken | undefined {
    const hash = this.hash(token);

    for (const record of this.tokens.values()) {
      if (record.tokenHash !== hash) {
        continue;
      }

      if (record.revokedAt) {
        return undefined;
      }

      if (
        record.expiresAt &&
        new Date(record.expiresAt).getTime() <= Date.now()
      ) {
        return undefined;
      }

      return { ...record };
    }

    return undefined;
  }

  revoke(tokenId: string): boolean {
    const record = this.tokens.get(tokenId);

    if (!record) {
      return false;
    }

    record.revokedAt = new Date().toISOString();
    return true;
  }

  revokeForAgent(agentId: string): number {
    let count = 0;

    for (const record of this.tokens.values()) {
      if (
        record.agentId === agentId &&
        !record.revokedAt
      ) {
        record.revokedAt = new Date().toISOString();
        count += 1;
      }
    }

    return count;
  }

  private hash(token: string): string {
    return createHash("sha256")
      .update(token)
      .digest("hex");
  }
}
