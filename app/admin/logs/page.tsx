import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ActivityLogsManager } from "@/components/admin/logs/ActivityLogsManager";

export const metadata: Metadata = { title: "Activity Logs" };
export const dynamic = "force-dynamic";

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; action?: string; role?: string; status?: string; date?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (sp.action) where.action = sp.action;
  if (sp.role) where.role = sp.role;
  if (sp.status) where.status = sp.status;
  
  if (sp.date) {
    const startDate = new Date(sp.date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(sp.date);
    endDate.setHours(23, 59, 59, 999);
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  if (sp.search) {
    where.OR = [
      { user: { name: { contains: sp.search, mode: "insensitive" } } },
      { user: { email: { contains: sp.search, mode: "insensitive" } } },
      { entity: { contains: sp.search, mode: "insensitive" } },
      { details: { contains: sp.search, mode: "insensitive" } },
    ];
  }

  const [logs, total, actionStats, roleStats] = await Promise.all([
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
    prisma.auditLog.groupBy({ by: ["role"], _count: { id: true } }),
  ]);

  const actionCounts: Record<string, number> = {};
  for (const a of actionStats) actionCounts[a.action] = a._count.id;
  
  const roleCounts: Record<string, number> = {};
  for (const r of roleStats) {
    if (r.role) roleCounts[r.role] = r._count.id;
  }

  return (
    <ActivityLogsManager
      logs={logs as any}
      total={total}
      page={page}
      pageSize={pageSize}
      search={sp.search}
      actionFilter={sp.action}
      roleFilter={sp.role}
      statusFilter={sp.status}
      dateFilter={sp.date}
      actionCounts={actionCounts}
      roleCounts={roleCounts}
    />
  );
}
