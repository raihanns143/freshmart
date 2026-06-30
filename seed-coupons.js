const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Upsert WELCOME20 coupon
  const coupon = await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      description: '20% off your first order',
      type: 'PERCENTAGE',
      value: 20,
      minOrderAmount: 10,
      maxUses: 1000,
      isActive: true,
      expiresAt: new Date('2027-12-31'),
    },
  });
  console.log('Coupon created/updated:', coupon);

  // Also seed SAVE10 as a fixed discount
  const coupon2 = await prisma.coupon.upsert({
    where: { code: 'SAVE10' },
    update: {},
    create: {
      code: 'SAVE10',
      description: '$10 off orders over $50',
      type: 'FIXED',
      value: 10,
      minOrderAmount: 50,
      maxUses: 500,
      isActive: true,
      expiresAt: new Date('2027-12-31'),
    },
  });
  console.log('Coupon created/updated:', coupon2);
}

main().catch(console.error).finally(() => prisma.$disconnect());
