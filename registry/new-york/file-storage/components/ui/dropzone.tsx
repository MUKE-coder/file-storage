/* eslint-disable @next/next/no-img-element */
"use client";

import {
  File,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FileWithMetadata {
  id: string;
  file: File;
  uploading: boolean;
  progress: number;
  key?: string;
  provider?: string;
  publicUrl?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
}

interface DropzoneProps {
  provider: "aws" | "cloudflare";
  variant?: "default" | "compact" | "minimal" | "avatar" | "inline";
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  onFilesChange?: (files: FileWithMetadata[]) => void;
  className?: string;
  disabled?: boolean;
  helperText?: string;
}

/**
 * Extract key from S3/R2 public URL
 * Example: https://bucket.s3.region.amazonaws.com/key.png -> key.png
 */
export function extractKeyFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    // Remove leading slash and return the path
    return urlObj.pathname.substring(1);
  } catch (error) {
    console.error("Error extracting key from URL:", error);
    return null;
  }
}

export function Dropzone({
  provider,
  variant = "default",
  accept = {
    "image/*": [],
    "application/pdf": [],
    "application/msword": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      [],
    "application/zip": [],
  },
  maxFiles = 5,
  maxSize = 1024 * 1024 * 10, // 10MB
  onFilesChange,
  className,
  disabled = false,
  helperText,
}: DropzoneProps) {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);

  useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  const removeFile = async (fileId: string) => {
    try {
      const fileToRemove = files.find((f) => f.id === fileId);
      if (!fileToRemove) return;

      if (fileToRemove.objectUrl) {
        URL.revokeObjectURL(fileToRemove.objectUrl);
      }

      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === fileId ? { ...f, isDeleting: true } : f))
      );

      // Only attempt to delete from server if the file was successfully uploaded
      if (fileToRemove.key && fileToRemove.publicUrl) {
        const endpoint =
          provider === "aws" ? "/api/s3/delete" : "/api/r2/delete";
        const response = await fetch(endpoint, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: fileToRemove.key }),
        });

        if (!response.ok) {
          toast.error("Failed to delete file from server");
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === fileId ? { ...f, isDeleting: false, error: true } : f
            )
          );
          return;
        }
      }

      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
      toast.success("File removed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete file");
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileId ? { ...f, isDeleting: false, error: true } : f
        )
      );
    }
  };

  const uploadFile = async (file: File) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.file === file ? { ...f, uploading: true } : f))
    );

    try {
      const endpoint = provider === "aws" ? "/api/s3/upload" : "/api/r2/upload";
      const presignedResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file === file
              ? { ...f, uploading: false, progress: 0, error: true }
              : f
          )
        );
        return;
      }

      const { presignedUrl, key, publicUrl } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.file === file
                  ? {
                      ...f,
                      progress: Math.round(percentComplete),
                      key: key,
                      publicUrl: publicUrl,
                      provider: provider,
                    }
                  : f
              )
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.file === file
                  ? { ...f, progress: 100, uploading: false, error: false }
                  : f
              )
            );
            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === file
            ? { ...f, uploading: false, progress: 0, error: true }
            : f
        )
      );
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          id: uuidv4(),
          file,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          objectUrl: URL.createObjectURL(file),
        })),
      ]);

      acceptedFiles.forEach(uploadFile);
    }
  }, []);

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (fileRejections.length) {
        const tooManyFiles = fileRejections.find(
          (rejection) => rejection.errors[0].code === "too-many-files"
        );
        const fileTooLarge = fileRejections.find(
          (rejection) => rejection.errors[0].code === "file-too-large"
        );

        if (tooManyFiles) {
          toast.error(`Too many files. Maximum ${maxFiles} files allowed.`);
        }
        if (fileTooLarge) {
          toast.error(
            `File too large. Maximum ${maxSize / (1024 * 1024)}MB allowed.`
          );
        }
      }
    },
    [maxFiles, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles,
    maxSize,
    accept,
    disabled,
  });

  // Render variants
  if (variant === "avatar") {
    const currentFile = files[0];
    return (
      <div className={cn("relative", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-dashed transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input {...getInputProps()} />
          {currentFile?.objectUrl ? (
            <img
              src={currentFile.objectUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {currentFile?.uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="font-medium text-white">
                {currentFile.progress}%
              </div>
            </div>
          )}
        </div>
        {currentFile && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={() => removeFile(currentFile.id)}
            disabled={currentFile.isDeleting || currentFile.uploading}
          >
            {currentFile.isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("space-y-2", className)}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={disabled}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm">{file.file.name}</span>
                  {file.uploading && (
                    <span className="text-xs text-muted-foreground">
                      {file.progress}%
                    </span>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => removeFile(file.id)}
                  disabled={file.isDeleting || file.uploading}
                >
                  {file.isDeleting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div {...getRootProps()} className="flex-1">
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={disabled}
          >
            <Upload className="mr-2 h-3 w-3" />
            Choose File
          </Button>
        </div>
        {files.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="max-w-[150px] truncate text-sm text-muted-foreground">
              {files[0].file.name}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => removeFile(files[0].id)}
              disabled={files[0].isDeleting || files[0].uploading}
            >
              {files[0].isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  const isCompact = variant === "compact";

  return (
    <div className={cn("w-full", className)}>
      <Card
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer border-2 border-dashed transition-colors duration-200 ease-in-out",
          isCompact ? "h-32" : "h-64",
          isDragActive
            ? "border-solid border-primary bg-primary/10"
            : "border-border hover:border-primary",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <CardContent className="flex h-full w-full items-center justify-center p-4">
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-primary" />
              <p className="text-center text-sm">Drop the files here...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Drag & drop files here, or click to select
              </p>
              <Button size={isCompact ? "sm" : "default"} type="button">
                Select Files
              </Button>
              {helperText && (
                <p className="text-center text-xs text-muted-foreground">
                  {helperText}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {files.map(
            ({
              id,
              file,
              uploading,
              progress,
              isDeleting,
              error,
              objectUrl,
            }) => {
              const isImage = file.type.startsWith("image/");

              return (
                <div key={id} className="flex flex-col gap-1">
                  <div className="relative aspect-square overflow-hidden rounded-lg border">
                    {isImage ? (
                      <img
                        src={objectUrl}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <File className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(id);
                      }}
                      disabled={isDeleting || uploading}
                      type="button"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>

                    {uploading && !isDeleting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-lg font-medium text-white">
                          {progress}%
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                        <div className="font-medium text-white">Error</div>
                      </div>
                    )}
                  </div>
                  <p className="truncate px-1 text-xs text-muted-foreground">
                    {file.name}
                  </p>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

// Cleanup hook on unmount
export function useDropzoneCleanup(files: FileWithMetadata[]) {
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.objectUrl) {
          URL.revokeObjectURL(file.objectUrl);
        }
      });
    };
  }, [files]);
}
