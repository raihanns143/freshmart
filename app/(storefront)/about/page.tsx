import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us – Raihans Shop",
  description: "Learn about Raihans Shop, our mission, vision, and why customers trust us for fresh groceries in Bangladesh.",
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Raihans Shop",
    "description": "Learn about Raihans Shop, our mission, vision, and history.",
    "url": "https://raihans.shop/about",
    "publisher": {
      "@id": "https://raihans.shop/#organization"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 w-full bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-16">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              About Raihans Shop
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We are Bangladesh&apos;s trusted online grocery platform, dedicated to delivering freshness, quality, and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To simplify the daily lives of families across Bangladesh by providing a seamless, fast, and highly reliable online grocery shopping experience. We believe that everyone deserves access to fresh, high-quality food without the hassle of crowded markets.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the most customer-centric food and grocery ecosystem in Bangladesh, empowering local farmers and suppliers while delivering unmatched value and freshness directly to our customers&apos; doorsteps.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Customers Trust Raihans Shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-10">
              <div>
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Farm Fresh Quality</h3>
                <p className="text-gray-600 text-sm">Sourced directly from verified local farmers and trusted suppliers.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">A highly optimized logistics network ensuring your order arrives on time.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer First</h3>
                <p className="text-gray-600 text-sm">24/7 dedicated support team ready to assist you with any inquiries.</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our History</h2>
            <p>
              Raihans Shop was born out of a simple observation: buying daily essentials in Bangladesh often involved navigating heavy traffic, crowded markets, and inconsistent quality. We set out to build a platform that removes these friction points. What started as a small local delivery operation has quickly grown into a trusted digital storefront serving thousands of happy customers.
            </p>
            <p>
              Today, Raihans Shop stands as a testament to what happens when technology meets a passion for quality service. We continuously innovate our supply chain, packaging, and delivery systems to ensure that when you order from Raihans Shop, you receive nothing but the best.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
