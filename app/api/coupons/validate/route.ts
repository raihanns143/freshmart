import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (subtotal < coupon.minOrderAmount) {
      const setting = await prisma.setting.findUnique({ where: { key: "CURRENCY" } });
      const currency = setting?.value || "BDT";
      return NextResponse.json({
        error: `Minimum order of ${coupon.minOrderAmount.toFixed(2)} ${currency} required for this coupon`,
      }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = subtotal * (coupon.value / 100);
    } else if (coupon.type === "FIXED") {
      discount = Math.min(coupon.value, subtotal);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      discount: parseFloat(discount.toFixed(2)),
    });

  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
