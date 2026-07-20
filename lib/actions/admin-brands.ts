import { logActivity } from "@/lib/logger";
"use server";

import { auth } from "@/auth";

async function safeAuditLog(data: any) {
  const session = await auth();
  await logActivity({
    userId: data.userId || (session?.user as any)?.id,
    role: (session?.user as any)?.role || "ADMIN",
    action: data.action,
    entityType: data.entity,
    entityId: data.entityId,
    details: data.details,
    status: "SUCCESS"
  });
}

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

const BrandSchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  logo: z.string().optional().nullable(),
});

export async function createBrand(
  data: z.infer<typeof BrandSchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = BrandSchema.parse(data);
    const brand = await prisma.brand.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
        logo: parsed.logo,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "CREATE_BRAND",
        entity: "Brand",
        entityId: brand.id,
        details: JSON.stringify({ name: parsed.name }),
      },
    });
    revalidatePath("/admin/brands");
    revalidatePath("/brands");
    return { success: true, data: brand };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateBrand(
  id: string,
  data: z.infer<typeof BrandSchema>
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const parsed = BrandSchema.parse(data);
    await prisma.brand.update({
      where: { id },
      data: {
        name: parsed.name,
        slug: parsed.slug,
        logo: parsed.logo,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_BRAND",
        entity: "Brand",
        entityId: id,
        details: JSON.stringify({ name: parsed.name }),
      },
    });
    revalidatePath("/admin/brands");
    revalidatePath("/brands");
    revalidatePath(`/brand/${parsed.slug}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteBrand(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const hasProducts = await prisma.product.count({ where: { brandId: id } });
    if (hasProducts > 0) {
      return {
        success: false,
        error: `Cannot delete: ${hasProducts} products are associated with this brand.`,
      };
    }
    const brand = await prisma.brand.findUnique({ where: { id } });
    await prisma.brand.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "DELETE_BRAND",
        entity: "Brand",
        entityId: id,
      },
    });
    revalidatePath("/admin/brands");
    revalidatePath("/brands");
    if (brand) revalidatePath(`/brand/${brand.slug}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
