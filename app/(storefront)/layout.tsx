import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SpecialOffers } from "@/components/sections/special-offers";
import { prisma } from "@/lib/prisma";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: 'asc' }
  });

  return (
    <>
      <Header categories={categories} />
      <div className="flex-1 flex flex-col min-h-screen pt-16 lg:pt-0 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <main className="flex-1 flex flex-col">{children}</main>
        <SpecialOffers />
        <Footer />
      </div>
      <MobileBottomNav />
    </>
  );
}
