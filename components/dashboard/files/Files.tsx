/* eslint-disable @next/next/no-img-element */
// components/files/Files.tsx
"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  HardDrive,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getFiles, getStorageStats } from "@/lib/api/files";
import { getNormalDate } from "@/lib/getNormalDate";
import { QueryErrorDisplay } from "@/components/ui/error-display";

import { DeleteFileButton } from "./DeleteFileButton";
import TableLoading from "../categories/TableLoading";

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const Files: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch files
  const {
    data: files = [],
    isLoading: filesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: ["files"],
    queryFn: getFiles,
  });

  // Fetch storage stats
  const {
    data: stats,
    isLoading: statsLoading,
    // error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["storage-stats"],
    queryFn: getStorageStats,
  });

  const handleRefresh = () => {
    refetchFiles();
    refetchStats();
  };

  // Filter and paginate
  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            File Storage
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your uploaded files and monitor storage usage.
          </p>
        </div>
        <Button size="icon" onClick={handleRefresh}>
          <RefreshCcw />
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Storage Used */}
        <div className=" rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <HardDrive className="w-8 h-8 opacity-80" />
            <span className="text-sm font-bold opacity-80">STORAGE</span>
          </div>
          {statsLoading ? (
            <div className="h-12 bg-white/80 rounded-lg animate-pulse" />
          ) : (
            <>
              <div className="text-3xl font-black mb-1">
                {formatBytes(stats?.totalSize || 0)}
              </div>
              {/* <div className="text-sm opacity-80">
                of {formatBytes(stats?.maxStorage || 0)} used
              </div> */}
              {/* Progress Bar */}
              <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(stats?.usedPercentage || 0, 100)}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Total Files */}
        <div className="rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 opacity-80" />
            <span className="text-sm font-bold opacity-80">TOTAL FILES</span>
          </div>
          {statsLoading ? (
            <div className="h-12 bg-white/80 rounded-lg animate-pulse" />
          ) : (
            <>
              <div className="text-3xl font-black mb-1">
                {stats?.totalFiles.toLocaleString() || 0}
              </div>
              <div className="text-sm opacity-80">files uploaded</div>
            </>
          )}
        </div>

        {/* This Month */}
        <div className="rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm font-bold opacity-80">THIS MONTH</span>
          </div>
          {statsLoading ? (
            <div className="h-12 bg-white/20 rounded-lg animate-pulse" />
          ) : (
            <>
              <div className="text-3xl font-black mb-1">
                {stats?.filesThisMonth || 0}
              </div>
              <div className="text-sm opacity-80">files uploaded</div>
            </>
          )}
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" /> All Providers
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">File Name</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Size</th>
                <th className="px-8 py-5">Provider</th>
                <th className="px-8 py-5">Uploaded</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            {filesLoading && <TableLoading />}
            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0
                ? paginated.map((file) => {
                    const uploadDate = getNormalDate(file.createdAt);
                    return (
                      <tr
                        key={file.id}
                        className="group hover:bg-slate-50/80 transition-all"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={file.publicUrl}
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <FileText className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <span className="font-bold text-slate-900 truncate max-w-xs">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-medium text-slate-500">
                          {formatBytes(file.size)}
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                              file.provider === "cloudflare"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {file.provider}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-400">
                          {uploadDate}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-1">
                            <a
                              href={file.publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                            <DeleteFileButton
                              fileKey={file.key}
                              fileName={file.name}
                              provider={file.provider}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : !filesLoading && (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">
                          No files uploaded yet
                        </p>
                      </td>
                    </tr>
                  )}
              {filesError && (
                <tr>
                  <td colSpan={6}>
                    <QueryErrorDisplay
                      error={filesError as Error}
                      onRetry={refetchFiles}
                      title="Failed to load files"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900">{paginated.length}</span>{" "}
            of <span className="text-slate-900">{filtered.length}</span> files
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-black text-slate-900 px-4">
              Page {page} of {totalPages || 1}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Files;
