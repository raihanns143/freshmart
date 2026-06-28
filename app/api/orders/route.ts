import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// GET user orders (Protected)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: { take: 1 } }
            }
          }
        }
      }
    });

    const total = await prisma.order.count({
      where: { userId: session.user.id }
    });

    return NextResponse.json({
      data: orders,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST create new order (Protected)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, couponCode } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Generate unique order number (e.g. ORD-12345ABC)
    const orderNumber = `ORD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // Calculate totals securely on the server
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      // Validate product exists and price is correct
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || !product.inStock) {
        return NextResponse.json(
          { error: `Product ${item.productId} is unavailable` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        name: product.name,
        image: product.images?.[0]?.url || null,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Apply Coupon Logic
    let couponDiscount = 0;
    let validCouponId = null;
    
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && subtotal >= coupon.minOrderAmount) {
        if (coupon.type === "FIXED") couponDiscount = coupon.value;
        if (coupon.type === "PERCENTAGE") couponDiscount = subtotal * (coupon.value / 100);
        validCouponId = coupon.id;
      }
    }

    const tax = subtotal * 0.08; // Example 8% tax
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal - couponDiscount + tax + shipping;

    // Create Order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          subtotal,
          discount: couponDiscount,
          shipping,
          tax,
          total,
          couponId: validCouponId,
          couponDiscount,
          status: "PENDING",
          paymentStatus: "PENDING",
          shippingName: shippingAddress.name,
          shippingAddress: shippingAddress.line1,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingZip: shippingAddress.zip,
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      // 2. Decrement Inventory
      for (const item of orderItemsData) {
        const inv = await tx.inventory.findFirst({
          where: { productId: item.productId },
          orderBy: { createdAt: "desc" }
        });
        
        await tx.inventory.create({
          data: {
            productId: item.productId,
            quantity: (inv?.quantity || 0) - item.quantity,
            type: "SALE",
            reason: `Order ${orderNumber}`
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json({ data: order }, { status: 201 });

  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create order", details: error.message }, { status: 500 });
  }
}
