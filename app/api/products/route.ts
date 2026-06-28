import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const limit = parseInt(searchParams.get("limit") || "12");
    const cursor = searchParams.get("cursor"); // For cursor-based pagination
    const page = parseInt(searchParams.get("page") || "1"); // For offset-based fallback
    
    // Filter parameters
    const q = searchParams.get("q"); // Keyword search
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");
    
    // Sort parameters
    const sort = searchParams.get("sort") || "newest"; // newest, price_asc, price_desc, rating
    
    // Construct Prisma where clause
    const where: any = {};
    
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (brand) {
      where.brand = { slug: brand };
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    if (inStock === 'true') {
      where.inStock = true;
    }
    
    // Construct Prisma orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
        orderBy = { soldCount: 'desc' };
        break;
    }
    
    // Execute query with cursor or offset
    const queryArgs: any = {
      where,
      orderBy,
      take: limit + 1, // Fetch one extra to determine if there's a next page
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        images: { orderBy: { order: 'asc' } }
      }
    };
    
    if (cursor) {
      queryArgs.cursor = { id: cursor };
      queryArgs.skip = 1; // Skip the cursor itself
    } else if (page > 1) {
      queryArgs.skip = (page - 1) * limit;
    }
    
    const products = await prisma.product.findMany(queryArgs);
    
    // Determine pagination state
    let nextCursor = null;
    if (products.length > limit) {
      const nextItem = products.pop();
      nextCursor = nextItem?.id;
    }
    
    // Optional: Get total count for metadata if using offset pagination
    let totalCount = null;
    if (!cursor) {
      totalCount = await prisma.product.count({ where });
    }

    return NextResponse.json({
      data: products,
      meta: {
        nextCursor,
        totalCount,
        hasMore: nextCursor !== null
      }
    });
    
  } catch (error: any) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}
