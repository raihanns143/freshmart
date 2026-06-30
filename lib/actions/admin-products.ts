"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/admin";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const role = (session.user as any).role;
  if (!ADMIN_ROLES.includes(role)) throw new Error("Forbidden");
  return session;
}

export async function createProduct(data: any): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    // Validate required fields
    if (!data.name || !data.slug || !data.categoryId) {
      return { success: false, error: "Missing required fields" };
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        unit: data.unit || "piece",
        isFeatured: data.isFeatured || false,
        isActive: data.isActive ?? true,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        tags: data.tags || [],
        
        // Variants
        variants: {
          create: data.variants.map((v: any) => ({
            sku: v.sku,
            barcode: v.barcode,
            size: v.size,
            color: v.color,
            weight: v.weight ? parseFloat(v.weight) : null,
            price: parseFloat(v.price),
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            stock: parseInt(v.stock),
            inStock: parseInt(v.stock) > 0,
            image: v.image,
            isActive: v.isActive ?? true,
          }))
        },

        // Legacy compatibility fields if they are required by Prisma Schema
        price: parseFloat(data.variants[0]?.price || 0),
        originalPrice: null,
        stock: parseInt(data.variants[0]?.stock || 0),
        inStock: parseInt(data.variants[0]?.stock || 0) > 0,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "CREATE_PRODUCT",
        entity: "Product",
        entityId: product.id,
        details: JSON.stringify({ name: product.name }),
      }
    });

    revalidatePath("/admin/products");
    return { success: true, data: product };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateProduct(id: string, data: any): Promise<ActionResult> {
  try {
    const session = await requireAdmin();

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        unit: data.unit || "piece",
        isFeatured: data.isFeatured || false,
        isActive: data.isActive ?? true,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        tags: data.tags || [],

        // Update basic legacy fields just in case
        price: parseFloat(data.variants[0]?.price || 0),
        stock: parseInt(data.variants[0]?.stock || 0),
        inStock: parseInt(data.variants[0]?.stock || 0) > 0,
      }
    });

    // Handle Variants: 
    // Delete variants that are not in the payload
    const incomingVariantIds = data.variants.map((v: any) => v.id).filter(Boolean);
    
    await prisma.productVariant.deleteMany({
      where: {
        productId: id,
        id: { notIn: incomingVariantIds }
      }
    });

    // Upsert remaining variants
    for (const v of data.variants) {
      if (v.id) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            sku: v.sku,
            barcode: v.barcode,
            size: v.size,
            color: v.color,
            weight: v.weight ? parseFloat(v.weight) : null,
            price: parseFloat(v.price),
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            stock: parseInt(v.stock),
            inStock: parseInt(v.stock) > 0,
            image: v.image,
            isActive: v.isActive ?? true,
          }
        });
      } else {
        await prisma.productVariant.create({
          data: {
            productId: id,
            sku: v.sku,
            barcode: v.barcode,
            size: v.size,
            color: v.color,
            weight: v.weight ? parseFloat(v.weight) : null,
            price: parseFloat(v.price),
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            stock: parseInt(v.stock),
            inStock: parseInt(v.stock) > 0,
            image: v.image,
            isActive: v.isActive ?? true,
          }
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_PRODUCT",
        entity: "Product",
        entityId: id,
      }
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    // Verify product exists and constraints
    const orderCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) return { success: false, error: "Cannot delete product with existing orders. Disable it instead." };

    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "DELETE_PRODUCT",
        entity: "Product",
        entityId: id,
      }
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
