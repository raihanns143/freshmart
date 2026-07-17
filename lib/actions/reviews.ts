"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "@/types/admin";

const CreateReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
});

export async function createReview(data: z.infer<typeof CreateReviewSchema>): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "You must be logged in to review." };
    const userId = (session.user as any).id;

    const parsed = CreateReviewSchema.parse(data);

    // 1. Verify that the user has purchased the product AND the order is DELIVERED
    const purchaseCount = await prisma.orderItem.count({
      where: {
        productId: parsed.productId,
        order: {
          userId,
          status: "DELIVERED",
        }
      }
    });

    if (purchaseCount === 0) {
      return { success: false, error: "You can only review products you have purchased and received." };
    }

    // 2. Prevent duplicate reviews (one per user per product)
    const existingReview = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId: parsed.productId } }
    });

    if (existingReview) {
      return { success: false, error: "You have already reviewed this product. You can edit your existing review instead." };
    }

    // 3. Create the review
    await prisma.review.create({
      data: {
        userId,
        productId: parsed.productId,
        rating: parsed.rating,
        title: parsed.title,
        comment: parsed.comment,
        status: "APPROVED", // Auto-approving for this demo, could be PENDING in real world
        verified: true, // They passed the purchase check
      }
    });

    // 4. Recalculate average rating for the product
    await updateProductRating(parsed.productId);

    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteUserReview(reviewId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return { success: false, error: "Review not found" };
    if (review.userId !== userId) return { success: false, error: "Forbidden" };

    await prisma.review.delete({ where: { id: reviewId } });
    await updateProductRating(review.productId);

    revalidatePath(`/product/[slug]`, "page");
    revalidatePath("/account/reviews");
    
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// Utility to recalculate product rating
async function updateProductRating(productId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: { id: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: aggregate._avg.rating || 0,
      reviewCount: aggregate._count.id || 0,
    }
  });
}
