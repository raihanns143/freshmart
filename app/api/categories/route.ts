import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        _count: { select: { products: true } },
      },
    });

    const data = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
    }));

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Categories API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}
