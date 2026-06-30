import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CustomerProfile } from "@/components/admin/customers/CustomerProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true } });
  return { title: user ? `Customer: ${user.name ?? user.email}` : "Customer Not Found" };
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { _count: { select: { items: true } } },
      },
      addresses: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { product: { select: { id: true, name: true } } },
      },
      wishlist: {
        take: 10,
        include: {
          product: {
            select: { id: true, name: true, images: { where: { isMain: true }, take: 1 } },
          },
        },
      },
    },
  });

  if (!customer) notFound();

  return <CustomerProfile customer={customer as any} />;
}
