import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ActivityLogsManager } from "@/components/admin/logs/ActivityLogsManager";

export const metadata: Metadata = { title: "Activity Logs" };
export const dynamic = "force-dynamic";

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; action?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (sp.action) where.action = sp.action;
  if (sp.search) {
    where.OR = [
      { user: { name: { contains: sp.search, mode: "insensitive" } } },
      { user: { email: { contains: sp.search, mode: "insensitive" } } },
      { entity: { contains: sp.search, mode: "insensitive" } },
      { details: { contains: sp.search, mode: "insensitive" } },
    ];
  }

  const [logs, total, actionStats] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } }
      }
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.groupBy({ by: ["action"], _count: { id: true } }),
  ]);

  const actionCounts: Record<string, number> = {};
  for (const a of actionStats) actionCounts[a.action] = a._count.id;

  return (
    <ActivityLogsManager
      logs={logs as any}
      total={total}
      page={page}
      pageSize={pageSize}
      search={sp.search}
      actionFilter={sp.action}
      actionCounts={actionCounts}
    />
  );
}
