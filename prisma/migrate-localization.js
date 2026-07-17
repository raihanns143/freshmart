"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var LOCAL_BRANDS = [
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
var LOCAL_CATEGORIES = [
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
var LOCAL_PRODUCTS = [
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
var LOCAL_PROMOTIONS = [
    { code: "RAMADAN25", description: "Ramadan Grocery Sale", type: "PERCENTAGE", value: 15 },
    { code: "EIDSHOP", description: "Eid Shopping Festival", type: "FIXED", value: 500 },
    { code: "WINTERVEG", description: "Winter Vegetable Carnival", type: "PERCENTAGE", value: 20 },
];
var LOCAL_REVIEWS = [
    { name: "Rahim", text: "Excellent quality. Highly recommended.", rating: 5 },
    { name: "Karim", text: "Very fresh vegetables.", rating: 5 },
    { name: "Hasan", text: "Fresh Hilsha arrived quickly.", rating: 5 },
    { name: "Mahmud", text: "Packaging was excellent.", rating: 4 },
    { name: "Nusrat", text: "Delivery was very fast.", rating: 5 },
    { name: "Sadia", text: "Best grocery service.", rating: 5 },
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, LOCAL_BRANDS_1, b, _a, LOCAL_CATEGORIES_1, c, categories, brands, _loop_1, _b, LOCAL_PRODUCTS_1, p, _c, LOCAL_PROMOTIONS_1, promo, seoSettings, _d, seoSettings_1, setting, products, adminUser, i, review, product, mockUser, validProductSlugs, orphanedProducts, orphanedIds;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log("Starting Data Migration (Idempotent)...");
                    _i = 0, LOCAL_BRANDS_1 = LOCAL_BRANDS;
                    _e.label = 1;
                case 1:
                    if (!(_i < LOCAL_BRANDS_1.length)) return [3 /*break*/, 4];
                    b = LOCAL_BRANDS_1[_i];
                    return [4 /*yield*/, prisma.brand.upsert({
                            where: { slug: b.slug },
                            update: { name: b.name, logo: b.logo },
                            create: { name: b.name, slug: b.slug, logo: b.logo },
                        })];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _a = 0, LOCAL_CATEGORIES_1 = LOCAL_CATEGORIES;
                    _e.label = 5;
                case 5:
                    if (!(_a < LOCAL_CATEGORIES_1.length)) return [3 /*break*/, 8];
                    c = LOCAL_CATEGORIES_1[_a];
                    return [4 /*yield*/, prisma.category.upsert({
                            where: { slug: c.slug },
                            update: { name: c.name, image: c.image },
                            create: { name: c.name, slug: c.slug, image: c.image, color: "bg-blue-500" },
                        })];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, prisma.category.findMany()];
                case 9:
                    categories = _e.sent();
                    return [4 /*yield*/, prisma.brand.findMany()];
                case 10:
                    brands = _e.sent();
                    _loop_1 = function (p) {
                        var slug, cat, brand, product;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                    cat = categories.find(function (c) { return c.slug === p.catSlug; });
                                    brand = brands.find(function (b) { return b.slug === p.brandSlug; });
                                    return [4 /*yield*/, prisma.product.upsert({
                                            where: { slug: slug },
                                            update: { name: p.name, price: p.price, categoryId: cat.id, brandId: brand.id },
                                            create: {
                                                name: p.name,
                                                slug: slug,
                                                price: p.price,
                                                categoryId: cat.id,
                                                brandId: brand.id,
                                                unit: "piece"
                                            },
                                        })];
                                case 1:
                                    product = _f.sent();
                                    // Update Images safely
                                    return [4 /*yield*/, prisma.productImage.deleteMany({ where: { productId: product.id } })];
                                case 2:
                                    // Update Images safely
                                    _f.sent();
                                    return [4 /*yield*/, prisma.productImage.create({
                                            data: { productId: product.id, url: p.img, isMain: true }
                                        })];
                                case 3:
                                    _f.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b = 0, LOCAL_PRODUCTS_1 = LOCAL_PRODUCTS;
                    _e.label = 11;
                case 11:
                    if (!(_b < LOCAL_PRODUCTS_1.length)) return [3 /*break*/, 14];
                    p = LOCAL_PRODUCTS_1[_b];
                    return [5 /*yield**/, _loop_1(p)];
                case 12:
                    _e.sent();
                    _e.label = 13;
                case 13:
                    _b++;
                    return [3 /*break*/, 11];
                case 14: 
                // 4. Update Promotions (Coupons)
                return [4 /*yield*/, prisma.coupon.deleteMany()];
                case 15:
                    // 4. Update Promotions (Coupons)
                    _e.sent(); // Reset coupons to local ones
                    _c = 0, LOCAL_PROMOTIONS_1 = LOCAL_PROMOTIONS;
                    _e.label = 16;
                case 16:
                    if (!(_c < LOCAL_PROMOTIONS_1.length)) return [3 /*break*/, 19];
                    promo = LOCAL_PROMOTIONS_1[_c];
                    return [4 /*yield*/, prisma.coupon.create({
                            data: promo,
                        })];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18:
                    _c++;
                    return [3 /*break*/, 16];
                case 19:
                    seoSettings = [
                        { key: "SITE_NAME", value: "FreshMart Bangladesh" },
                        { key: "SEO_TITLE", value: "FreshMart - Premium Bangladeshi Grocery" },
                        { key: "SEO_DESCRIPTION", value: "Shop online for fresh produce, dairy, meat, and everyday Bangladeshi essentials." },
                        { key: "SEO_KEYWORDS", value: "grocery, bangladesh, fresh vegetables, fish, hilsha, miniket rice, dhaka grocery" },
                        { key: "CURRENCY", value: "BDT" }
                    ];
                    _d = 0, seoSettings_1 = seoSettings;
                    _e.label = 20;
                case 20:
                    if (!(_d < seoSettings_1.length)) return [3 /*break*/, 23];
                    setting = seoSettings_1[_d];
                    return [4 /*yield*/, prisma.setting.upsert({
                            where: { key: setting.key },
                            update: { value: setting.value },
                            create: { key: setting.key, value: setting.value, isPublic: true },
                        })];
                case 21:
                    _e.sent();
                    _e.label = 22;
                case 22:
                    _d++;
                    return [3 /*break*/, 20];
                case 23: return [4 /*yield*/, prisma.product.findMany({ take: 3 })];
                case 24:
                    products = _e.sent();
                    return [4 /*yield*/, prisma.user.findFirst({ where: { role: "ADMIN" } })];
                case 25:
                    adminUser = _e.sent();
                    if (!(adminUser && products.length > 0)) return [3 /*break*/, 31];
                    return [4 /*yield*/, prisma.review.deleteMany()];
                case 26:
                    _e.sent(); // Clean old reviews
                    i = 0;
                    _e.label = 27;
                case 27:
                    if (!(i < LOCAL_REVIEWS.length)) return [3 /*break*/, 31];
                    review = LOCAL_REVIEWS[i];
                    product = products[i % products.length];
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "mock".concat(i, "@example.com") },
                            update: { name: review.name },
                            create: { name: review.name, email: "mock".concat(i, "@example.com") },
                        })];
                case 28:
                    mockUser = _e.sent();
                    return [4 /*yield*/, prisma.review.create({
                            data: {
                                userId: mockUser.id,
                                productId: product.id,
                                rating: review.rating,
                                title: "Great",
                                comment: review.text,
                                status: "APPROVED"
                            }
                        })];
                case 29:
                    _e.sent();
                    _e.label = 30;
                case 30:
                    i++;
                    return [3 /*break*/, 27];
                case 31:
                    validProductSlugs = LOCAL_PRODUCTS.map(function (p) { return p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''); });
                    return [4 /*yield*/, prisma.product.findMany({
                            where: {
                                slug: { notIn: validProductSlugs }
                            }
                        })];
                case 32:
                    orphanedProducts = _e.sent();
                    if (!(orphanedProducts.length > 0)) return [3 /*break*/, 36];
                    orphanedIds = orphanedProducts.map(function (p) { return p.id; });
                    return [4 /*yield*/, prisma.productImage.deleteMany({ where: { productId: { in: orphanedIds } } })];
                case 33:
                    _e.sent();
                    return [4 /*yield*/, prisma.inventory.deleteMany({ where: { productId: { in: orphanedIds } } })];
                case 34:
                    _e.sent();
                    return [4 /*yield*/, prisma.product.deleteMany({ where: { id: { in: orphanedIds } } })];
                case 35:
                    _e.sent();
                    console.log("Deleted ".concat(orphanedProducts.length, " orphaned demo products."));
                    _e.label = 36;
                case 36:
                    console.log("Migration Complete! Localized data successfully inserted.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
