"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2, X } from "lucide-react";
import { deleteFile } from "@/lib/api/files";

interface DeleteFileButtonProps {
  fileKey: string;
  fileName: string;
  provider: "aws" | "cloudflare";
}

export function DeleteFileButton({
  fileKey,
  fileName,
  provider,
}: DeleteFileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => deleteFile(fileKey, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["storage-stats"] });
      setIsModalOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleClose = () => {
    if (!deleteMutation.isPending) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2.5 text-slate-400 hover:text-red-600 rounded-xl transition-all"
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <button
              onClick={handleClose}
              disabled={deleteMutation.isPending}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
              Delete this file?
            </h3>

            <p className="text-gray-600 mb-6">
              Deleting <span className="font-medium">{fileName}</span> from
              storage is permanent and cannot be undone.
            </p>

            {deleteMutation.isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {deleteMutation.error instanceof Error
                    ? deleteMutation.error.message
                    : "Failed to delete file"}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClose}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
