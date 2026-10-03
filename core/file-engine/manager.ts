import {
  FileRecord,
  FileSearchResult,
} from "./types";

export class FileManager {
  private readonly files = new Map<string, FileRecord>();

  create(input: {
    id: string;
    projectId: string;
    path: string;
    content: string;
    language?: string;
  }): FileRecord {
    const now = new Date().toISOString();

    const file: FileRecord = {
      id: input.id,
      projectId: input.projectId,
      path: input.path,
      content: input.content,
      language: input.language,
      sizeBytes: Buffer.byteLength(input.content, "utf8"),
      createdAt: now,
      updatedAt: now,
    };

    this.files.set(file.id, file);
    return file;
  }

  get(fileId: string): FileRecord | undefined {
    return this.files.get(fileId);
  }

  update(fileId: string, content: string): FileRecord {
    const file = this.files.get(fileId);

    if (!file) {
      throw new Error(`File "${fileId}" was not found.`);
    }

    const updated: FileRecord = {
      ...file,
      content,
      sizeBytes: Buffer.byteLength(content, "utf8"),
      updatedAt: new Date().toISOString(),
    };

    this.files.set(fileId, updated);
    return updated;
  }

  delete(fileId: string): boolean {
    return this.files.delete(fileId);
  }

  listProjectFiles(projectId: string): FileRecord[] {
    return Array.from(this.files.values()).filter(
      (file) => file.projectId === projectId
    );
  }

  search(projectId: string, query: string): FileSearchResult[] {
    const normalizedQuery = query.toLowerCase();
    const results: FileSearchResult[] = [];

    for (const file of this.listProjectFiles(projectId)) {
      const matches = file.content
        .split(/\r?\n/)
        .map((text, index) => ({ text, line: index + 1 }))
        .filter(({ text }) =>
          text.toLowerCase().includes(normalizedQuery)
        );

      if (matches.length > 0) {
        results.push({
          fileId: file.id,
          projectId: file.projectId,
          path: file.path,
          matches,
        });
      }
    }

    return results;
  }
}
