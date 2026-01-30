// lib/api/files/index.ts
export interface FileRecord {
  id: string;
  name: string;
  size: number;
  publicUrl: string;
  type: string;
  key: string;
  provider: "aws" | "cloudflare";
  createdAt: string;
  updatedAt: string;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  usedPercentage: number;
  maxStorage: number; // in bytes
  filesThisMonth: number;
}

export async function getFiles(): Promise<FileRecord[]> {
  const response = await fetch("/api/v1/files");
  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }
  return response.json();
}

export async function getStorageStats(): Promise<StorageStats> {
  const response = await fetch("/api/v1/files/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch storage stats");
  }
  return response.json();
}

export async function deleteFile(key: string, provider: string): Promise<void> {
  const endpoint = provider === "aws" ? "/api/s3/delete" : "/api/r2/delete";
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete file");
  }
}
