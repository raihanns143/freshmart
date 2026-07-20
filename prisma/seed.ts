const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting idempotent production seed for FreshMart Bangladesh...");

  // 1. Settings (Upsert)
  console.log("Seeding localized settings...");
  const defaultSettings = [
    { key: "SITE_NAME", value: "Raihans Shop", description: "Name of the website" },
    { key: "CONTACT_EMAIL", value: "support@raihans.shop", description: "Public contact email" },
    { key: "CONTACT_PHONE", value: "+880 1700 000000", description: "Public contact phone" },
    { key: "CURRENCY", value: "BDT", description: "Currency code (e.g. BDT)" },
    { key: "CURRENCY_SYMBOL", value: "৳", description: "Currency symbol for UI" },
    { key: "TAX_RATE", value: "5", description: "Tax rate percentage" },
    { key: "FREE_SHIPPING_THRESHOLD", value: "1000", description: "Order amount for free shipping" },
    { key: "SHIPPING_FEE", value: "60", description: "Standard shipping fee" },
    { key: "STORE_ADDRESS", value: "Rajshahi, Bangladesh", description: "Physical store address" },
    { key: "SEO_TITLE", value: "Raihans Shop | Online Grocery Store in Bangladesh", description: "Default SEO Title" },
    { key: "SEO_DESCRIPTION", value: "Shop fresh vegetables, fruits, fish, meat, rice, dairy products, snacks and daily essentials online from Raihans Shop. Fast delivery and Cash on Delivery available across Bangladesh.", description: "Default SEO Description" },
    { key: "SEO_KEYWORDS", value: "Raihans Shop,Online Grocery Bangladesh,Grocery Delivery Bangladesh", description: "Default SEO Keywords" },
    { key: "SEO_OG_IMAGE", value: "/logo.png", description: "OpenGraph Image" },
    { key: "SEO_TWITTER_IMAGE", value: "/logo.png", description: "Twitter Image" },
    { key: "GOOGLE_SITE_VERIFICATION", value: "", description: "Google Search Console Verification" },
    { key: "BING_SITE_VERIFICATION", value: "", description: "Bing Webmaster Verification" },
    { key: "YANDEX_SITE_VERIFICATION", value: "", description: "Yandex Webmaster Verification" },
    { key: "FACEBOOK_DOMAIN_VERIFICATION", value: "", description: "Facebook Domain Verification" },
    { key: "GOOGLE_ANALYTICS_ID", value: "", description: "Google Analytics Measurement ID (G-XXXX)" },
    { key: "GOOGLE_TAG_MANAGER_ID", value: "", description: "Google Tag Manager ID (GTM-XXXX)" },
    { key: "FACEBOOK_PIXEL_ID", value: "", description: "Facebook Pixel ID" },
    { key: "MICROSOFT_CLARITY_ID", value: "", description: "Microsoft Clarity Project ID" },
  ];
  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // 2. Currencies (Upsert)
  console.log("Seeding currencies...");
  const currencies = [
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", exchangeRate: 1, isDefault: true },
    { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 122, isDefault: false },
    { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 143, isDefault: false },
    { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 166, isDefault: false },
    { code: "INR", name: "Indian Rupee", symbol: "₹", exchangeRate: 1.42, isDefault: false },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", exchangeRate: 33.2, isDefault: false },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼", exchangeRate: 32.5, isDefault: false },
  ];
  for (const c of currencies) {
    await prisma.currency.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // 3. Admin User (Upsert)
  console.log("Creating/verifying admin user...");
  const adminEmail = "fresh-mart@gmail.com";
  const hashedAdminPassword = await bcrypt.hash("724426", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedAdminPassword, role: "SUPER_ADMIN" },
    create: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedAdminPassword,
      role: "SUPER_ADMIN",
    },
  });

  // 4. Coupons (Upsert)
  console.log("Seeding localized coupons...");
  const coupons = [
    { code: "RAMADAN20", description: "Ramadan Sale - 20% OFF", type: "PERCENTAGE", value: 20, minOrderAmount: 1000, maxUses: 100 },
    { code: "EID500", description: "Eid Offer - ৳500 OFF", type: "FIXED", value: 500, minOrderAmount: 3000, maxUses: 50 },
    { code: "FRESH100", description: "Winter Vegetable Festival - ৳100 OFF", type: "FIXED", value: 100, minOrderAmount: 500, maxUses: 200 },
  ];
  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: {
        ...coupon,
        isActive: true,
        startDate: new Date(),
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 12)), 
      }
    });
  }

  // Generate Base Data (Categories, Brands, Products) if missing.
  // The user requested preserving existing data, so we check if products exist.
  const existingProductsCount = await prisma.product.count();
  if (existingProductsCount === 0) {
    console.log("No products found, running base product seed...");
    // 5. Categories
    const categories = [
      { name: "Fresh Fish", slug: "fresh-fish", description: "Premium local fish" },
      { name: "Meat & Poultry", slug: "meat-poultry", description: "Fresh beef, mutton, and chicken" },
      { name: "Rice & Staples", slug: "rice-staples", description: "Premium quality rice and grains" },
      { name: "Cooking Essentials", slug: "cooking-essentials", description: "Oils, spices, and cooking needs" },
      { name: "Beverages", slug: "beverages", description: "Juice, soft drinks, and water" },
      { name: "Dairy & Eggs", slug: "dairy-eggs", description: "Fresh milk, butter, and eggs" },
      { name: "Snacks", slug: "snacks", description: "Chips, chanachur, and crackers" },
      { name: "Fresh Vegetables", slug: "fresh-vegetables", description: "Daily fresh local vegetables" },
      { name: "Fresh Fruits", slug: "fresh-fruits", description: "Seasonal and year-round fruits" },
    ];
    for (const c of categories) {
      await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    }

    // 6. Brands
    const brands = [
      { name: "PRAN", slug: "pran" },
      { name: "Fresh", slug: "fresh" },
      { name: "Radhuni", slug: "radhuni" },
      { name: "Teer", slug: "teer" },
      { name: "ACI", slug: "aci" },
      { name: "Milk Vita", slug: "milk-vita" },
      { name: "Polar", slug: "polar" },
      { name: "Bombay Sweets", slug: "bombay-sweets" },
      { name: "Aarong Dairy", slug: "aarong-dairy" },
      { name: "Shwapno", slug: "shwapno" },
    ];
    for (const b of brands) {
      await prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: b });
    }
  } else {
    console.log(`Found ${existingProductsCount} products. Skipping base product generation to preserve data.`);
  }

  // Reload products to use for order generation
  const allProducts = await prisma.product.findMany({
    include: { variants: true }
  });

  if (allProducts.length === 0) {
    console.error("No products available to generate orders! Please add some products.");
    return;
  }

  // 7. Customers & Orders Generation
  console.log("Generating 50 realistic Bangladeshi customers & their orders...");
  
  const firstNames = ["Abdur", "Karim", "Hasan", "Nusrat", "Sadia", "Mehedi", "Rifat", "Tamim", "Farzana", "Sabbir", "Arif", "Fatema", "Sumaiya", "Rakib", "Imran", "Tariq", "Tahmina", "Ayesha", "Salma", "Nazmul"];
  const lastNames = ["Rahim", "Uddin", "Mahmud", "Jahan", "Akter", "Hasan", "Islam", "Hossain", "Yasmin", "Ahmed", "Rahman", "Chowdhury", "Khan", "Sikder", "Miah", "Ali", "Begum", "Khatun"];
  const districts = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Comilla", "Gazipur", "Narayanganj"];
  const areas = ["Gulshan", "Banani", "Dhanmondi", "Mirpur", "Uttara", "Mohammadpur", "Badda", "Malibagh", "Farmgate", "Motijheel"];

  const reviewTexts = [
    { rating: 5, t: "Excellent", b: "Product onek valo chilo, delivery was fast!" },
    { rating: 5, t: "Authentic", b: "Authentic taste, original product. Amar khub bhalo legeche." },
    { rating: 5, t: "Fresh", b: "Packaging was totally fresh. Highly recommended." },
    { rating: 5, t: "Good quality", b: "Khub bhalo quality, always amar first choice FreshMart." },
    { rating: 4, t: "Good but late", b: "Delivery late chilo, kintu product ekdom fresh." },
    { rating: 4, t: "Premium", b: "Price ektu beshi, but quality premium." },
    { rating: 5, t: "Best", b: "Best online grocery experience in Dhaka! Again order korbo." },
    { rating: 5, t: "Fresh Chicken", b: "Chicken ta fresh chilo. Valo service." },
    { rating: 3, t: "Average", b: "Not bad, but could be better." },
    { rating: 4, t: "Valo", b: "Motamuti valo chilo. Packaging improved kora dorkar." },
    { rating: 2, t: "Disappointed", b: "Quality asha onujayi chilo na." },
  ];

  const statuses = ["DELIVERED", "DELIVERED", "DELIVERED", "DELIVERED", "CANCELLED", "PENDING", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY"];

  let totalOrdersGenerated = 0;
  let totalReviewsGenerated = 0;

  // Pre-hash password ONCE — avoid 50 sequential bcrypt calls
  const customerPasswordHash = await bcrypt.hash("password123", 10);

  for (let i = 1; i <= 50; i++) {

    const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@example.com`;
    
    // Create or find user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `${fname} ${lname}`,
          email,
          password: customerPasswordHash,
          phone: `+88017${Math.floor(Math.random() * 90000000 + 10000000)}`,
          role: "CUSTOMER",
          createdAt: new Date(Date.now() - Math.random() * 31536000000), // Random date in last year
        }
      });
    }

    // Create address
    const district = districts[Math.floor(Math.random() * districts.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    
    const existingAddress = await prisma.address.findFirst({ where: { userId: user.id } });
    let address = existingAddress;
    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: user.id,
          name: user.name || "Home",
          phone: user.phone || "+8801700000000",
          line1: `House ${Math.floor(Math.random() * 100)}, Road ${Math.floor(Math.random() * 20)}, ${area}`,
          city: district,
          state: district,
          zip: "12" + Math.floor(Math.random() * 99),
          country: "Bangladesh",
          isDefault: true,
        }
      });
    }

    // Check if user already has orders (idempotency)
    const existingOrdersCount = await prisma.order.count({ where: { userId: user.id } });
    if (existingOrdersCount > 0) {
      continue; // Skip order generation for this user
    }

    // Generate Orders
    const numOrders = Math.floor(Math.random() * 9); // 0 to 8 orders
    for (let o = 0; o < numOrders; o++) {
      const numItems = Math.floor(Math.random() * 6) + 1; // 1 to 6 items
      
      const orderProducts = [];
      // Pick random distinct products
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      for (let j = 0; j < numItems; j++) {
        orderProducts.push(shuffled[j]);
      }

      let subtotal = 0;
      const orderItemsData = orderProducts.map(p => {
        const qty = Math.floor(Math.random() * 3) + 1; // 1-3 qty
        const variant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
        const price = variant?.price || p.price;
        subtotal += price * qty;
        return {
          productId: p.id,
          productVariantId: variant?.id || null,
          name: p.name,
          image: variant?.image || null, // Best effort image
          price: price,
          quantity: qty,
          total: price * qty,
        };
      });

      const shipping = 60;
      const total = subtotal + shipping;
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentStatus = status === "DELIVERED" ? "PAID" : "PENDING";
      const createdAt = new Date(user.createdAt.getTime() + Math.random() * (Date.now() - user.createdAt.getTime()));

      const orderNumber = `FM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: user.id,
          subtotal,
          shipping,
          total,
          status,
          paymentStatus,
          paymentMethod: "COD",
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingAddress: `${address.line1}, ${address.city}`,
          createdAt,
          deliveredAt: status === "DELIVERED" ? new Date(createdAt.getTime() + 86400000) : null,
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });
      totalOrdersGenerated++;

      // Create reviews if order is DELIVERED
      if (status === "DELIVERED") {
        for (const item of order.items) {
          // 40% chance to leave a review
          if (Math.random() < 0.4) {
            // Ensure no duplicate review for this product from this user
            const existingReview = await prisma.review.findUnique({
              where: { userId_productId: { userId: user.id, productId: item.productId } }
            });
            if (!existingReview) {
              const reviewTemplate = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
              await prisma.review.create({
                data: {
                  userId: user.id,
                  productId: item.productId,
                  rating: reviewTemplate.rating,
                  title: reviewTemplate.t,
                  comment: reviewTemplate.b,
                  status: "APPROVED",
                  verified: true,
                  createdAt: new Date(order.deliveredAt!.getTime() + Math.random() * 864000000), // Within 10 days of delivery
                }
              });
              totalReviewsGenerated++;
            }
          }
        }
      }
    }
  }

  console.log(`Generated ${totalOrdersGenerated} orders and ${totalReviewsGenerated} verified reviews!`);

  // Update product ratings / counts
  console.log("Recalculating product ratings and counts...");
  for (const p of allProducts) {
    const aggregate = await prisma.review.aggregate({
      where: { productId: p.id, status: "APPROVED" },
      _avg: { rating: true },
      _count: { id: true },
    });
    
    const soldAggregate = await prisma.orderItem.aggregate({
      where: { productId: p.id, order: { status: "DELIVERED" } },
      _sum: { quantity: true },
    });

    await prisma.product.update({
      where: { id: p.id },
      data: {
        rating: aggregate._avg.rating || 0,
        reviewCount: aggregate._count.id || 0,
        soldCount: soldAggregate._sum.quantity || 0,
      }
    });
  }

  // Generate 150 random Audit Logs for testing
  console.log("Generating 150 random audit logs...");
  const users = await prisma.user.findMany({ where: { role: { not: "SUPER_ADMIN" } } });
  const adminAndUsers = [
    { id: adminUser.id, role: "SUPER_ADMIN" },
    ...users.map((u: any) => ({ id: u.id, role: "CUSTOMER" }))
  ];

  const possibleActions = [
    "LOGIN", "LOGOUT", "REGISTER", 
    "CREATE_PRODUCT", "UPDATE_PRODUCT", "DELETE_PRODUCT", 
    "PLACE_ORDER", "UPDATE_ORDER_STATUS", "CANCEL_ORDER",
    "UPDATE_PROFILE", "CHANGE_PASSWORD", "CREATE_REVIEW",
    "UPDATE_SETTINGS"
  ];

  const possibleEntities = [
    "Auth", "User", "Product", "Order", "Review", "Setting", "Category"
  ];

  const possibleStatuses = ["SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "FAILED", "PENDING"];

  const logsToCreate = [];
  const now = new Date();

  for (let i = 0; i < 150; i++) {
    const randomUser = adminAndUsers[Math.floor(Math.random() * adminAndUsers.length)];
    const randomAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
    const randomEntity = possibleEntities[Math.floor(Math.random() * possibleEntities.length)];
    const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
    
    // Spread dates over the last 30 days
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const logDate = new Date(now.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000));
    // Random hour/minute
    logDate.setHours(Math.floor(Math.random() * 24));
    logDate.setMinutes(Math.floor(Math.random() * 60));

    logsToCreate.push({
      userId: randomUser.id,
      role: randomUser.role,
      action: randomAction,
      entity: randomEntity,
      entityId: `mock_${Math.floor(Math.random() * 10000)}`,
      status: randomStatus,
      details: `Mock seeded log for ${randomAction}`,
      createdAt: logDate,
    });
  }

  await prisma.auditLog.createMany({
    data: logsToCreate,
  });
  console.log("Seeded 150 audit logs.");

  console.log("Seeding complete! 🇧🇩");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
