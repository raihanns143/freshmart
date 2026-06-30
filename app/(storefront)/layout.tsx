import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col min-h-screen pt-20 lg:pt-0 pb-16 md:pb-0">
        {children}
      </div>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
