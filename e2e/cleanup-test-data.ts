/**
 * QA Test Cleanup Script
 * Removes all test data created by seed-test-data.ts
 * Run: npx tsx e2e/cleanup-test-data.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up test data...');

  // Remove test orders
  await prisma.orderItem.deleteMany({
    where: { product: { slug: { startsWith: 'qa-' } } },
  });
  const deletedOrders = await prisma.order.deleteMany({
    where: { user: { email: { contains: 'freshmart-test.com' } } },
  });
  console.log(`✅ Deleted ${deletedOrders.count} test orders`);

  // Remove test products & variants
  await prisma.productVariant.deleteMany({
    where: { product: { slug: { startsWith: 'qa-' } } },
  });
  const deletedProducts = await prisma.product.deleteMany({
    where: { slug: { startsWith: 'qa-' } },
  });
  console.log(`✅ Deleted ${deletedProducts.count} test products`);

  // Remove test categories
  const deletedCategories = await prisma.category.deleteMany({
    where: { slug: { startsWith: 'qa-' } },
  });
  console.log(`✅ Deleted ${deletedCategories.count} test categories`);

  // Remove test coupons
  const deletedCoupons = await prisma.coupon.deleteMany({
    where: { code: { startsWith: 'QA-' } },
  });
  console.log(`✅ Deleted ${deletedCoupons.count} test coupons`);

  // Remove test users
  const deletedUsers = await prisma.user.deleteMany({
    where: { email: { contains: 'freshmart-test.com' } },
  });
  console.log(`✅ Deleted ${deletedUsers.count} test users`);

  // Remove QA audit logs
  await prisma.auditLog.deleteMany({
    where: { details: { contains: 'QA' } },
  });

  console.log('\n✅ Test data cleanup complete. Database is clean.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
