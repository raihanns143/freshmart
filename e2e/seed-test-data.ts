/**
 * QA Test Seed Script
 * Inserts clean test data into the database for E2E testing.
 * Run: npx tsx e2e/seed-test-data.ts
 * Cleanup: npx tsx e2e/cleanup-test-data.ts
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  // Admin user
  const adminPass = await bcrypt.hash('AdminTest123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'qa-admin@freshmart-test.com' },
    update: {},
    create: {
      email: 'qa-admin@freshmart-test.com',
      name: 'QA Admin',
      password: adminPass,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // Test customer
  const custPass = await bcrypt.hash('CustomerTest123!', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'qa-customer@freshmart-test.com' },
    update: {},
    create: {
      email: 'qa-customer@freshmart-test.com',
      name: 'QA Customer',
      password: custPass,
      role: 'USER',
    },
  });
  console.log('✅ Customer user:', customer.email);

  // Test category
  const category = await prisma.category.upsert({
    where: { slug: 'qa-test-category' },
    update: {},
    create: {
      name: 'QA Test Category',
      slug: 'qa-test-category',
      description: 'Test category for QA',
    },
  });
  console.log('✅ Category:', category.name);

  // Test product
  const existing = await prisma.product.findUnique({ where: { slug: 'qa-test-product' } });
  let product: any;
  if (!existing) {
    product = await prisma.product.create({
      data: {
        name: 'QA Test Product',
        slug: 'qa-test-product',
        description: 'This is a test product for QA purposes',
        shortDesc: 'QA Test Product',
        price: 9.99,
        stock: 100,
        inStock: true,
        isActive: true,
        isFeatured: false,
        categoryId: category.id,
        unit: 'piece',
        variants: {
          create: [
            {
              sku: 'QA-SKU-001',
              size: 'Standard',
              color: 'Default',
              price: 9.99,
              salePrice: null,
              stock: 100,
              inStock: true,
              isActive: true,
            },
          ],
        },
      },
    });
    console.log('✅ Product:', product.name);
  } else {
    product = existing;
    console.log('✅ Product already exists:', product.name);
  }

  // Test coupon
  const coupon = await prisma.coupon.upsert({
    where: { code: 'QA-TEST-10' },
    update: {},
    create: {
      code: 'QA-TEST-10',
      description: 'QA test 10% off coupon',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 0,
      maxUses: 100,
      isActive: true,
    },
  });
  console.log('✅ Coupon:', coupon.code);

  console.log('\n✅ Test data seeded successfully!');
  console.log('\nCredentials:');
  console.log('  Admin:    qa-admin@freshmart-test.com / AdminTest123!');
  console.log('  Customer: qa-customer@freshmart-test.com / CustomerTest123!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
