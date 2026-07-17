import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CouponsManager } from "@/components/admin/coupons/CouponsManager";

export const metadata: Metadata = { title: "Coupons" };
export const dynamic = "force-dynamic";

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (sp.search) {
    where.OR = [
      { code: { contains: sp.search, mode: "insensitive" } },
      { description: { contains: sp.search, mode: "insensitive" } },
    ];
  }

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    }),
    prisma.coupon.count({ where }),
  ]);

  return (
    <CouponsManager
      initialCoupons={coupons as any}
      total={total}
      page={page}
      pageSize={pageSize}
      search={sp.search}
    />
  );
}
