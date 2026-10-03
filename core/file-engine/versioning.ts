import { FileChange } from "./types";

export class FileVersionHistory {
  private readonly changes = new Map<string, FileChange[]>();

  record(change: FileChange): void {
    const history = this.changes.get(change.fileId) ?? [];
    history.push(change);
    this.changes.set(change.fileId, history);
  }

  getHistory(fileId: string): FileChange[] {
    return [...(this.changes.get(fileId) ?? [])];
  }

  latest(fileId: string): FileChange | undefined {
    const history = this.changes.get(fileId);

    if (!history || history.length === 0) {
      return undefined;
    }

    return history[history.length - 1];
  }
}
