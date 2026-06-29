import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing data (in reverse order of dependencies)
  await prisma.auditLog.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@freshmart.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created.");

  // 3. Create Settings
  await prisma.setting.createMany({
    data: [
      { key: "SITE_NAME", value: "FreshMart Pro", isPublic: true },
      { key: "CURRENCY", value: "USD", isPublic: true },
      { key: "TAX_RATE", value: "0.08", isPublic: true },
      { key: "FREE_SHIPPING_THRESHOLD", value: "50", isPublic: true },
    ],
  });
  console.log("Settings created.");

  // 4. Create Categories
  const categoriesData = [
    { name: "Fresh Produce", slug: "fresh-produce", color: "bg-green-500" },
    { name: "Dairy & Eggs", slug: "dairy-eggs", color: "bg-yellow-500" },
    { name: "Meat & Seafood", slug: "meat-seafood", color: "bg-red-500" },
    { name: "Bakery", slug: "bakery", color: "bg-orange-500" },
    { name: "Frozen Foods", slug: "frozen-foods", color: "bg-blue-500" },
    { name: "Beverages", slug: "beverages", color: "bg-purple-500" },
    { name: "Snacks", slug: "snacks", color: "bg-pink-500" },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({
      data: cat,
    });
  }
  console.log("Categories created.");

  // 5. Create Brands
  const farmBrand = await prisma.brand.create({
    data: { name: "Local Farms", slug: "local-farms" },
  });
  const dairyBrand = await prisma.brand.create({
    data: { name: "Happy Cows Dairy", slug: "happy-cows" },
  });
  console.log("Brands created.");

  // 6. Create Products
  const productsData = [
    {
      name: "Organic Bananas",
      slug: "organic-bananas",
      categoryId: categories["fresh-produce"].id,
      brandId: farmBrand.id,
      price: 2.99,
      originalPrice: 3.49,
      unit: "bunch",
      rating: 4.8,
      reviewCount: 124,
      badge: "Organic",
      badgeColor: "green",
      inStock: true,
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80", isMain: true }]
      }
    },
    {
      name: "Fresh Milk 1L",
      slug: "fresh-milk-1l",
      categoryId: categories["dairy-eggs"].id,
      brandId: dairyBrand.id,
      price: 3.29,
      originalPrice: null,
      unit: "1 litre",
      rating: 4.9,
      reviewCount: 89,
      badge: "Fresh",
      badgeColor: "blue",
      inStock: true,
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80", isMain: true }]
      }
    },
    {
      name: "Sourdough Bread",
      slug: "sourdough-bread",
      categoryId: categories["bakery"].id,
      price: 4.99,
      originalPrice: 5.99,
      unit: "800g loaf",
      rating: 4.7,
      reviewCount: 67,
      badge: "Sale",
      badgeColor: "red",
      inStock: true,
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", isMain: true }]
      }
    },
    {
      name: "Free Range Eggs",
      slug: "free-range-eggs",
      categoryId: categories["dairy-eggs"].id,
      brandId: farmBrand.id,
      price: 4.49,
      originalPrice: null,
      unit: "12 pack",
      rating: 4.8,
      reviewCount: 156,
      badge: "Free Range",
      badgeColor: "blue",
      inStock: true,
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=500&q=80", isMain: true }]
      }
    },
    {
      name: "Cherry Tomatoes",
      slug: "cherry-tomatoes",
      categoryId: categories["fresh-produce"].id,
      brandId: farmBrand.id,
      price: 3.79,
      originalPrice: null,
      unit: "400g punnet",
      rating: 4.6,
      reviewCount: 92,
      inStock: true,
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&q=80", isMain: true }]
      }
    },
    {
      name: "Greek Yogurt",
      slug: "greek-yogurt",
      categoryId: categories["dairy-eggs"].id,
      brandId: dairyBrand.id,
      price: 5.99,
      originalPrice: 6.99,
      unit: "500g tub",
      rating: 4.9,
      reviewCount: 203,
      inStock: true,
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80", isMain: true }]
      }
    },
    {
      name: "Avocados (4 pack)",
      slug: "avocados-4-pack",
      categoryId: categories["fresh-produce"].id,
      brandId: farmBrand.id,
      price: 6.99,
      originalPrice: null,
      unit: "4 pack",
      rating: 4.5,
      reviewCount: 78,
      inStock: false, // Out of stock example
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=500&q=80", isMain: true }]
      }
    },
    {
      name: "Chicken Breast",
      slug: "chicken-breast",
      categoryId: categories["meat-seafood"].id,
      price: 8.99,
      originalPrice: null,
      unit: "500g",
      rating: 4.7,
      reviewCount: 184,
      inStock: true,
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1604503468506-a8da13d11b36?w=500&q=80", isMain: true }]
      }
    },
  ];

  for (const prod of productsData) {
    const createdProduct = await prisma.product.create({
      data: prod,
    });

    // 7. Initialize Inventory for each product
    await prisma.inventory.create({
      data: {
        productId: createdProduct.id,
        quantity: createdProduct.inStock ? 50 : 0,
        type: "RESTOCK",
        reason: "Initial Stock Setup",
      },
    });
  }

  console.log("Products and Inventory created.");
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
