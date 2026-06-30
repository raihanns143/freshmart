import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MediaLibraryManager } from "@/components/admin/media/MediaLibraryManager";

export const metadata: Metadata = { title: "Media Library" };
export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  // Fetch all unique product images
  const images = await prisma.productImage.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { id: true, name: true } } },
  });

  return <MediaLibraryManager initialImages={images as any} />;
}
