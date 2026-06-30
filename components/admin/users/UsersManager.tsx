"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users, Search, ChevronLeft, ChevronRight,
  Shield, ShieldCheck, Trash2, Mail, Phone, Edit2
} from "lucide-react";
import { toast } from "sonner";
import { updateUserRole, deleteUser } from "@/lib/actions/admin";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  createdAt: Date;
  _count: { orders: number; reviews: number };
}

export function UsersManager({
  users, total, page, pageSize, search, role, roleCounts,
}: {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  roleCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("USER");

  const totalPages = Math.ceil(total / pageSize);

  async function handleRoleUpdate(id: string) {
    startTransition(async () => {
      const result = await updateUserRole(id, editRole);
      if (result.success) {
        toast.success("User role updated");
        setEditingId(null);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to update role");
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Permanently delete user ${name}? This action cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteUser(id);
      if (result.success) {
        toast.success("User deleted");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete user");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users & Roles</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage administrators, staff, and customers</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { label: "All Users", value: undefined },
          { label: "Super Admins", value: "SUPER_ADMIN" },
          { label: "Admins", value: "ADMIN" },
          { label: "Managers", value: "MANAGER" },
          { label: "Customers", value: "USER" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.value ? `/admin/users?role=${s.value}` : "/admin/users"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              role === s.value || (!role && !s.value)
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {s.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({s.value ? (roleCounts[s.value] ?? 0) : total})
            </span>
          </Link>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <form className="flex gap-2">
            {role && <input type="hidden" name="role" value={role} />}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search users by name or email..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium">
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {["User", "Contact", "Role", "Orders", "Joined", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-500 font-bold text-sm uppercase">
                          {user.name?.[0] ?? user.email[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name || "Unknown"}</p>
                          <p className="text-xs text-slate-500">ID: {user.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          >
                            <option value="USER">USER (Customer)</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          </select>
                          <button
                            onClick={() => handleRoleUpdate(user.id)}
                            disabled={isPending}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            disabled={isPending}
                            className="text-xs text-slate-400 hover:text-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            user.role === "USER" ? "bg-slate-800 text-slate-300" :
                            user.role === "MANAGER" ? "bg-blue-500/10 text-blue-400" :
                            user.role === "ADMIN" ? "bg-purple-500/10 text-purple-400" :
                            "bg-amber-500/10 text-amber-400"
                          }`}>
                            {user.role !== "USER" ? <ShieldCheck className="w-3.5 h-3.5" /> : null}
                            {user.role}
                          </span>
                          <button
                            onClick={() => { setEditingId(user.id); setEditRole(user.role); }}
                            className="p-1 text-slate-500 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {user._count.orders} orders
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(user.id, user.name || user.email)}
                        disabled={isPending}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-400">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <Link href={`/admin/users?page=${page - 1}${role ? `&role=${role}` : ""}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page <= 1 ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="px-3 py-2 text-sm text-slate-300">{page} / {totalPages}</span>
              <Link href={`/admin/users?page=${page + 1}${role ? `&role=${role}` : ""}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page >= totalPages ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
