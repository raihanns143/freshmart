import { prisma } from "../lib/prisma";

async function syncAllImages() {
  console.log("Starting image synchronization for all products...");
  
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      images: {
        orderBy: { order: "asc" }
      }
    }
  });

  let updatedCount = 0;
  let createdCount = 0;

  for (const product of products) {
    if (product.variants.length > 0 && product.variants[0].image) {
      const variantImage = product.variants[0].image;
      
      const mainImage = product.images.find(img => img.isMain) || product.images[0];

      if (mainImage) {
        if (mainImage.url !== variantImage) {
          await prisma.productImage.update({
            where: { id: mainImage.id },
            data: { url: variantImage, isMain: true }
          });
          console.log(`[UPDATED] Product: ${product.name} - changed to ${variantImage}`);
          updatedCount++;
        }
      } else {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: variantImage,
            isMain: true,
            order: 0
          }
        });
        console.log(`[CREATED] Product: ${product.name} - set to ${variantImage}`);
        createdCount++;
      }
    }
  }

  console.log(`\nSynchronization complete!`);
  console.log(`Images updated: ${updatedCount}`);
  console.log(`Images created: ${createdCount}`);
}

syncAllImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
