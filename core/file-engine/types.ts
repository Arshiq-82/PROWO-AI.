export interface FileRecord {
  id: string;
  projectId: string;
  path: string;
  content: string;
  language?: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileChange {
  fileId: string;
  type: "created" | "updated" | "deleted";
  path: string;
  previousContent?: string;
  newContent?: string;
  timestamp: string;
}

export interface ProjectFileSnapshot {
  projectId: string;
  version: number;
  files: FileRecord[];
  createdAt: string;
}

export interface FileSearchResult {
  fileId: string;
  projectId: string;
  path: string;
  matches: Array<{
    line: number;
    text: string;
  }>;
}
