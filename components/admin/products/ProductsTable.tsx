"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Filter, Edit2, Trash2, Copy, Eye, MoreHorizontal, Package } from "lucide-react";
import { toast } from "sonner";

type ProductStatus = "ACTIVE" | "DRAFT" | "INACTIVE";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  image?: string;
  createdAt: string;
}

const mockProducts: AdminProduct[] = [
  { id: "1", name: "Fresh Hilsha (Ilish)", slug: "fresh-hilsha-ilish", sku: "FSH-001", category: "Fresh Fish", price: 1200.00, salePrice: 1100.00, stock: 145, status: "ACTIVE", isFeatured: true, image: "/images/products/fresh-hilsha-ilish.webp", createdAt: "2026-01-15" },
  { id: "2", name: "Fresh Milk 1L", slug: "fresh-milk", sku: "DAI-001", category: "Dairy & Eggs", price: 2.49, stock: 88, status: "ACTIVE", isFeatured: false, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&q=70", createdAt: "2026-01-20" },
  { id: "3", name: "Sourdough Bread", slug: "sourdough-bread", sku: "BAK-001", category: "Bakery", price: 4.99, stock: 0, status: "INACTIVE", isFeatured: false, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=80&q=70", createdAt: "2026-02-01" },
  { id: "4", name: "Free Range Eggs", slug: "free-range-eggs", sku: "DAI-002", category: "Dairy & Eggs", price: 3.99, stock: 52, status: "ACTIVE", isFeatured: true, createdAt: "2026-02-10" },
  { id: "5", name: "Cherry Tomatoes", slug: "cherry-tomatoes", sku: "VEG-001", category: "Vegetables", price: 2.99, stock: 200, status: "DRAFT", isFeatured: false, createdAt: "2026-03-05" },
];

const statusBadge: Record<ProductStatus, string> = {
  ACTIVE: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  DRAFT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  INACTIVE: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export function ProductsTable() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(p => p.id)));
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success("Product deleted");
    setOpenMenu(null);
  };

  const handleDuplicate = (product: AdminProduct) => {
    const newProduct = { ...product, id: Date.now().toString(), name: product.name + " (Copy)", slug: product.slug + "-copy", status: "DRAFT" as ProductStatus };
    setProducts(prev => [newProduct, ...prev]);
    toast.success("Product duplicated");
    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {["ALL", "ACTIVE", "DRAFT", "INACTIVE"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === s ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 flex items-center gap-4">
          <span className="text-sm text-blue-400 font-medium">{selectedIds.size} selected</span>
          <button onClick={() => { selectedIds.forEach(id => handleDelete(id)); setSelectedIds(new Set()); }} className="text-xs text-red-400 hover:text-red-300">
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                    className="rounded border-slate-600 bg-slate-800 text-blue-500"
                  />
                </th>
                {["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => toggleSelect(product.id)}
                      className="rounded border-slate-600 bg-slate-800 text-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                        ) : (
                          <Package className="w-5 h-5 text-slate-500 m-auto mt-2.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate max-w-[180px]">{product.name}</p>
                        {product.isFeatured && <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-400">{product.sku ?? "–"}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{product.category}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {product.salePrice ? (
                        <>
                          <span className="text-white font-medium">${product.salePrice.toFixed(2)}</span>
                          <span className="text-slate-500 line-through ml-1.5 text-xs">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-white font-medium">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-400" : product.stock < 20 ? "text-amber-400" : "text-white"}`}>
                      {product.stock}
                    </span>
                    {product.stock === 0 && <span className="ml-1 text-[10px] text-red-400">Out</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusBadge[product.status]}`}>{product.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative flex items-center gap-1">
                      <Link href={`/admin/products/${product.id}/edit`}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-blue-500/20 hover:text-blue-400 flex items-center justify-center text-slate-400 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <Link href={`/product/${product.slug}`} target="_blank"
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-blue-500/20 hover:text-blue-400 flex items-center justify-center text-slate-400 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        {openMenu === product.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-20">
                              <button onClick={() => handleDuplicate(product)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                                <Copy className="w-3.5 h-3.5" />Duplicate
                              </button>
                              <button onClick={() => handleDelete(product.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
