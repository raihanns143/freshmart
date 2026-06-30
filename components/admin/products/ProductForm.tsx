"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, Plus, Trash2, Tag, Copy } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { createProduct, updateProduct } from "@/lib/actions/admin-products";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initialData?: any;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}

export function ProductForm({ mode, productId, initialData, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDesc: initialData?.shortDesc || "",
    categoryId: initialData?.categoryId || "",
    brandId: initialData?.brandId || "",
    isFeatured: initialData?.isFeatured || false,
    isActive: initialData?.isActive ?? true,
    metaTitle: initialData?.metaTitle || "",
    metaDesc: initialData?.metaDesc || "",
    tags: initialData?.tags?.join(", ") || "",
  });

  const [variants, setVariants] = useState<any[]>(
    initialData?.variants?.length 
      ? initialData.variants 
      : [{ id: "", sku: "", barcode: "", size: "", color: "", weight: "", price: "0", salePrice: "", stock: "0", image: "", isActive: true }]
  );

  const isEdit = mode === "edit";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleVariantChange(index: number, field: string, value: any) {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  }

  function addVariant() {
    setVariants([...variants, { id: "", sku: "", barcode: "", size: "", color: "", weight: "", price: "0", salePrice: "", stock: "0", image: "", isActive: true }]);
  }

  function removeVariant(index: number) {
    if (variants.length === 1) {
      toast.error("You must have at least one variant.");
      return;
    }
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  }

  function generateSlug() {
    if (!formData.name) return;
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((t: string) => t.trim()) : [],
        variants,
      };

      let result;
      if (isEdit && productId) {
        result = await updateProduct(productId, payload);
      } else {
        result = await createProduct(payload);
      }

      if (result.success) {
        toast.success(`Product ${isEdit ? "updated" : "created"} successfully`);
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{isEdit ? "Edit Product" : "New Product"}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{isEdit ? "Update product details and variants" : "Add a new product to your catalog"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors">
            Cancel
          </Link>
          <button 
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Product Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-300">Slug *</label>
                  <button type="button" onClick={generateSlug} className="text-xs text-emerald-400 hover:text-emerald-300">Generate from name</button>
                </div>
                <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Short Description</label>
                <textarea rows={2} name="shortDesc" value={formData.shortDesc} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Description</label>
                <textarea rows={5} name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Variants & Pricing</h2>
              <button type="button" onClick={addVariant} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>
            
            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="p-4 border border-slate-700 rounded-xl bg-slate-800/50 relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => removeVariant(i)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Size / Option Name</label>
                      <input type="text" value={v.size || ""} onChange={(e) => handleVariantChange(i, "size", e.target.value)} placeholder="e.g. 1kg, Large" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Color</label>
                      <input type="text" value={v.color || ""} onChange={(e) => handleVariantChange(i, "color", e.target.value)} placeholder="e.g. Red" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">SKU</label>
                      <input type="text" value={v.sku || ""} onChange={(e) => handleVariantChange(i, "sku", e.target.value)} placeholder="SKU-123" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Barcode</label>
                      <input type="text" value={v.barcode || ""} onChange={(e) => handleVariantChange(i, "barcode", e.target.value)} placeholder="UPC/EAN" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Price ($) *</label>
                      <input required type="number" step="0.01" value={v.price} onChange={(e) => handleVariantChange(i, "price", e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Sale Price ($)</label>
                      <input type="number" step="0.01" value={v.salePrice || ""} onChange={(e) => handleVariantChange(i, "salePrice", e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Stock *</label>
                      <input required type="number" value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Image URL</label>
                      <input type="text" value={v.image || ""} onChange={(e) => handleVariantChange(i, "image", e.target.value)} placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status & Org */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select name="isActive" value={formData.isActive.toString()} onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.value === "true"}))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50">
                  <option value="true">Active</option>
                  <option value="false">Draft / Hidden</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
                <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50">
                  <option value="">Select category...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Brand</label>
                <select name="brandId" value={formData.brandId || ""} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50">
                  <option value="">No Brand</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <label className="flex items-center gap-3">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50" />
                <span className="text-sm text-slate-300">Featured Product</span>
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Meta Title</label>
                <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Meta Description</label>
                <textarea rows={3} name="metaDesc" value={formData.metaDesc} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
