"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package, Plus, Search, ChevronLeft, ChevronRight,
  Filter, Edit2, Trash2, CheckSquare, Square,
  Download, Upload, Tag, MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/actions/admin-products";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  category: { name: string } | null;
  variants: { price: number; stock: number }[];
  images: { url: string; alt: string | null }[];
}

export function ProductsManager({
  products, total, page, pageSize, search, category, status, categories,
}: {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  status?: string;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(total / pageSize);

  function toggleAll() {
    if (selected.size === products.length) setSelected(new Set());
    else setSelected(new Set(products.map(p => p.id)));
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Permanently delete product "${name}"?`)) return;
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("Product deleted");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete product");
      }
    });
  }

  function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected products?`)) return;
    toast.info("Bulk deletion would execute here");
  }

  function exportExcel() {
    toast.info("Downloading Excel file...");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => toast.info("Opening Excel importer")} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            <Upload className="w-4 h-4" /> Import
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New Product
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4">
          <form className="flex gap-2 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search products by name or SKU..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <select
              name="category"
              defaultValue={category ?? ""}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={status ?? ""}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium hidden md:block">
              Filter
            </button>
          </form>
        </div>

        {selected.size > 0 && (
          <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-400">{selected.size} products selected</span>
            <div className="flex gap-2">
              <button onClick={() => toast.info("Bulk set status to Active")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium">Set Active</button>
              <button onClick={() => toast.info("Bulk set status to Draft")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium">Set Draft</button>
              <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium">Delete</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left w-12">
                  <button onClick={toggleAll} className="text-slate-500 hover:text-white">
                    {selected.size === products.length && products.length > 0 ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Inventory</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Variants</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Price Range</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                  const minPrice = Math.min(...product.variants.map((v) => v.price));
                  const maxPrice = Math.max(...product.variants.map((v) => v.price));
                  
                  return (
                    <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <button onClick={() => toggle(product.id)} className="text-slate-500 hover:text-white">
                          {selected.has(product.id) ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 relative overflow-hidden flex-shrink-0 border border-slate-700">
                            {product.images[0] ? (
                              <Image src={product.images[0].url} alt={product.images[0].alt || ""} fill className="object-cover" />
                            ) : (
                              <Package className="w-5 h-5 absolute inset-0 m-auto text-slate-500" />
                            )}
                          </div>
                          <div>
                            <Link href={`/admin/products/${product.id}/edit`} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">
                              {product.name}
                            </Link>
                            <p className="text-xs text-slate-500">{product.category?.name || "Uncategorized"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                          {product.isActive ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${totalStock === 0 ? "text-red-400" : totalStock < 10 ? "text-amber-400" : "text-slate-300"}`}>
                          {totalStock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {product.variants.length} variant(s)
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {product.variants.length === 0 ? "—" : minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${product.id}/edit`} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(product.id, product.name)} disabled={isPending} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
              <Link href={`/admin/products?page=${page - 1}${category ? `&category=${category}` : ""}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page <= 1 ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="px-3 py-2 text-sm text-slate-300">{page} / {totalPages}</span>
              <Link href={`/admin/products?page=${page + 1}${category ? `&category=${category}` : ""}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm transition-colors ${page >= totalPages ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
