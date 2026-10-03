export type CreditTransactionType =
  | "purchase"
  | "usage"
  | "refund"
  | "adjustment"
  | "bonus";

export interface CreditBalance {
  userId: string;
  available: number;
  reserved: number;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface UsageRecord {
  id: string;
  userId: string;
  category: "ai" | "tool" | "execution" | "storage" | "network" | "other";
  units: number;
  credits: number;
  model?: string;
  toolId?: string;
  taskId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}
