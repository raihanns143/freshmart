import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ReviewsManager } from "@/components/admin/reviews/ReviewsManager";

export const metadata: Metadata = { title: "Reviews" };
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    search?: string; 
    status?: string;
    rating?: string;
    verified?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (sp.status) where.status = sp.status;
  if (sp.rating) where.rating = parseInt(sp.rating);
  if (sp.verified === 'true') where.verified = true;
  if (sp.verified === 'false') where.verified = false;

  if (sp.search) {
    where.OR = [
      { comment: { contains: sp.search, mode: "insensitive" } },
      { title: { contains: sp.search, mode: "insensitive" } },
      { user: { name: { contains: sp.search, mode: "insensitive" } } },
      { user: { email: { contains: sp.search, mode: "insensitive" } } },
      { product: { name: { contains: sp.search, mode: "insensitive" } } },
    ];
  }

  const [reviews, total, statusStats] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.review.count({ where }),
    prisma.review.groupBy({ by: ["status"], _count: { id: true } }),
  ]);

  const statusCounts: Record<string, number> = {};
  for (const s of statusStats) statusCounts[s.status] = s._count.id;

  return (
    <ReviewsManager
      reviews={reviews as any}
      total={total}
      page={page}
      pageSize={pageSize}
      search={sp.search}
      status={sp.status}
      rating={sp.rating}
      verified={sp.verified}
      statusCounts={statusCounts}
    />
  );
}
