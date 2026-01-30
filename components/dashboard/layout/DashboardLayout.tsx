"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, ReactNode } from "react";

import {
  Layers,
  Menu,
  X,
  Rocket,
  Cloudy,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = usePathname();

  const navItems = [
    {
      name: "Categories",
      path: "/dashboard/categories",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      name: "File Storage",
      path: "/dashboard/file-storage",
      icon: <Cloudy className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "w-64" : "w-20"
        } transform md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shrink-0 shadow-lg shadow-indigo-100">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-black text-xl tracking-tighter text-slate-900">
                File Storage
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-2xl transition-all group ${
                isActive(item.path)
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 font-bold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium"
              }`}
            >
              <span
                className={`shrink-0 transition-transform group-hover:scale-110 ${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`}
              >
                {item.icon}
              </span>
              {isSidebarOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Info Section */}
        <div className="p-3 border-t border-slate-100">
          {isSidebarOpen && (
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-500 font-medium">
                File Storage Registry Demo
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                AWS S3 & Cloudflare R2 support
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}
      >
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">
              File Storage Dashboard
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
