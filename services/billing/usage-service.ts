import { CreditLedger } from "./credit-ledger";
import { UsageRecord } from "./types";

export class UsageService {
  private readonly records = new Map<string, UsageRecord[]>();

  constructor(private readonly ledger: CreditLedger) {}

  recordUsage(input: Omit<UsageRecord, "id" | "createdAt">): UsageRecord {
    if (input.units < 0 || input.credits < 0) {
      throw new Error("Usage values cannot be negative.");
    }

    const record: UsageRecord = {
      ...input,
      id: this.createId(),
      createdAt: new Date().toISOString(),
    };

    if (record.credits > 0) {
      this.ledger.consumeReserved(
        record.userId,
        record.credits,
        `Usage: ${record.category}`,
        record.id
      );
    }

    const userRecords = this.records.get(record.userId) ?? [];
    userRecords.push(record);
    this.records.set(record.userId, userRecords);

    return { ...record };
  }

  getUserUsage(userId: string): UsageRecord[] {
    return (this.records.get(userId) ?? []).map((record) => ({
      ...record,
    }));
  }

  getTotalCreditsUsed(userId: string): number {
    return this.getUserUsage(userId).reduce(
      (total, record) => total + record.credits,
      0
    );
  }

  private createId(): string {
    return `usage_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}
