"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Edit2, Trash2, Ticket, Search, ChevronLeft, ChevronRight,
  ToggleLeft, ToggleRight, Percent, DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { createCoupon, updateCoupon, deleteCoupon, toggleCoupon } from "@/lib/actions/admin2";

const EMPTY_FORM = {
  code: "", description: "", type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
  value: 0, minOrderAmount: 0, maxDiscount: "", maxUses: "",
  perUserLimit: "", isActive: true, expiresAt: "",
};

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  maxUses: number | null;
  usedCount: number;
  perUserLimit: number | null;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  _count: { orders: number };
}

export function CouponsManager({
  initialCoupons, total, page, pageSize, search,
}: {
  initialCoupons: Coupon[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [q, setQ] = useState(search ?? "");

  const totalPages = Math.ceil(total / pageSize);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description ?? "",
      type: coupon.type as "PERCENTAGE" | "FIXED",
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount?.toString() ?? "",
      maxUses: coupon.maxUses?.toString() ?? "",
      perUserLimit: coupon.perUserLimit?.toString() ?? "",
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      code: form.code.toUpperCase(),
      description: form.description || undefined,
      type: form.type,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : null,
      isActive: form.isActive,
      expiresAt: form.expiresAt || null,
    };
    startTransition(async () => {
      const result = editingId
        ? await updateCoupon(editingId, data)
        : await createCoupon(data);
      if (result.success) {
        toast.success(editingId ? "Coupon updated" : "Coupon created");
        setShowForm(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed");
      }
    });
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    startTransition(async () => {
      const result = await deleteCoupon(id);
      if (result.success) { toast.success("Deleted"); router.refresh(); }
      else toast.error(result.error ?? "Failed");
    });
  }

  async function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      const result = await toggleCoupon(id, !isActive);
      if (result.success) { toast.success(isActive ? "Disabled" : "Enabled"); router.refresh(); }
      else toast.error(result.error ?? "Failed");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Coupons</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} coupons</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Coupon
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingId ? "Edit Coupon" : "New Coupon"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 uppercase"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Description</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Value {form.type === "PERCENTAGE" ? "(%)" : "($)"} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.value}
                    onChange={(e) => setForm((f) => ({ ...f, value: parseFloat(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Min Order ($)</label>
                  <input
                    type="number" step="0.01" min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: parseFloat(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Max Discount ($)</label>
                  <input
                    type="number" step="0.01" min="0"
                    value={form.maxDiscount}
                    onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
                    placeholder="Unlimited"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Max Uses</label>
                  <input
                    type="number" min="0"
                    value={form.maxUses}
                    onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                    placeholder="Unlimited"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Per User Limit</label>
                  <input
                    type="number" min="0"
                    value={form.perUserLimit}
                    onChange={(e) => setForm((f) => ({ ...f, perUserLimit: e.target.value }))}
                    placeholder="Unlimited"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="coupon-active"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <label htmlFor="coupon-active" className="text-sm text-slate-300">Active</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
                  {isPending ? "Saving…" : editingId ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800">
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search coupons..."
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
                {["Code", "Type", "Value", "Min Order", "Used", "Expiry", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {initialCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    <Ticket className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No coupons found</p>
                  </td>
                </tr>
              ) : (
                initialCoupons.map((coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  return (
                    <tr key={coupon.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-white font-semibold">{coupon.code}</span>
                        {coupon.description && <p className="text-xs text-slate-500 mt-0.5">{coupon.description}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-slate-300">
                          {coupon.type === "PERCENTAGE" ? <Percent className="w-3.5 h-3.5 text-slate-400" /> : <DollarSign className="w-3.5 h-3.5 text-slate-400" />}
                          {coupon.type}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-medium">
                        {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `$${coupon.value}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {coupon.minOrderAmount > 0 ? `$${coupon.minOrderAmount}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {coupon.usedCount}
                        {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {coupon.expiresAt ? (
                          <span className={isExpired ? "text-red-400" : "text-slate-400"}>
                            {new Date(coupon.expiresAt).toLocaleDateString()}
                          </span>
                        ) : <span className="text-slate-500">Never</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${coupon.isActive && !isExpired ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>
                          {isExpired ? "Expired" : coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleToggle(coupon.id, coupon.isActive)} disabled={isPending} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                            {coupon.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button onClick={() => openEdit(coupon)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(coupon.id, coupon.code)} disabled={isPending} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
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
              <Link href={`/admin/coupons?page=${page - 1}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page <= 1 ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="px-3 py-2 text-sm text-slate-300">{page} / {totalPages}</span>
              <Link href={`/admin/coupons?page=${page + 1}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page >= totalPages ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
