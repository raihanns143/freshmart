import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    totalCustomers,
    totalProducts,
    lowStockProducts,
    pendingOrders,
    recentOrders,
    allOrders,
    recentLogs,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { in: ["USER", "CUSTOMER"] } } }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 10 } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.findMany({ select: { total: true, status: true, createdAt: true } }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const totalRevenue = allOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrderCount = allOrders.length;

  const currentMonth = new Date().getMonth();
  const currentMonthRevenue = allOrders
    .filter((o) => o.status !== "CANCELLED" && o.createdAt.getMonth() === currentMonth)
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <AdminDashboard
      stats={{
        revenue: totalRevenue,
        orders: totalOrderCount,
        customers: totalCustomers,
        products: totalProducts,
        pending: pendingOrders,
        lowStock: lowStockProducts,
        thisMonthRevenue: currentMonthRevenue,
      }}
      recentOrders={recentOrders}
      recentLogs={recentLogs as any}
    />
  );
}
