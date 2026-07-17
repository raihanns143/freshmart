import { prisma } from "../lib/prisma";

async function verify() {
  const products = await prisma.product.findMany({
    where: { name: { contains: "Nuts" } },
    include: {
      variants: true,
      images: true
    }
  });
  console.log(JSON.stringify(products, null, 2));
}

verify().catch(console.error).finally(() => prisma.$disconnect());
