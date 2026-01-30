/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Edit,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  PackageX,
  AlertCircle,
} from "lucide-react";
import CategoryForm from "./CategoryForm";
import { getHomeCategories } from "@/lib/api/categories";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getNormalDate } from "@/lib/getNormalDate";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

// Loading Skeleton Component
const TableSkeleton = () => {
  return (
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-slate-100">
          <td className="px-8 py-5">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-sm bg-slate-200 shrink-0"></div>
              <div className="h-4 bg-slate-200 rounded w-32"></div>
            </div>
          </td>
          <td className="px-8 py-5">
            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
          </td>
          <td className="px-8 py-5">
            <div className="h-6 bg-slate-200 rounded-full w-16 animate-pulse"></div>
          </td>
          <td className="px-8 py-5">
            <div className="h-6 bg-slate-200 rounded-xl w-20 animate-pulse"></div>
          </td>
          <td className="px-8 py-5">
            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
          </td>
          <td className="px-8 py-5">
            <div className="flex justify-end gap-1">
              <div className="w-9 h-9 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="w-9 h-9 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

// Empty State Component
const EmptyState = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <tbody>
      <tr>
        <td colSpan={6} className="px-8 py-16">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <PackageX className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchTerm ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-slate-500 text-center max-w-md mb-6">
              {searchTerm
                ? `We couldn't find any categories matching "${searchTerm}". Try adjusting your search.`
                : "Get started by creating your first category to organize your products."}
            </p>
            {!searchTerm && <CategoryForm />}
          </div>
        </td>
      </tr>
    </tbody>
  );
};

const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getHomeCategories,
  });

  // Memoize filtered categories to avoid recalculation on every render
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Memoize pagination calculations
  const { totalPages, paginatedCategories } = useMemo(() => {
    const total = Math.ceil(filteredCategories.length / itemsPerPage);
    const paginated = filteredCategories.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
    return { totalPages: total, paginatedCategories: paginated };
  }, [filteredCategories, page, itemsPerPage]);

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Categories
          </h1>
          <p className="text-slate-500 font-medium">
            Organize your product catalog for better discoverability.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            disabled={isRefetching}
            size={"icon"}
            onClick={() => refetch()}
            className="relative"
          >
            <RefreshCcw className={`${isRefetching ? "animate-spin" : ""}`} />
          </Button>
          <CategoryForm />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="rounded-2xl border-2">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold">
            Error Loading Categories
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {error instanceof Error
                ? error.message
                : "Failed to load categories. Please try again."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-4"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Search and Filter Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Filter className="w-4 h-4" /> All Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Category Name</th>
                <th className="px-8 py-5">Slug</th>
                <th className="px-8 py-5">Products</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Last Updated</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>

            {/* Loading State */}
            {isLoading && <TableSkeleton />}

            {/* Empty State */}
            {!isLoading && filteredCategories.length === 0 && (
              <EmptyState searchTerm={searchTerm} />
            )}

            {/* Data Rows */}
            {!isLoading && filteredCategories.length > 0 && (
              <tbody className="divide-y divide-slate-100">
                {paginatedCategories.map((cat) => {
                  const updatedDate = getNormalDate(cat.updatedAt);
                  return (
                    <tr
                      key={cat.id}
                      className="group hover:bg-slate-50/80 transition-all"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform">
                            <img
                              className="w-full h-full object-cover"
                              src={cat.image}
                              alt={cat.name}
                              onError={(e) => {
                                e.currentTarget.src = `https://picsum.photos/seed/${cat.id}/100/100`;
                              }}
                            />
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">
                        /{cat.slug}
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          {cat.productsCount || 0} items
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                            cat.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {cat.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-400">
                        {updatedDate}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-slate-100">
                            <Edit className="w-4 h-4" />
                          </button>
                          <DeleteCategoryButton
                            categoryId={cat.id}
                            categoryName={cat.name}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination Footer - Only show when there are categories */}
        {!isLoading && filteredCategories.length > 0 && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs font-bold text-slate-500">
              Showing{" "}
              <span className="text-slate-900">
                {Math.min(
                  filteredCategories.length,
                  (page - 1) * itemsPerPage + 1
                )}
                -{Math.min(filteredCategories.length, page * itemsPerPage)}
              </span>{" "}
              of{" "}
              <span className="text-slate-900">
                {filteredCategories.length}
              </span>{" "}
              {filteredCategories.length === 1 ? "category" : "categories"}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                      page === i + 1
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                // Show condensed pagination for more than 5 pages
                <span className="text-xs font-black text-slate-900 px-4">
                  Page {page} of {totalPages}
                </span>
              )}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
