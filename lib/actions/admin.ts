"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "@/types/admin";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const role = (session.user as any).role;
  if (!ADMIN_ROLES.includes(role)) throw new Error("Forbidden");
  return session;
}

// ─────────────────────────────────────────────────
// ORDER ACTIONS
// ─────────────────────────────────────────────────
export async function getOrders(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
}) {
  await requireAdmin();
  const { page = 1, pageSize = 20, search, status, paymentStatus } = params;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getOrderById(id: string) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      items: {
        include: {
          product: {
            select: { name: true, images: { where: { isMain: true }, take: 1 } },
          },
          productVariant: { select: { size: true, color: true, sku: true } },
        },
      },
      address: true,
      coupon: { select: { code: true, type: true, value: true } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
}

const UpdateOrderSchema = z.object({
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  notes: z.string().optional(),
});

export async function updateOrder(
  id: string,
  data: z.infer<typeof UpdateOrderSchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = UpdateOrderSchema.parse(data);

    const updateData: any = {};
    if (parsed.status) {
      updateData.status = parsed.status;
      if (parsed.status === "DELIVERED") updateData.deliveredAt = new Date();
      if (parsed.status === "CANCELLED") updateData.cancelledAt = new Date();
    }
    if (parsed.paymentStatus) updateData.paymentStatus = parsed.paymentStatus;
    if (parsed.estimatedDelivery)
      updateData.estimatedDelivery = new Date(parsed.estimatedDelivery);
    if (parsed.notes !== undefined) updateData.notes = parsed.notes;

    await prisma.order.update({ where: { id }, data: updateData });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_ORDER",
        entity: "Order",
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────
// CUSTOMER ACTIONS
// ─────────────────────────────────────────────────
export async function getCustomers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}) {
  await requireAdmin();
  const { page = 1, pageSize = 20, search, role } = params;
  const skip = (page - 1) * pageSize;

  const where: any = { role: role || "USER" };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true, reviews: true, wishlist: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getCustomerById(id: string) {
  await requireAdmin();
  return prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { items: true },
      },
      addresses: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { product: { select: { name: true } } },
      },
      wishlist: {
        take: 10,
        include: { product: { select: { name: true, images: { take: 1 } } } },
      },
    },
  });
}

export async function updateUserRole(
  id: string,
  role: string
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    await prisma.user.update({ where: { id }, data: { role } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_USER_ROLE",
        entity: "User",
        entityId: id,
        details: JSON.stringify({ role }),
      },
    });
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    await prisma.user.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "DELETE_USER",
        entity: "User",
        entityId: id,
      },
    });
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────
// REVIEW ACTIONS
// ─────────────────────────────────────────────────
export async function getReviews(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  await requireAdmin();
  const { page = 1, pageSize = 20, search, status } = params;
  const skip = (page - 1) * pageSize;
  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { comment: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function updateReviewStatus(
  id: string,
  status: string,
  reply?: string
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    await prisma.review.update({
      where: { id },
      data: { status, ...(reply !== undefined ? { reply } : {}) },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_REVIEW_STATUS",
        entity: "Review",
        entityId: id,
        details: JSON.stringify({ status }),
      },
    });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    await prisma.review.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "DELETE_REVIEW",
        entity: "Review",
        entityId: id,
      },
    });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
