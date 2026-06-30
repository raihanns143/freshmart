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
// CATEGORY ACTIONS
// ─────────────────────────────────────────────────
const CategorySchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  description: z.string().optional(),
  image: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  sortOrder: z.number().optional().default(0),
});

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { products: true, children: true } },
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      parent: { select: { id: true, name: true } },
      children: { select: { id: true, name: true } },
    },
  });
}

export async function createCategory(
  data: z.infer<typeof CategorySchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = CategorySchema.parse(data);
    const category = await prisma.category.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
        description: parsed.description,
        image: parsed.image,
        color: parsed.color,
        icon: parsed.icon,
        parentId: parsed.parentId || null,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "CREATE_CATEGORY",
        entity: "Category",
        entityId: category.id,
        details: JSON.stringify({ name: parsed.name }),
      },
    });
    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateCategory(
  id: string,
  data: z.infer<typeof CategorySchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = CategorySchema.parse(data);
    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.name,
        slug: parsed.slug,
        description: parsed.description,
        image: parsed.image,
        color: parsed.color,
        icon: parsed.icon,
        parentId: parsed.parentId || null,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_CATEGORY",
        entity: "Category",
        entityId: id,
        details: JSON.stringify({ name: parsed.name }),
      },
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const hasProducts = await prisma.product.count({ where: { categoryId: id } });
    if (hasProducts > 0) {
      return {
        success: false,
        error: `Cannot delete: ${hasProducts} products are in this category.`,
      };
    }
    await prisma.category.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "DELETE_CATEGORY",
        entity: "Category",
        entityId: id,
      },
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────
// COUPON ACTIONS
// ─────────────────────────────────────────────────
const CouponSchema = z.object({
  code: z.string().min(1).toUpperCase(),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().min(0),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().optional().nullable(),
  maxUses: z.number().int().optional().nullable(),
  perUserLimit: z.number().int().optional().nullable(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional().nullable(),
});

export async function getCoupons(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  await requireAdmin();
  const { page = 1, pageSize = 20, search } = params;
  const skip = (page - 1) * pageSize;
  const where: any = {};
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    }),
    prisma.coupon.count({ where }),
  ]);
  return { data: coupons, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createCoupon(
  data: z.infer<typeof CouponSchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = CouponSchema.parse(data);
    const coupon = await prisma.coupon.create({
      data: {
        code: parsed.code,
        description: parsed.description,
        type: parsed.type,
        value: parsed.value,
        minOrderAmount: parsed.minOrderAmount,
        maxDiscount: parsed.maxDiscount,
        maxUses: parsed.maxUses,
        perUserLimit: parsed.perUserLimit,
        isActive: parsed.isActive,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "CREATE_COUPON",
        entity: "Coupon",
        entityId: coupon.id,
        details: JSON.stringify({ code: parsed.code }),
      },
    });
    revalidatePath("/admin/coupons");
    return { success: true, data: coupon };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateCoupon(
  id: string,
  data: z.infer<typeof CouponSchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = CouponSchema.parse(data);
    await prisma.coupon.update({
      where: { id },
      data: {
        code: parsed.code,
        description: parsed.description,
        type: parsed.type,
        value: parsed.value,
        minOrderAmount: parsed.minOrderAmount,
        maxDiscount: parsed.maxDiscount,
        maxUses: parsed.maxUses,
        perUserLimit: parsed.perUserLimit,
        isActive: parsed.isActive,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_COUPON",
        entity: "Coupon",
        entityId: id,
      },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    await prisma.coupon.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "DELETE_COUPON",
        entity: "Coupon",
        entityId: id,
      },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function toggleCoupon(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    await prisma.coupon.update({ where: { id }, data: { isActive } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: isActive ? "ENABLE_COUPON" : "DISABLE_COUPON",
        entity: "Coupon",
        entityId: id,
      },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────
// INVENTORY ACTIONS
// ─────────────────────────────────────────────────
export async function getInventory(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: "low" | "out" | "all";
}) {
  await requireAdmin();
  const { page = 1, pageSize = 20, search, filter } = params;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  if (filter === "out") where.inStock = false;

  const [variants, total] = await Promise.all([
    prisma.productVariant.findMany({
      where: {
        isActive: true,
        ...(filter === "out" ? { stock: 0 } : {}),
        ...(filter === "low" ? { stock: { gt: 0, lte: 10 } } : {}),
        product: search
          ? { name: { contains: search, mode: "insensitive" } }
          : undefined,
      },
      skip,
      take: pageSize,
      orderBy: { stock: "asc" },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.productVariant.count({
      where: {
        isActive: true,
        ...(filter === "out" ? { stock: 0 } : {}),
        ...(filter === "low" ? { stock: { gt: 0, lte: 10 } } : {}),
      },
    }),
  ]);

  return {
    data: variants,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function adjustStock(
  productVariantId: string,
  productId: string,
  quantity: number,
  type: string,
  reason: string
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();

    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
      select: { stock: true },
    });
    if (!variant) return { success: false, error: "Variant not found" };

    const newStock = type === "ADJUSTMENT"
      ? quantity
      : type === "PURCHASE" || type === "RETURN"
      ? variant.stock + quantity
      : Math.max(0, variant.stock - quantity);

    await prisma.$transaction([
      prisma.productVariant.update({
        where: { id: productVariantId },
        data: { stock: newStock, inStock: newStock > 0 },
      }),
      prisma.inventory.create({
        data: {
          productVariantId,
          productId,
          quantity,
          type,
          reason,
        },
      }),
    ]);

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "ADJUST_STOCK",
        entity: "ProductVariant",
        entityId: productVariantId,
        details: JSON.stringify({ quantity, type, reason }),
      },
    });

    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getInventoryLogs(productVariantId: string) {
  await requireAdmin();
  return prisma.inventory.findMany({
    where: { productVariantId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

// ─────────────────────────────────────────────────
// SETTINGS ACTIONS
// ─────────────────────────────────────────────────
export async function getSettings() {
  await requireAdmin();
  const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function updateSettings(
  data: Record<string, string>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_SETTINGS",
        entity: "Setting",
        details: JSON.stringify(Object.keys(data)),
      },
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────
// ACTIVITY LOGS ACTIONS
// ─────────────────────────────────────────────────
export async function getActivityLogs(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  action?: string;
}) {
  await requireAdmin();
  const { page = 1, pageSize = 50, search, action } = params;
  const skip = (page - 1) * pageSize;
  const where: any = {};
  if (action) where.action = { contains: action, mode: "insensitive" };
  if (search) {
    where.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { entity: { contains: search, mode: "insensitive" } },
      { details: { contains: search, mode: "insensitive" } },
    ];
  }
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);
  return { data: logs, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

// ─────────────────────────────────────────────────
// ANALYTICS ACTIONS
// ─────────────────────────────────────────────────
export async function getAnalytics() {
  await requireAdmin();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    revenueByDay,
    topProducts,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        paymentStatus: "PAID",
      },
      _sum: { total: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { total: true, quantity: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    }),
  ]);

  // Get top product names
  const productIds = topProducts.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalCustomers,
    avgOrderValue: totalOrders > 0 ? (totalRevenue._sum.total ?? 0) / totalOrders : 0,
    revenueByDay: revenueByDay.map((d) => ({
      date: d.createdAt.toISOString().split("T")[0],
      revenue: d._sum.total ?? 0,
    })),
    topProducts: topProducts.map((p) => ({
      id: p.productId,
      name: productMap[p.productId] ?? "Unknown",
      revenue: p._sum.total ?? 0,
      quantity: p._sum.quantity ?? 0,
    })),
    ordersByStatus: ordersByStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    recentOrders,
  };
}

// ─────────────────────────────────────────────────
// PRODUCT VARIANT ACTIONS
// ─────────────────────────────────────────────────
const VariantSchema = z.object({
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().min(0),
  salePrice: z.number().optional().nullable(),
  costPrice: z.number().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  image: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function createProductVariant(
  productId: string,
  data: z.infer<typeof VariantSchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = VariantSchema.parse(data);
    const variant = await prisma.productVariant.create({
      data: { productId, ...parsed, inStock: parsed.stock > 0 },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "CREATE_PRODUCT_VARIANT",
        entity: "ProductVariant",
        entityId: variant.id,
        details: JSON.stringify({ productId }),
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true, data: variant };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateProductVariant(
  id: string,
  data: z.infer<typeof VariantSchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = VariantSchema.parse(data);
    const variant = await prisma.productVariant.update({
      where: { id },
      data: { ...parsed, inStock: parsed.stock > 0 },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_PRODUCT_VARIANT",
        entity: "ProductVariant",
        entityId: id,
      },
    });
    revalidatePath(`/admin/products/${variant.productId}/edit`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteProductVariant(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const variant = await prisma.productVariant.findUnique({ where: { id } });
    await prisma.productVariant.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "DELETE_PRODUCT_VARIANT",
        entity: "ProductVariant",
        entityId: id,
        details: JSON.stringify({ productId: variant?.productId }),
      },
    });
    if (variant?.productId) revalidatePath(`/admin/products/${variant.productId}/edit`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────
// ADMIN USER MANAGEMENT
// ─────────────────────────────────────────────────
export async function getAdminUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: {
      role: { in: ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateAdminUserRole(
  id: string,
  role: string
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    // Super Admin can set any role; Admin can only set up to MANAGER
    const myRole = (session.user as any).role;
    if (myRole !== "SUPER_ADMIN" && (role === "SUPER_ADMIN" || role === "ADMIN")) {
      return { success: false, error: "Insufficient permissions to set this role." };
    }
    await prisma.user.update({ where: { id }, data: { role } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_ADMIN_ROLE",
        entity: "User",
        entityId: id,
        details: JSON.stringify({ role }),
      },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteAdminUser(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const myId = (session.user as any).id;
    if (myId === id) return { success: false, error: "Cannot delete your own account." };
    await prisma.user.update({ where: { id }, data: { role: "USER" } });
    await prisma.auditLog.create({
      data: {
        userId: myId,
        action: "DEMOTE_ADMIN_USER",
        entity: "User",
        entityId: id,
      },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

