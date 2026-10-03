import {
  CredentialRecord,
  IdentityStatus,
  UserIdentity,
} from "./types";

export class IdentityStore {
  private readonly users = new Map<string, UserIdentity>();
  private readonly credentials = new Map<string, CredentialRecord>();

  createUser(
    input: Omit<UserIdentity, "createdAt" | "updatedAt">
  ): UserIdentity {
    if (this.users.has(input.id)) {
      throw new Error(`User "${input.id}" already exists.`);
    }

    const now = new Date().toISOString();

    const user: UserIdentity = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    return { ...user };
  }

  getUser(userId: string): UserIdentity | undefined {
    const user = this.users.get(userId);
    return user ? { ...user } : undefined;
  }

  findByEmail(email: string): UserIdentity | undefined {
    const normalized = email.trim().toLowerCase();

    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return { ...user };
      }
    }

    return undefined;
  }

  updateStatus(userId: string, status: IdentityStatus): UserIdentity {
    const user = this.users.get(userId);

    if (!user) {
      throw new Error(`User "${userId}" was not found.`);
    }

    const updated: UserIdentity = {
      ...user,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(userId, updated);
    return { ...updated };
  }

  saveCredential(
    credential: CredentialRecord
  ): CredentialRecord {
    const key = this.credentialKey(
      credential.userId,
      credential.provider,
      credential.credentialId
    );

    this.credentials.set(key, { ...credential });
    return { ...credential };
  }

  getCredential(
    userId: string,
    provider: string,
    credentialId: string
  ): CredentialRecord | undefined {
    const credential = this.credentials.get(
      this.credentialKey(userId, provider, credentialId)
    );

    return credential ? { ...credential } : undefined;
  }

  private credentialKey(
    userId: string,
    provider: string,
    credentialId: string
  ): string {
    return `${userId}:${provider}:${credentialId}`;
  }
}
