"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, Search, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Flag, Trash2, MessageSquare, Send
} from "lucide-react";
import { toast } from "sonner";
import { updateReviewStatus, deleteReview } from "@/lib/actions/admin";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/30",
  SPAM: "bg-slate-500/10 text-slate-400 border-slate-500/30",
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
  reviews, total, page, pageSize, search, status, statusCounts,
}: {
  reviews: Review[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  statusCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const totalPages = Math.ceil(total / pageSize);

  async function handleStatus(id: string, newStatus: string, reply?: string) {
    startTransition(async () => {
      const result = await updateReviewStatus(id, newStatus, reply);
      if (result.success) {
        toast.success(`Review ${newStatus.toLowerCase()}`);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} total reviews</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "All", value: undefined },
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "APPROVED" },
          { label: "Rejected", value: "REJECTED" },
          { label: "Spam", value: "SPAM" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.value ? `/admin/reviews?status=${s.value}` : "/admin/reviews"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s.value || (!status && !s.value)
                ? "bg-emerald-600 text-white"
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
        {/* Search */}
        <div className="p-4 border-b border-slate-800">
          <form className="flex gap-2">
            {status && <input type="hidden" name="status" value={status} />}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search reviews..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium">
              Search
            </button>
          </form>
        </div>

        <div className="divide-y divide-slate-800">
          {reviews.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No reviews found</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-4">
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
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[review.status]}`}
                      >
                        {review.status}
                      </span>
                      {review.verified && (
                        <span className="text-xs text-emerald-400">✓ Verified</span>
                      )}
                    </div>
                    <Link href={`/admin/products`} className="text-xs text-slate-500 hover:text-emerald-400 mb-1 block">
                      {review.product.name}
                    </Link>
                    {review.title && <p className="text-sm font-medium text-white">{review.title}</p>}
                    {review.comment && <p className="text-sm text-slate-400">{review.comment}</p>}
                    {review.reply && (
                      <div className="mt-2 pl-3 border-l-2 border-emerald-500/30">
                        <p className="text-xs text-emerald-400 font-medium mb-0.5">Admin Reply</p>
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
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {review.status !== "REJECTED" && (
                      <button
                        onClick={() => handleStatus(review.id, "REJECTED")}
                        disabled={isPending}
                        title="Reject"
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    {review.status !== "SPAM" && (
                      <button
                        onClick={() => handleStatus(review.id, "SPAM")}
                        disabled={isPending}
                        title="Mark as Spam"
                        className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
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
                  <div className="flex gap-2 pl-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Write your reply..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                    />
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={isPending || !replyText.trim()}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium self-start"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-slate-600 pl-0">{new Date(review.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-400">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <Link href={`/admin/reviews?page=${page - 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm ${page <= 1 ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="px-3 py-2 text-sm text-slate-300">{page} / {totalPages}</span>
              <Link href={`/admin/reviews?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`} className={`p-2 rounded-lg text-sm ${page >= totalPages ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
