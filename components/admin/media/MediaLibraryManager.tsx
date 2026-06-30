"use client";

import { useState } from "react";
import { Search, Image as ImageIcon, Upload, Trash2, Copy, Check, Filter } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface MediaImage {
  id: string;
  url: string;
  alt: string | null;
  createdAt: Date;
  product: { id: string; name: string };
}

export function MediaLibraryManager({ initialImages }: { initialImages: MediaImage[] }) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredImages = initialImages.filter((img) =>
    (img.alt && img.alt.toLowerCase().includes(search.toLowerCase())) ||
    (img.product.name.toLowerCase().includes(search.toLowerCase())) ||
    (img.url.toLowerCase().includes(search.toLowerCase()))
  );

  function copyUrl(id: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleUpload() {
    toast.info("Upload interface would open here. Configured for local/Cloudinary storage.");
  }

  function handleDelete() {
    toast.info("Delete functionality requires confirmation and checking for orphaned images.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage product images and assets</p>
        </div>
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Files
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by alt text, product name, or URL..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none min-w-[150px]">
            <option value="all">All Media</option>
            <option value="products">Product Images</option>
            <option value="banners">Banners</option>
          </select>
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium text-white mb-1">No media found</p>
          <p className="text-sm">Upload images to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredImages.map((img) => (
            <div key={img.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors relative">
              <div className="aspect-square relative bg-slate-800">
                <Image
                  src={img.url}
                  alt={img.alt || "Product image"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  className="object-cover"
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                  <button
                    onClick={() => copyUrl(img.id, img.url)}
                    className="p-2 bg-slate-800 hover:bg-emerald-600 rounded-lg text-white transition-colors flex items-center gap-2"
                  >
                    {copiedId === img.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-xs font-medium">Copy URL</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 bg-slate-800 hover:bg-red-600 rounded-lg text-white transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Delete</span>
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-white truncate" title={img.alt || img.product.name}>
                  {img.alt || img.product.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  Used in: {img.product.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
