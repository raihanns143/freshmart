import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function main() {
  console.log("Fixing product slugs and adding missing images...");

  // Fix products with bad slugs
  const products = await prisma.product.findMany({
    include: { images: true },
  });

  for (const product of products) {
    const fixes: Record<string, any> = {};

    // Check slug
    const hasSpaces = /\s/.test(product.slug);
    const hasUppercase = /[A-Z]/.test(product.slug);
    const hasSpecialChars = /[^a-z0-9-]/.test(product.slug);

    if (hasSpaces || hasUppercase || hasSpecialChars) {
      let newSlug = toSlug(product.slug);
      let slugExists = await prisma.product.findFirst({
        where: { slug: newSlug, id: { not: product.id } },
      });
      let attempt = 0;
      while (slugExists) {
        attempt++;
        newSlug = `${toSlug(product.slug)}-${attempt}`;
        slugExists = await prisma.product.findFirst({
          where: { slug: newSlug, id: { not: product.id } },
        });
      }
      fixes.slug = newSlug;
      console.log(`  Fixing slug: "${product.slug}" → "${newSlug}"`);
    }

    // If product has no images, add a placeholder from Unsplash based on name/category
    if (product.images.length === 0) {
      const imageMap: Record<string, string> = {
        "dates": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&q=80",
        "test": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
        "default": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
      };

      const nameLower = product.name.toLowerCase();
      let imageUrl = imageMap.default;
      for (const [key, url] of Object.entries(imageMap)) {
        if (nameLower.includes(key)) {
          imageUrl = url;
          break;
        }
      }

      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          isMain: true,
          order: 0,
        },
      });
      console.log(`  Added image to: "${product.name}"`);
    }

    if (Object.keys(fixes).length > 0) {
      await prisma.product.update({ where: { id: product.id }, data: fixes });
    }
  }

  console.log("\nAdding more products to fill all categories...");

  // Get existing category IDs
  const categories = await prisma.category.findMany();
  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    catMap[cat.slug] = cat.id;
  }

  // Get brand IDs
  const brands = await prisma.brand.findMany();
  const brandMap: Record<string, string> = {};
  for (const brand of brands) {
    brandMap[brand.slug] = brand.id;
  }

  const localFarmsId = brandMap["local-farms"];
  const happyCowsId = brandMap["happy-cows"];

  const newProducts = [
    // Fresh Produce
    {
      name: "Red Apples 6-pack", slug: "red-apples-6-pack",
      categorySlug: "fresh-produce",
      price: 4.99, originalPrice: 5.99,
      unit: "6 pack", rating: 4.7, reviewCount: 89, badge: "Fresh", badgeColor: "green",
      inStock: true, stock: 45, isFeatured: true,
      shortDesc: "Crispy, sweet red apples perfect for snacking",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80",
    },
    {
      name: "Baby Spinach 200g", slug: "baby-spinach-200g",
      categorySlug: "fresh-produce",
      price: 3.49, unit: "200g bag", rating: 4.6, reviewCount: 54,
      inStock: true, stock: 30,
      shortDesc: "Tender baby spinach leaves, triple-washed and ready to eat",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80",
    },
    {
      name: "Mixed Salad Leaves", slug: "mixed-salad-leaves",
      categorySlug: "fresh-produce",
      price: 2.99, unit: "150g", rating: 4.5, reviewCount: 41,
      inStock: true, stock: 25,
      shortDesc: "A vibrant mix of tender salad leaves for fresh salads",
      image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&q=80",
    },
    {
      name: "Strawberries 400g", slug: "strawberries-400g",
      categorySlug: "fresh-produce",
      price: 4.49, originalPrice: 5.29,
      unit: "400g punnet", rating: 4.9, reviewCount: 201, badge: "Sale", badgeColor: "red",
      inStock: true, stock: 20, isBestSeller: true,
      shortDesc: "Sweet, juicy strawberries picked at peak ripeness",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80",
    },
    // Dairy & Eggs
    {
      name: "Cheddar Cheese 200g", slug: "cheddar-cheese-200g",
      categorySlug: "dairy-eggs",
      price: 5.49, unit: "200g block", rating: 4.7, reviewCount: 88,
      inStock: true, stock: 35,
      shortDesc: "Mature cheddar cheese with a rich, sharp flavor",
      image: "https://onthepigsback.ie/cdn/shop/products/HegartyCheese-2_720x.jpg?v=1606890697",
    },
    {
      name: "Greek Yogurt 500g", slug: "greek-yogurt-500g",
      categorySlug: "dairy-eggs",
      price: 5.99, originalPrice: 6.99,
      unit: "500g tub", rating: 4.9, reviewCount: 203,
      inStock: true, stock: 40,
      shortDesc: "Thick, creamy Greek-style yogurt, high in protein",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80",
    },
    {
      name: "Butter Unsalted 250g", slug: "butter-unsalted-250g",
      categorySlug: "dairy-eggs",
      price: 3.79, unit: "250g block", rating: 4.6, reviewCount: 62,
      inStock: true, stock: 50,
      shortDesc: "Pure unsalted butter from grass-fed cows",
      image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80",
    },
    // Meat & Seafood
    {
      name: "Salmon Fillet 250g", slug: "salmon-fillet-250g",
      categorySlug: "meat-seafood",
      price: 12.99, originalPrice: 14.99,
      unit: "250g", rating: 4.8, reviewCount: 134, badge: "Fresh", badgeColor: "blue",
      inStock: true, stock: 20, isFeatured: true,
      shortDesc: "Premium Atlantic salmon fillet, rich in Omega-3",
      image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80",
    },
    {
      name: "Ground Beef 500g", slug: "ground-beef-500g",
      categorySlug: "meat-seafood",
      price: 9.99, unit: "500g", rating: 4.6, reviewCount: 97,
      inStock: true, stock: 25,
      shortDesc: "Premium lean ground beef, 80/20 blend",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&q=80",
    },
    // Bakery
    {
      name: "Whole Wheat Bread", slug: "whole-wheat-bread",
      categorySlug: "bakery",
      price: 3.99, unit: "700g loaf", rating: 4.5, reviewCount: 73,
      inStock: true, stock: 30,
      shortDesc: "Nutritious whole wheat bread with a wholesome taste",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80",
    },
    {
      name: "Croissants 4-pack", slug: "croissants-4-pack",
      categorySlug: "bakery",
      price: 4.49, originalPrice: 5.49,
      unit: "4 pack", rating: 4.7, reviewCount: 156, badge: "Fresh", badgeColor: "green",
      inStock: true, stock: 20, isBestSeller: true,
      shortDesc: "Buttery, flaky croissants baked fresh every morning",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80",
    },
    // Beverages
    {
      name: "Orange Juice 1L", slug: "orange-juice-1l",
      categorySlug: "beverages",
      price: 4.29, unit: "1 litre", rating: 4.6, reviewCount: 88,
      inStock: true, stock: 40, isFeatured: true,
      shortDesc: "100% pure squeezed orange juice, no added sugar",
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80",
    },
    {
      name: "Almond Milk 1L", slug: "almond-milk-1l",
      categorySlug: "beverages",
      price: 3.49, unit: "1 litre", rating: 4.4, reviewCount: 56,
      inStock: true, stock: 35,
      shortDesc: "Creamy unsweetened almond milk, dairy-free",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80",
    },
    {
      name: "Sparkling Water 6-pack", slug: "sparkling-water-6-pack",
      categorySlug: "beverages",
      price: 5.99, unit: "6 x 500ml", rating: 4.3, reviewCount: 44,
      inStock: true, stock: 50,
      shortDesc: "Refreshing natural mineral sparkling water",
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&q=80",
    },
    // Snacks
    {
      name: "Mixed Nuts 250g", slug: "mixed-nuts-250g",
      categorySlug: "snacks",
      price: 7.99, originalPrice: 9.99,
      unit: "250g bag", rating: 4.8, reviewCount: 178, badge: "Sale", badgeColor: "red",
      inStock: true, stock: 30, isBestSeller: true,
      shortDesc: "A premium blend of cashews, almonds, walnuts, and more",
      image: "https://adelaidefresh.com.au/cdn/shop/products/9F938E35-D2A2-4754-8DEA-0537B5C77D6C_720x.jpg?v=1585472902",
    },
    {
      name: "Hummus & Veggie Dip", slug: "hummus-veggie-dip",
      categorySlug: "snacks",
      price: 3.99, unit: "300g tub", rating: 4.5, reviewCount: 61,
      inStock: true, stock: 25,
      shortDesc: "Smooth, creamy hummus made from chickpeas and tahini",
      image: "https://soupaddict.com/wp-content/uploads/2023/12/layered-veggies-hummus-dip-5055-top-960x720.jpg",
    },
    // Frozen Foods
    {
      name: "Frozen Peas 1kg", slug: "frozen-peas-1kg",
      categorySlug: "frozen-foods",
      price: 2.49, unit: "1kg bag", rating: 4.3, reviewCount: 38,
      inStock: true, stock: 60,
      shortDesc: "Sweet garden peas frozen at peak freshness",
      image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&q=80",
    },
    {
      name: "Frozen Pizza Margherita", slug: "frozen-pizza-margherita",
      categorySlug: "frozen-foods",
      price: 6.49, originalPrice: 7.99,
      unit: "400g", rating: 4.2, reviewCount: 92, badge: "Sale", badgeColor: "red",
      inStock: true, stock: 30,
      shortDesc: "Classic Margherita pizza with mozzarella and tomato",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
    },
  ];

  for (const p of newProducts) {
    const catId = catMap[p.categorySlug];
    if (!catId) {
      console.log(`  ⚠️ Category not found: ${p.categorySlug}`);
      continue;
    }

    // Check if product already exists by slug
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`  Skipping existing: ${p.slug}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        categoryId: catId,
        brandId: localFarmsId || null,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        unit: p.unit,
        rating: p.rating,
        reviewCount: p.reviewCount,
        badge: (p as any).badge ?? null,
        badgeColor: (p as any).badgeColor ?? null,
        inStock: p.inStock,
        stock: p.stock,
        isFeatured: (p as any).isFeatured ?? false,
        isBestSeller: (p as any).isBestSeller ?? false,
        shortDesc: (p as any).shortDesc ?? null,
        isActive: true,
        images: {
          create: [{ url: p.image, isMain: true, order: 0 }],
        },
      },
    });
    console.log(`  ✅ Created: ${p.name}`);
  }

  console.log("\n✅ Database patched successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
