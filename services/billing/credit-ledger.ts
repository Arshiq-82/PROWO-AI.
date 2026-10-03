import {
  CreditBalance,
  CreditTransaction,
  CreditTransactionType,
} from "./types";

export class CreditLedger {
  private readonly balances = new Map<string, CreditBalance>();
  private readonly transactions = new Map<string, CreditTransaction[]>();

  getBalance(userId: string): CreditBalance {
    return this.ensureBalance(userId);
  }

  addCredits(
    userId: string,
    amount: number,
    type: CreditTransactionType = "purchase",
    description = "Credits added",
    referenceId?: string
  ): CreditTransaction {
    this.validateAmount(amount);

    const balance = this.ensureBalance(userId);
    balance.available += amount;
    balance.updatedAt = new Date().toISOString();

    return this.record({
      userId,
      type,
      amount,
      balanceAfter: balance.available,
      description,
      referenceId,
    });
  }

  reserveCredits(
    userId: string,
    amount: number,
    description = "Credits reserved"
  ): CreditTransaction {
    this.validateAmount(amount);

    const balance = this.ensureBalance(userId);

    if (balance.available < amount) {
      throw new Error("Insufficient credits.");
    }

    balance.available -= amount;
    balance.reserved += amount;
    balance.updatedAt = new Date().toISOString();

    return this.record({
      userId,
      type: "usage",
      amount: 0,
      balanceAfter: balance.available,
      description,
    });
  }

  consumeReserved(
    userId: string,
    amount: number,
    description = "Reserved credits consumed",
    referenceId?: string
  ): CreditTransaction {
    this.validateAmount(amount);

    const balance = this.ensureBalance(userId);

    if (balance.reserved < amount) {
      throw new Error("Insufficient reserved credits.");
    }

    balance.reserved -= amount;
    balance.updatedAt = new Date().toISOString();

    return this.record({
      userId,
      type: "usage",
      amount: -amount,
      balanceAfter: balance.available,
      description,
      referenceId,
    });
  }

  releaseReserved(
    userId: string,
    amount: number,
    description = "Reserved credits released"
  ): CreditTransaction {
    this.validateAmount(amount);

    const balance = this.ensureBalance(userId);

    if (balance.reserved < amount) {
      throw new Error("Insufficient reserved credits.");
    }

    balance.reserved -= amount;
    balance.available += amount;
    balance.updatedAt = new Date().toISOString();

    return this.record({
      userId,
      type: "refund",
      amount,
      balanceAfter: balance.available,
      description,
    });
  }

  getTransactions(userId: string): CreditTransaction[] {
    return (this.transactions.get(userId) ?? []).map((transaction) => ({
      ...transaction,
    }));
  }

  private ensureBalance(userId: string): CreditBalance {
    let balance = this.balances.get(userId);

    if (!balance) {
      balance = {
        userId,
        available: 0,
        reserved: 0,
        updatedAt: new Date().toISOString(),
      };

      this.balances.set(userId, balance);
    }

    return balance;
  }

  private record(
    input: Omit<CreditTransaction, "id" | "createdAt">
  ): CreditTransaction {
    const transaction: CreditTransaction = {
      ...input,
      id: this.createId(),
      createdAt: new Date().toISOString(),
    };

    const userTransactions =
      this.transactions.get(transaction.userId) ?? [];

    userTransactions.push(transaction);
    this.transactions.set(transaction.userId, userTransactions);

    return { ...transaction };
  }

  private validateAmount(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Credit amount must be greater than zero.");
    }
  }

  private createId(): string {
    return `credit_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}
