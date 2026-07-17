import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({ select: { id: true, slug: true, name: true } });
  
  const fixedSlugs: string[] = [];
  
  for (const product of products) {
    // Check if slug has spaces or uppercase letters or special chars
    const hasSpaces = /\s/.test(product.slug);
    const hasUppercase = /[A-Z]/.test(product.slug);
    const hasSpecialChars = /[^a-z0-9-]/.test(product.slug);
    
    if (hasSpaces || hasUppercase || hasSpecialChars) {
      let newSlug = toSlug(product.slug);
      
      // Check if slug already exists
      let slugExists = await prisma.product.findFirst({ where: { slug: newSlug, id: { not: product.id } } });
      let attempt = 0;
      while (slugExists) {
        attempt++;
        newSlug = `${toSlug(product.slug)}-${attempt}`;
        slugExists = await prisma.product.findFirst({ where: { slug: newSlug, id: { not: product.id } } });
      }
      
      await prisma.product.update({ where: { id: product.id }, data: { slug: newSlug } });
      fixedSlugs.push(`${product.slug} → ${newSlug}`);
    }
  }
  
  return NextResponse.json({ 
    fixed: fixedSlugs.length, 
    slugs: fixedSlugs,
    message: fixedSlugs.length > 0 ? "Slugs fixed successfully" : "All slugs are already valid"
  });
}
