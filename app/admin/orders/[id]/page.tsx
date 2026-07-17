import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderDetail } from "@/components/admin/orders/OrderDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    select: { orderNumber: true },
  });
  return { title: order ? `Order #${order.orderNumber}` : "Order Not Found" };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: { where: { isMain: true }, take: 1 },
            },
          },
          productVariant: {
            select: { size: true, color: true, sku: true, weight: true },
          },
        },
      },
      address: true,
      coupon: { select: { code: true, type: true, value: true } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) notFound();

  return <OrderDetail order={order as any} />;
}
