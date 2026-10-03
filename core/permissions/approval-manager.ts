import {
  ApprovalRequest,
  PermissionContext,
} from "./types";

export class ApprovalManager {
  private readonly requests = new Map<string, ApprovalRequest>();

  create(context: PermissionContext): ApprovalRequest {
    const request: ApprovalRequest = {
      id: `approval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      context,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.requests.set(request.id, request);
    return request;
  }

  get(requestId: string): ApprovalRequest | undefined {
    return this.requests.get(requestId);
  }

  approve(requestId: string, userId: string): ApprovalRequest {
    return this.resolve(requestId, "approved", userId);
  }

  reject(requestId: string, userId: string): ApprovalRequest {
    return this.resolve(requestId, "rejected", userId);
  }

  private resolve(
    requestId: string,
    status: "approved" | "rejected",
    userId: string
  ): ApprovalRequest {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new Error(`Approval request "${requestId}" was not found.`);
    }

    if (request.status !== "pending") {
      throw new Error("Approval request has already been resolved.");
    }

    const resolved: ApprovalRequest = {
      ...request,
      status,
      resolvedAt: new Date().toISOString(),
      resolvedBy: userId,
    };

    this.requests.set(requestId, resolved);
    return resolved;
  }
}
