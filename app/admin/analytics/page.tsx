import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    ordersLast7,
    ordersLast30,
    ordersByStatus,
    topProductsRaw,
    recentOrders,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { total: true, quantity: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "PAID" },
      _sum: { total: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const productIds = topProductsRaw.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  const topProducts = topProductsRaw.map((p) => ({
    id: p.productId,
    name: productMap[p.productId] ?? "Unknown",
    revenue: p._sum.total ?? 0,
    quantity: p._sum.quantity ?? 0,
  }));

  const statusMap: Record<string, number> = {};
  for (const s of ordersByStatus) statusMap[s.status] = s._count.id;

  // Group revenue by day
  const revenueByDay: Record<string, number> = {};
  for (const r of monthlyRevenue) {
    const day = r.createdAt.toISOString().split("T")[0];
    revenueByDay[day] = (revenueByDay[day] ?? 0) + (r._sum.total ?? 0);
  }
  const revenueChartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  return (
    <AnalyticsDashboard
      stats={{
        totalRevenue: totalRevenue._sum.total ?? 0,
        totalOrders,
        totalCustomers,
        avgOrderValue: totalOrders > 0 ? (totalRevenue._sum.total ?? 0) / totalOrders : 0,
        ordersLast7,
        ordersLast30,
      }}
      revenueChartData={revenueChartData}
      topProducts={topProducts}
      ordersByStatus={statusMap}
      recentOrders={recentOrders as any}
    />
  );
}
