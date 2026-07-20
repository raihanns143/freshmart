import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export const metadata: Metadata = {
  title: "My Account – FreshMart",
  description: "Manage your orders, addresses, and account settings.",
};

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"];
  if ((session.user as any).role && ADMIN_ROLES.includes((session.user as any).role)) {
    redirect("/admin/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                select: {
                  images: {
                    take: 1,
                    where: { isMain: true },
                  },
                },
              },
            },
          },
        },
      },
      addresses: {
        orderBy: { isDefault: "desc" },
      },
      wishlist: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: {
              images: { take: 1, where: { isMain: true } },
              category: { select: { name: true, slug: true } },
            },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 50,
      }
    },
  });

  const activeCoupons = await prisma.coupon.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!user) {
    redirect("/login");
  }

  return <DashboardPage initialUser={user} activeCoupons={activeCoupons} />;
}
