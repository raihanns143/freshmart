import { PrismaClient } from "@prisma/client";
import { resolve } from "path";

const prisma = new PrismaClient();

const LOCAL_BRANDS = [
  { name: "PRAN", slug: "pran", logo: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { name: "Fresh", slug: "fresh", logo: "https://images.unsplash.com/photo-1588610543661-00e9de5e1de7?w=400&q=80" },
  { name: "Teer", slug: "teer", logo: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80" },
  { name: "Radhuni", slug: "radhuni", logo: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80" },
  { name: "ACI", slug: "aci", logo: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80" },
  { name: "Bombay Sweets", slug: "bombay-sweets", logo: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80" },
  { name: "Milk Vita", slug: "milk-vita", logo: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80" },
  { name: "Polar", slug: "polar", logo: "https://images.unsplash.com/photo-1574722772633-e401c33eb317?w=400&q=80" },
  { name: "Aarong Dairy", slug: "aarong-dairy", logo: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80" },
  { name: "Shwapno", slug: "shwapno", logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" },
];

const LOCAL_CATEGORIES = [
  { name: "Fresh Vegetables", slug: "fresh-vegetables", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80" },
  { name: "Fresh Fruits", slug: "fresh-fruits", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { name: "Fish", slug: "fish", image: "https://images.unsplash.com/photo-1611171711910-38812f275e03?w=400&q=80" },
  { name: "Meat", slug: "meat", image: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400&q=80" },
  { name: "Rice & Staples", slug: "rice-staples", image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&q=80" },
  { name: "Cooking Essentials", slug: "cooking-essentials", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80" },
  { name: "Tea & Coffee", slug: "tea-coffee", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80" },
  { name: "Spices", slug: "spices", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80" },
  { name: "Snacks", slug: "snacks", image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80" },
  { name: "Beverages", slug: "beverages", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { name: "Frozen Foods", slug: "frozen-foods", image: "https://images.unsplash.com/photo-1574722772633-e401c33eb317?w=400&q=80" },
  { name: "Dairy & Eggs", slug: "dairy-eggs", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80" },
  { name: "Bakery", slug: "bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
  { name: "Baby Care", slug: "baby-care", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80" },
  { name: "Household", slug: "household", image: "https://images.unsplash.com/photo-1588610543661-00e9de5e1de7?w=400&q=80" },
  { name: "Personal Care", slug: "personal-care", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80" },
  { name: "Health", slug: "health", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80" },
];

const LOCAL_PRODUCTS = [
  { name: "Fresh Hilsha (Ilish)", brandSlug: "shwapno", catSlug: "fish", price: 1200, img: "https://ibb.co.com/PZgtjrrL" },
  { name: "Premium Miniket Rice 5kg", brandSlug: "fresh", catSlug: "rice-staples", price: 350, img: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=800&q=80" },
  { name: "Radhuni Roast Masala", brandSlug: "radhuni", catSlug: "spices", price: 65, img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80" },
  { name: "PRAN Mango Juice 1L", brandSlug: "pran", catSlug: "beverages", price: 180, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80" },
  { name: "Teer Soybean Oil 5L", brandSlug: "teer", catSlug: "cooking-essentials", price: 840, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80" },
  { name: "Aarong Pasteurized Milk", brandSlug: "aarong-dairy", catSlug: "dairy-eggs", price: 90, img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80" },
  { name: "Bombay Sweets Potato Crackers", brandSlug: "bombay-sweets", catSlug: "snacks", price: 15, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80" },
  { name: "Deshi Onion (Piyaj)", brandSlug: "shwapno", catSlug: "fresh-vegetables", price: 120, img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80" },
  { name: "Premium Beef (Bone-in)", brandSlug: "shwapno", catSlug: "meat", price: 780, img: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&q=80" },
  { name: "Rui Maach (Rohu)", brandSlug: "shwapno", catSlug: "fish", price: 450, img: "https://ibb.co.com/PZgtjrrL" },
];

const LOCAL_PROMOTIONS = [
  { code: "RAMADAN25", description: "Ramadan Grocery Sale", type: "PERCENTAGE", value: 15 },
  { code: "EIDSHOP", description: "Eid Shopping Festival", type: "FIXED", value: 500 },
  { code: "WINTERVEG", description: "Winter Vegetable Carnival", type: "PERCENTAGE", value: 20 },
];

const LOCAL_REVIEWS = [
  { name: "Rahim", text: "Excellent quality. Highly recommended.", rating: 5 },
  { name: "Karim", text: "Very fresh vegetables.", rating: 5 },
  { name: "Hasan", text: "Fresh Hilsha arrived quickly.", rating: 5 },
  { name: "Mahmud", text: "Packaging was excellent.", rating: 4 },
  { name: "Nusrat", text: "Delivery was very fast.", rating: 5 },
  { name: "Sadia", text: "Best grocery service.", rating: 5 },
];

async function main() {
  console.log("Starting Data Migration (Idempotent)...");

  // 1. Update or Create Brands
  for (const b of LOCAL_BRANDS) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, logo: b.logo },
      create: { name: b.name, slug: b.slug, logo: b.logo },
    });
  }

  // 2. Update or Create Categories
  for (const c of LOCAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, image: c.image },
      create: { name: c.name, slug: c.slug, image: c.image, color: "bg-blue-500" },
    });
  }

  // 3. Update or Create Products
  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();

  for (const p of LOCAL_PRODUCTS) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const cat = categories.find(c => c.slug === p.catSlug);
    const brand = brands.find(b => b.slug === p.brandSlug);

    const product = await prisma.product.upsert({
      where: { slug },
      update: { name: p.name, price: p.price, categoryId: cat!.id, brandId: brand!.id },
      create: { 
        name: p.name, 
        slug, 
        price: p.price, 
        categoryId: cat!.id, 
        brandId: brand!.id, 
        unit: "piece" 
      },
    });

    // Update Images safely
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: { productId: product.id, url: p.img, isMain: true }
    });
  }

  // 4. Update Promotions (Coupons)
  await prisma.coupon.deleteMany(); // Reset coupons to local ones
  for (const promo of LOCAL_PROMOTIONS) {
    await prisma.coupon.create({
      data: promo,
    });
  }

  // 5. Update SEO Settings
  const seoSettings = [
    { key: "SITE_NAME", value: "Raihans Shop" },
    { key: "SEO_TITLE", value: "FreshMart - Premium Bangladeshi Grocery" },
    { key: "SEO_DESCRIPTION", value: "Shop online for fresh produce, dairy, meat, and everyday Bangladeshi essentials." },
    { key: "SEO_KEYWORDS", value: "grocery, bangladesh, fresh vegetables, fish, hilsha, miniket rice, dhaka grocery" },
    { key: "CURRENCY", value: "BDT" }
  ];

  for (const setting of seoSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value, isPublic: true },
    });
  }

  // 6. Seed some authentic reviews to products
  const products = await prisma.product.findMany({ take: 3 });
  const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  
  if (adminUser && products.length > 0) {
    await prisma.review.deleteMany(); // Clean old reviews
    for (let i = 0; i < LOCAL_REVIEWS.length; i++) {
      const review = LOCAL_REVIEWS[i];
      const product = products[i % products.length];
      
      const mockUser = await prisma.user.upsert({
        where: { email: `mock${i}@example.com` },
        update: { name: review.name },
        create: { name: review.name, email: `mock${i}@example.com` },
      });

      await prisma.review.create({
        data: {
          userId: mockUser.id,
          productId: product.id,
          rating: review.rating,
          title: "Great",
          comment: review.text,
          status: "APPROVED"
        }
      });
    }
  }
  
  // 7. Clean up orphaned demo products (optional but requested)
  // Get valid product slugs
  const validProductSlugs = LOCAL_PRODUCTS.map(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  
  // Find products that are NOT in the localized list
  const orphanedProducts = await prisma.product.findMany({
    where: {
      slug: { notIn: validProductSlugs }
    }
  });

  if (orphanedProducts.length > 0) {
    const orphanedIds = orphanedProducts.map(p => p.id);
    await prisma.productImage.deleteMany({ where: { productId: { in: orphanedIds } } });
    await prisma.inventory.deleteMany({ where: { productId: { in: orphanedIds } } });
    await prisma.product.deleteMany({ where: { id: { in: orphanedIds } } });
    console.log(`Deleted ${orphanedProducts.length} orphaned demo products.`);
  }

  console.log("Migration Complete! Localized data successfully inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
