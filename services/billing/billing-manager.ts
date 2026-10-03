import { CreditLedger } from "./credit-ledger";
import { UsageService } from "./usage-service";
import {
  CreditBalance,
  CreditTransaction,
  UsageRecord,
} from "./types";

export class BillingManager {
  readonly ledger: CreditLedger;
  readonly usage: UsageService;

  constructor(
    ledger: CreditLedger = new CreditLedger()
  ) {
    this.ledger = ledger;
    this.usage = new UsageService(ledger);
  }

  getBalance(userId: string): CreditBalance {
    return this.ledger.getBalance(userId);
  }

  addCredits(
    userId: string,
    amount: number,
    description = "Credits added"
  ): CreditTransaction {
    return this.ledger.addCredits(
      userId,
      amount,
      "purchase",
      description
    );
  }

  reserveCredits(
    userId: string,
    amount: number
  ): CreditTransaction {
    return this.ledger.reserveCredits(userId, amount);
  }

  consumeUsage(
    input: Omit<UsageRecord, "id" | "createdAt">
  ): UsageRecord {
    return this.usage.recordUsage(input);
  }

  releaseCredits(
    userId: string,
    amount: number
  ): CreditTransaction {
    return this.ledger.releaseReserved(
      userId,
      amount
    );
  }
}
