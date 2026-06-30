const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  console.log('Products:', products.length, products.slice(0, 10).map(p => p.slug));
  const categories = await prisma.category.findMany({ select: { slug: true } });
  console.log('Categories:', categories.length, categories.map(c => c.slug));
}
main().catch(console.error).finally(() => prisma.$disconnect());
