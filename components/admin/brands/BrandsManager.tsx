"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit2, Trash2, Tag,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { createBrand, updateBrand, deleteBrand } from "@/lib/actions/admin-brands";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  _count: { products: number };
}

const EMPTY_FORM = {
  name: "", slug: "", logo: ""
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function BrandsManager({ initialBrands }: { initialBrands: Brand[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [brands, setBrands] = useState(initialBrands);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.slug.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(brand: Brand) {
    setEditingId(brand.id);
    setForm({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo ?? "",
    });
    setShowForm(true);
  }

  function handleNameChange(val: string) {
    setForm((f) => ({ ...f, name: val, slug: slugify(val) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) return toast.error("Name and slug are required");

    const data = {
      name: form.name,
      slug: form.slug,
      logo: form.logo || null,
    };

    startTransition(async () => {
      const result = editingId
        ? await updateBrand(editingId, data)
        : await createBrand(data);

      if (result.success) {
        toast.success(editingId ? "Brand updated" : "Brand created");
        setShowForm(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Operation failed");
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete brand "${name}"?`)) return;
    startTransition(async () => {
      const result = await deleteBrand(id);
      if (result.success) {
        toast.success("Brand deleted");
        router.refresh();
      } else {
        toast.error(result.error ?? "Cannot delete brand");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Brands</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {brands.length} brands total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingId ? "Edit Brand" : "New Brand"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Logo URL</label>
                  <input
                    value={form.logo}
                    onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
                >
                  {isPending ? "Saving…" : editingId ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      {/* Brand List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-semibold text-white text-sm">
            {search ? `Results for "${search}"` : "All Brands"}
          </h2>
          <span className="text-xs text-slate-400">{filtered.length} items</span>
        </div>

        <div className="divide-y divide-slate-800">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No brands found</p>
            </div>
          ) : (
            filtered.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-sm flex-shrink-0 overflow-hidden relative">
                    {brand.logo ? (
                      <Image src={brand.logo} alt={brand.name} fill className="object-contain p-1" unoptimized />
                    ) : (
                      <Tag className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{brand.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {brand._count.products} products · /{brand.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(brand)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id, brand.name)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
