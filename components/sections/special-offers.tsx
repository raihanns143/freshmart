import { prisma } from "@/lib/prisma";
import { SpecialOffersClient } from "./special-offers-client";

export async function SpecialOffers() {
  const now = new Date();

  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      code: true,
      description: true,
      type: true,
      value: true,
    },
  });

  if (coupons.length === 0) return null;

  return <SpecialOffersClient offers={coupons} />;
}
