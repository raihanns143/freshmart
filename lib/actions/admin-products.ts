"use server";

import { auth } from "@/auth";
import { logActivity } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import type { ActionResult } from "@/types/admin";

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
        tags: Array.isArray(data.tags) ? data.tags.join(",") : (data.tags || ""),
        
        // Variants
        variants: {
          create: data.variants.map((v: any) => ({
            sku: v.sku || null,
            barcode: v.barcode || null,
            size: v.size,
            color: v.color,
            weight: v.weight ? parseFloat(v.weight) : null,
            price: parseFloat(v.price),
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            stock: parseInt(v.stock),
            inStock: parseInt(v.stock) > 0,
            image: v.image || null,
            isActive: v.isActive ?? true,
          }))
        },

        // Images
        ...(data.variants[0]?.image ? {
          images: {
            create: [{ url: data.variants[0].image, isMain: true, order: 0 }]
          }
        } : {}),

        // Legacy compatibility fields if they are required by Prisma Schema
        price: parseFloat(data.variants[0]?.price || 0),
        originalPrice: null,
        stock: parseInt(data.variants[0]?.stock || 0),
        inStock: parseInt(data.variants[0]?.stock || 0) > 0,
      }
    });

    // Audit log — best-effort, never crash on FK issues
    await safeAuditLog({
          userId: (session.user as any).id,
          action: "CREATE_PRODUCT",
          entity: "Product",
          entityId: product.id,
          details: JSON.stringify({ name: product.name }),
        });

    revalidatePath(`/product/${product.slug}`, "page");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidateTag("products", "default" as any);
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
        tags: Array.isArray(data.tags) ? data.tags.join(",") : (data.tags || ""),

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
        // Only include image in the update if it's non-empty — prevents wiping existing images
        const variantImageUpdate = v.image ? { image: v.image } : {};
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            sku: v.sku || null,
            barcode: v.barcode || null,
            size: v.size,
            color: v.color,
            weight: v.weight ? parseFloat(v.weight) : null,
            price: parseFloat(v.price),
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            stock: parseInt(v.stock),
            inStock: parseInt(v.stock) > 0,
            isActive: v.isActive ?? true,
            ...variantImageUpdate,
          }
        });
      } else {
        await prisma.productVariant.create({
          data: {
            productId: id,
            sku: v.sku || null,
            barcode: v.barcode || null,
            size: v.size,
            color: v.color,
            weight: v.weight ? parseFloat(v.weight) : null,
            price: parseFloat(v.price),
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            stock: parseInt(v.stock),
            inStock: parseInt(v.stock) > 0,
            image: v.image || null,
            isActive: v.isActive ?? true,
          }
        });
      }
    }

    // Sync ProductImage with variant's image
    const mainImageUrl = data.variants[0]?.image;
    if (mainImageUrl) {
      const existingImages = await prisma.productImage.findMany({
        where: { productId: id },
        orderBy: { order: "asc" }
      });
      
      const mainImage = existingImages.find((img: any) => img.isMain) || existingImages[0];
      
      if (mainImage) {
        if (mainImage.url !== mainImageUrl) {
          await prisma.productImage.update({
            where: { id: mainImage.id },
            data: { url: mainImageUrl, isMain: true }
          });
        }
      } else {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: mainImageUrl,
            isMain: true,
            order: 0
          }
        });
      }
    }

    // Audit log — best-effort, never crash on FK issues
    await safeAuditLog({
          userId: (session.user as any).id,
          action: "UPDATE_PRODUCT",
          entity: "Product",
          entityId: id,
        });

    revalidatePath(`/product/${data.slug}`, "page");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidateTag("products", "default" as any);
    revalidateTag(`product-${id}`, "default" as any);
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

    const product = await prisma.product.findUnique({ where: { id }, select: { slug: true, category: { select: { slug: true } } } });
    await prisma.product.delete({ where: { id } });

    // Audit log — best-effort
    await safeAuditLog({
          userId: (session.user as any).id,
          action: "DELETE_PRODUCT",
          entity: "Product",
          entityId: id,
        });
    if (product) {
      revalidatePath(`/product/${product.slug}`, "page");
    }
    revalidatePath("/shop");
    revalidatePath("/");
    revalidateTag("products", "default" as any);
    revalidateTag(`product-${id}`, "default" as any);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateDisplayOrder(id: string, displayOrder: number): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    await prisma.product.update({
      where: { id },
      data: { displayOrder },
    });
    
    // Audit log — best-effort
    await safeAuditLog({
          userId: (session.user as any).id,
          action: "UPDATE_DISPLAY_ORDER",
          entity: "Product",
          entityId: id,
          details: JSON.stringify({ displayOrder }),
        },);

    revalidatePath("/admin/products");
    revalidatePath("/");
    
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

