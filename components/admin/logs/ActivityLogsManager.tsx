"use client";

import Link from "next/link";
import {
  Activity, Search, ChevronLeft, ChevronRight, FileText,
  User, Box, ShoppingCart, Tag, Settings, Key
} from "lucide-react";

interface Log {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; email: string; role: string };
}

export function ActivityLogsManager({
  logs, total, page, pageSize, search, actionFilter, actionCounts,
}: {
  logs: Log[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
  actionFilter?: string;
  actionCounts: Record<string, number>;
}) {
  const totalPages = Math.ceil(total / pageSize);

  function getEntityIcon(entity: string) {
    if (entity === "User") return User;
    if (entity === "Product" || entity === "ProductVariant") return Box;
    if (entity === "Order") return ShoppingCart;
    if (entity === "Category" || entity === "Coupon") return Tag;
    if (entity === "Setting") return Settings;
    if (entity === "Auth") return Key;
    return FileText;
  }

  function getActionColor(action: string) {
    if (action.includes("CREATE") || action.includes("ADD")) return "text-emerald-400 bg-emerald-500/10";
    if (action.includes("UPDATE") || action.includes("EDIT")) return "text-blue-400 bg-blue-500/10";
    if (action.includes("DELETE") || action.includes("REMOVE")) return "text-red-400 bg-red-500/10";
    if (action.includes("LOGIN") || action.includes("AUTH")) return "text-purple-400 bg-purple-500/10";
    return "text-slate-400 bg-slate-500/10";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
          <p className="text-slate-400 text-sm mt-0.5">Track system changes and admin actions</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex gap-2">
          <form className="flex gap-2 flex-1">
            <select
              name="action"
              defaultValue={actionFilter ?? ""}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">All Actions</option>
              {Object.keys(actionCounts).map((act) => (
                <option key={act} value={act}>{act} ({actionCounts[act]})</option>
              ))}
            </select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search logs by user, entity, or details..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium">
              Filter
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {["Date", "User", "Action", "Entity", "Details"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No activity logs found</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const Icon = getEntityIcon(log.entity);
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                            {log.user.name?.[0] ?? log.user.email[0]}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-white">{log.user.name || log.user.email}</p>
                            <p className="text-[10px] text-slate-500">{log.user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${getActionColor(log.action)}`}>
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-slate-300">
                          <Icon className="w-3.5 h-3.5 text-slate-500" />
                          {log.entity}
                          {log.entityId && <span className="text-xs text-slate-500">#{log.entityId.slice(-6)}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs truncate text-xs text-slate-400 font-mono">
                          {log.details ? log.details : "—"}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-400">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <Link href={`/admin/logs?page=${page - 1}${actionFilter ? `&action=${actionFilter}` : ""}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page <= 1 ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="px-3 py-2 text-sm text-slate-300">{page} / {totalPages}</span>
              <Link href={`/admin/logs?page=${page + 1}${actionFilter ? `&action=${actionFilter}` : ""}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page >= totalPages ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
