import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";

export const metadata: Metadata = { title: "Orders" };

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; paymentStatus?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (sp.search) {
    where.OR = [
      { orderNumber: { contains: sp.search, mode: "insensitive" } },
      { user: { name: { contains: sp.search, mode: "insensitive" } } },
      { user: { email: { contains: sp.search, mode: "insensitive" } } },
    ];
  }
  if (sp.status) where.status = sp.status;
  if (sp.paymentStatus) where.paymentStatus = sp.paymentStatus;

  const [orders, total, stats] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const statusCounts: Record<string, number> = {};
  for (const s of stats) {
    statusCounts[s.status] = s._count.id;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {total} total orders
          </p>
        </div>
      </div>

      {/* Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "All", value: undefined, color: "slate" },
          { label: "Pending", value: "PENDING", color: "amber" },
          { label: "Confirmed", value: "CONFIRMED", color: "blue" },
          { label: "Processing", value: "PROCESSING", color: "indigo" },
          { label: "Shipped", value: "SHIPPED", color: "purple" },
          { label: "Delivered", value: "DELIVERED", color: "emerald" },
          { label: "Cancelled", value: "CANCELLED", color: "red" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.value ? `/admin/orders?status=${s.value}` : "/admin/orders"}
            className={`p-3 rounded-xl border transition-all text-center ${
              sp.status === s.value || (!sp.status && !s.value)
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-slate-800 bg-slate-900 hover:border-slate-600"
            }`}
          >
            <div className="text-xl font-bold text-white">
              {s.value ? (statusCounts[s.value] ?? 0) : total}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      <OrdersTable
        orders={orders}
        total={total}
        page={page}
        pageSize={pageSize}
        search={sp.search}
        status={sp.status}
        paymentStatus={sp.paymentStatus}
      />
    </div>
  );
}
