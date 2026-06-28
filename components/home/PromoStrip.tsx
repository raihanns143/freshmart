"use client";

import Image from "next/image";
import Link from "next/link";

const promos = [
  {
    id: "fruits",
    title: "30% Off Fresh Fruits",
    desc: "Limited time offer on seasonal picks",
    cta: "Shop Now",
    href: "/category/fresh-fruits",
    gradient: "linear-gradient(135deg, #FF6F00, #FFA000)",
    btnColor: "#FF6F00",
    img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80",
    imgAlt: "Fresh fruits",
  },
  {
    id: "vegetables",
    title: "Organic Vegetables",
    desc: "Farm fresh, delivered daily",
    cta: "Explore",
    href: "/category/vegetables",
    gradient: "linear-gradient(135deg, #00796B, #26A69A)",
    btnColor: "#00796B",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80",
    imgAlt: "Organic vegetables",
  },
];

export function PromoStrip() {
  return (
    <section className="py-0 pb-10" aria-label="Promotional banners">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="promo-card"
              style={{ background: promo.gradient }}
            >
              {/* Text */}
              <div className="text-white z-10 flex-1 pr-4">
                <h3 className="text-xl font-extrabold mb-1.5 text-white">{promo.title}</h3>
                <p className="text-sm mb-4" style={{ opacity: 0.85 }}>
                  {promo.desc}
                </p>
                <Link
                  href={promo.href}
                  className="inline-block text-sm font-bold py-1.5 px-4 rounded-2xl bg-white transition-opacity hover:opacity-90"
                  style={{ color: promo.btnColor }}
                >
                  {promo.cta}
                </Link>
              </div>

              {/* Image */}
              <div
                className="relative flex-shrink-0 z-10 rounded-xl overflow-hidden shadow-lg"
                style={{ width: 120, height: 100 }}
              >
                <Image
                  src={promo.img}
                  alt={promo.imgAlt}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
