"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit2, Trash2, FolderTree, ChevronRight,
  CheckCircle, XCircle, Search
} from "lucide-react";
import { toast } from "sonner";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/admin2";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  color: string | null;
  icon: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  _count: { products: number; children: number };
}

const EMPTY_FORM = {
  name: "", slug: "", description: "", image: "",
  color: "", icon: "", parentId: "", metaTitle: "", metaDesc: "",
  isActive: true, sortOrder: 0,
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const rootCategories = categories.filter((c) => !c.parentId);
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      image: cat.image ?? "",
      color: cat.color ?? "",
      icon: cat.icon ?? "",
      parentId: cat.parentId ?? "",
      metaTitle: "",
      metaDesc: "",
      isActive: true,
      sortOrder: 0,
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
      ...form,
      parentId: form.parentId || null,
      isActive: form.isActive,
      sortOrder: 0,
    };

    startTransition(async () => {
      const result = editingId
        ? await updateCategory(editingId, data)
        : await createCategory(data);

      if (result.success) {
        toast.success(editingId ? "Category updated" : "Category created");
        setShowForm(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Operation failed");
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success("Category deleted");
        router.refresh();
      } else {
        toast.error(result.error ?? "Cannot delete category");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {categories.length} categories total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingId ? "Edit Category" : "New Category"}
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
                  <label className="text-xs text-slate-400 block mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={2}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Parent Category</label>
                  <select
                    value={form.parentId}
                    onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="">None (Root)</option>
                    {rootCategories
                      .filter((c) => c.id !== editingId)
                      .map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Color (hex)</label>
                  <input
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    placeholder="#22c55e"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Image URL</label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
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
          placeholder="Search categories..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      {/* Category Tree */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-semibold text-white text-sm">
            {search ? `Results for "${search}"` : "Category Tree"}
          </h2>
          <span className="text-xs text-slate-400">{filtered.length} items</span>
        </div>

        <div className="divide-y divide-slate-800">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No categories found</p>
            </div>
          ) : (
            filtered.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors ${
                  cat.parentId ? "pl-10" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {cat.parentId && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  )}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: cat.color ? `${cat.color}20` : undefined }}
                  >
                    {cat.icon ? (
                      <span>{cat.icon}</span>
                    ) : (
                      <FolderTree className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{cat.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {cat._count.products} products · {cat._count.children} sub-categories
                      {cat.parent && ` · Parent: ${cat.parent.name}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
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
