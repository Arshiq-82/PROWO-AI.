import { FileManager } from "./manager";
import {
  FileRecord,
  ProjectFileSnapshot,
} from "./types";

export class ProjectFileStore {
  constructor(private readonly fileManager: FileManager) {}

  getSnapshot(projectId: string, version: number): ProjectFileSnapshot {
    const files: FileRecord[] = this.fileManager.listProjectFiles(projectId);

    return {
      projectId,
      version,
      files,
      createdAt: new Date().toISOString(),
    };
  }

  getCurrentFiles(projectId: string): FileRecord[] {
    return this.fileManager.listProjectFiles(projectId);
  }
}
