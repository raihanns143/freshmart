"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package, AlertTriangle, XCircle, Search,
  ChevronLeft, ChevronRight, Plus, Minus, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { adjustStock } from "@/lib/actions/admin2";

interface Variant {
  id: string;
  stock: number;
  inStock: boolean;
  sku: string | null;
  color: string | null;
  size: string | null;
  price: number;
  product: { id: string; name: string; slug: string };
}

const ADJUSTMENT_TYPES = [
  { value: "PURCHASE", label: "Stock In (Purchase)" },
  { value: "RETURN", label: "Stock In (Return)" },
  { value: "SALE", label: "Stock Out (Sale)" },
  { value: "DAMAGE", label: "Stock Out (Damage)" },
  { value: "ADJUSTMENT", label: "Set to Exact Value" },
];

export function InventoryManager({
  variants, total, page, pageSize, search, filter, stats,
}: {
  variants: Variant[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
  filter: "all" | "low" | "out";
  stats: { totalVariants: number; outOfStock: number; lowStock: number };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [adjusting, setAdjusting] = useState<Variant | null>(null);
  const [adjType, setAdjType] = useState("PURCHASE");
  const [adjQty, setAdjQty] = useState(0);
  const [adjReason, setAdjReason] = useState("");

  const totalPages = Math.ceil(total / pageSize);

  async function handleAdjust() {
    if (!adjusting) return;
    if (adjQty <= 0 && adjType !== "ADJUSTMENT") return toast.error("Quantity must be positive");
    startTransition(async () => {
      const result = await adjustStock(
        adjusting.id,
        adjusting.product.id,
        adjQty,
        adjType,
        adjReason
      );
      if (result.success) {
        toast.success("Stock adjusted");
        setAdjusting(null);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage stock levels across all product variants</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total SKUs", value: stats.totalVariants, color: "blue", filter: "all" },
          { label: "Low Stock", value: stats.lowStock, color: "amber", filter: "low" },
          { label: "Out of Stock", value: stats.outOfStock, color: "red", filter: "out" },
        ].map((s) => (
          <Link
            key={s.label}
            href={`/admin/inventory?filter=${s.filter}`}
            className={`p-4 bg-slate-900 border rounded-xl transition-all text-center ${
              filter === s.filter ? "border-emerald-500" : "border-slate-800 hover:border-slate-600"
            }`}
          >
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Adjust Modal */}
      {adjusting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-1">Adjust Stock</h2>
            <p className="text-slate-400 text-sm mb-4">
              {adjusting.product.name}
              {adjusting.sku && <span className="ml-2 font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded">{adjusting.sku}</span>}
              {adjusting.size && ` · ${adjusting.size}`}
              {adjusting.color && ` · ${adjusting.color}`}
            </p>
            <p className="text-sm text-slate-400 mb-4">Current stock: <span className="text-white font-semibold">{adjusting.stock}</span></p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Adjustment Type *</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {ADJUSTMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {adjType === "ADJUSTMENT" ? "New Stock Value" : "Quantity"}
                </label>
                <input
                  type="number"
                  min="0"
                  value={adjQty}
                  onChange={(e) => setAdjQty(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Reason / Note</label>
                <input
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setAdjusting(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm">
                Cancel
              </button>
              <button onClick={handleAdjust} disabled={isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
                {isPending ? "Saving…" : "Apply Adjustment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <form className="flex gap-2">
            <input type="hidden" name="filter" value={filter} />
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search by product name..."
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
                {["Product", "Variant", "SKU", "Price", "Stock", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No variants found</p>
                  </td>
                </tr>
              ) : (
                variants.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${v.product.id}/edit`} className="text-sm text-white hover:text-emerald-400 transition-colors">
                        {v.product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {[v.size, v.color].filter(Boolean).join(" / ") || "Default"}
                    </td>
                    <td className="px-4 py-3">
                      {v.sku ? (
                        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{v.sku}</span>
                      ) : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">${v.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${v.stock === 0 ? "text-red-400" : v.stock <= 10 ? "text-amber-400" : "text-white"}`}>
                          {v.stock}
                        </span>
                        {v.stock === 0 && <XCircle className="w-4 h-4 text-red-400" />}
                        {v.stock > 0 && v.stock <= 10 && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.inStock ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {v.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setAdjusting(v);
                          setAdjType("PURCHASE");
                          setAdjQty(0);
                          setAdjReason("");
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Adjust
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
              <Link href={`/admin/inventory?page=${page - 1}&filter=${filter}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page <= 1 ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="px-3 py-2 text-sm text-slate-300">{page} / {totalPages}</span>
              <Link href={`/admin/inventory?page=${page + 1}&filter=${filter}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page >= totalPages ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
