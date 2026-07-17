"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, Search, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Flag, Trash2, MessageSquare, Send, EyeOff, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { updateReviewStatus, deleteReview } from "@/lib/actions/admin";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  APPROVED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  HIDDEN: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  REPORTED: "bg-red-500/10 text-red-400 border-red-500/30",
};

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  reply: string | null;
  status: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
  user: { id: string; name: string | null; email: string };
  product: { id: string; name: string; slug: string };
}

export function ReviewsManager({
  reviews, total, page, pageSize, search, status, rating, verified, statusCounts,
}: {
  reviews: Review[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  rating?: string;
  verified?: string;
  statusCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(total / pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.size === reviews.length && reviews.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reviews.map(r => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  async function handleBulkAction(action: "APPROVE" | "HIDE" | "DELETE") {
    if (selectedIds.size === 0) return;
    if (action === "DELETE" && !confirm("Delete selected reviews permanently?")) return;

    startTransition(async () => {
      let successCount = 0;
      for (const id of Array.from(selectedIds)) {
        if (action === "DELETE") {
          const res = await deleteReview(id);
          if (res.success) successCount++;
        } else {
          const statusMap = { APPROVE: "APPROVED", HIDE: "HIDDEN" };
          const res = await updateReviewStatus(id, statusMap[action as keyof typeof statusMap]);
          if (res.success) successCount++;
        }
      }
      toast.success(`${successCount} reviews updated successfully`);
      setSelectedIds(new Set());
      router.refresh();
    });
  }

  async function handleStatus(id: string, newStatus: string, reply?: string) {
    startTransition(async () => {
      const result = await updateReviewStatus(id, newStatus, reply);
      if (result.success) {
        toast.success(`Review updated to ${newStatus.toLowerCase()}`);
        setReplyingId(null);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed");
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    startTransition(async () => {
      const result = await deleteReview(id);
      if (result.success) { toast.success("Review deleted"); router.refresh(); }
      else toast.error(result.error ?? "Failed");
    });
  }

  async function handleReply(id: string) {
    if (!replyText.trim()) return toast.error("Reply cannot be empty");
    await handleStatus(id, "APPROVED", replyText);
    setReplyText("");
  }

  const buildQuery = (updates: any) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (rating) params.set("rating", rating);
    if (verified) params.set("verified", verified);
    
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === "") params.delete(k);
      else params.set(k, v as string);
    });
    return params.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} total reviews</p>
        </div>
        
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium text-white px-2">{selectedIds.size} selected</span>
            <button onClick={() => handleBulkAction("APPROVE")} disabled={isPending} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors">
              <CheckCircle className="w-3.5 h-3.5" /> Approve
            </button>
            <button onClick={() => handleBulkAction("HIDE")} disabled={isPending} className="px-3 py-1.5 bg-slate-600/20 text-slate-300 hover:bg-slate-600/40 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors">
              <EyeOff className="w-3.5 h-3.5" /> Hide
            </button>
            <button onClick={() => handleBulkAction("DELETE")} disabled={isPending} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Search Product / Customer</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/admin/reviews?${buildQuery({ search: e.currentTarget.value, page: 1 })}`);
              }}
              placeholder="Search..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Rating</label>
          <select 
            value={rating || ""}
            onChange={(e) => router.push(`/admin/reviews?${buildQuery({ rating: e.target.value, page: 1 })}`)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">All Ratings</option>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Verified</label>
          <select 
            value={verified || ""}
            onChange={(e) => router.push(`/admin/reviews?${buildQuery({ verified: e.target.value, page: 1 })}`)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">Any</option>
            <option value="true">Verified Purchase</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "All", value: undefined },
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "APPROVED" },
          { label: "Hidden", value: "HIDDEN" },
          { label: "Reported", value: "REPORTED" },
        ].map((s) => (
          <Link
            key={s.label}
            href={`/admin/reviews?${buildQuery({ status: s.value, page: 1 })}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s.value || (!status && !s.value)
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {s.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({s.value ? (statusCounts[s.value] ?? 0) : total})
            </span>
          </Link>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        
        {/* Bulk Header */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/50">
            <input 
              type="checkbox" 
              checked={selectedIds.size === reviews.length && reviews.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500/50 bg-slate-800"
            />
            <span className="text-sm font-medium text-slate-400">Select All</span>
          </div>
        )}

        <div className="divide-y divide-slate-800">
          {reviews.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No reviews found</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className={`p-4 space-y-3 transition-colors ${selectedIds.has(review.id) ? 'bg-blue-500/5' : ''}`}>
                <div className="flex justify-between items-start gap-4">
                  
                  {/* Checkbox */}
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(review.id)}
                      onChange={() => toggleSelect(review.id)}
                      className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500/50 bg-slate-800"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium text-white">
                        {review.user.name ?? review.user.email}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[review.status] || STATUS_STYLES.PENDING}`}
                      >
                        {review.status}
                      </span>
                      {review.verified && (
                        <span className="text-xs text-blue-400 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <Link href={`/product/${review.product.slug}`} target="_blank" className="text-xs text-slate-500 hover:text-blue-400 mb-2 inline-block">
                      {review.product.name}
                    </Link>
                    {review.title && <p className="text-sm font-medium text-white">{review.title}</p>}
                    {review.comment && <p className="text-sm text-slate-300">{review.comment}</p>}
                    {review.reply && (
                      <div className="mt-2 pl-3 border-l-2 border-blue-500/30 bg-blue-500/5 p-2 rounded-r-md">
                        <p className="text-xs text-blue-400 font-medium mb-0.5">Admin Reply</p>
                        <p className="text-sm text-slate-300">{review.reply}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {review.status !== "APPROVED" && (
                      <button
                        onClick={() => handleStatus(review.id, "APPROVED")}
                        disabled={isPending}
                        title="Approve"
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {review.status !== "HIDDEN" && (
                      <button
                        onClick={() => handleStatus(review.id, "HIDDEN")}
                        disabled={isPending}
                        title="Hide"
                        className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded-lg transition-colors"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    {review.status !== "REPORTED" && (
                      <button
                        onClick={() => handleStatus(review.id, "REPORTED")}
                        disabled={isPending}
                        title="Mark as Reported"
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setReplyingId(replyingId === review.id ? null : review.id)}
                      title="Reply"
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={isPending}
                      title="Delete"
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reply Box */}
                {replyingId === review.id && (
                  <div className="flex gap-2 pl-4 ml-6">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Write your public reply to the customer..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    />
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={isPending || !replyText.trim()}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium self-start flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Post Reply
                    </button>
                  </div>
                )}
                <div className="pl-6 pt-1 flex justify-between items-center text-xs text-slate-600">
                  <p>{new Date(review.createdAt).toLocaleString()}</p>
                  {review.helpful > 0 && <span className="text-slate-400">👍 {review.helpful} Helpful</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
            <p className="text-sm text-slate-400">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <Link href={`/admin/reviews?${buildQuery({ page: page - 1 })}`} className={`p-2 rounded-lg text-sm ${page <= 1 ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="px-3 py-2 text-sm text-slate-300 font-medium">{page} / {totalPages}</span>
              <Link href={`/admin/reviews?${buildQuery({ page: page + 1 })}`} className={`p-2 rounded-lg text-sm ${page >= totalPages ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
