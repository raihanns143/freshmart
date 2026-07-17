import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { UsersManager } from "@/components/admin/users/UsersManager";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (sp.role) where.role = sp.role;
  if (sp.search) {
    where.OR = [
      { name: { contains: sp.search, mode: "insensitive" } },
      { email: { contains: sp.search, mode: "insensitive" } },
    ];
  }

  const [users, total, roleStats] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true, reviews: true } }
      }
    }),
    prisma.user.count({ where }),
    prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
  ]);

  const roleCounts: Record<string, number> = {};
  for (const s of roleStats) roleCounts[s.role] = s._count.id;

  return (
    <UsersManager
      users={users as any}
      total={total}
      page={page}
      pageSize={pageSize}
      search={sp.search}
      role={sp.role}
      roleCounts={roleCounts}
    />
  );
}
