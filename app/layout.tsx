import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { ResponsiveToaster } from "@/components/ui/responsive-toaster";
import { prisma } from "@/lib/prisma";
import { defaultBDT } from "@/lib/currency";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settingsRecords = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          "SITE_NAME", "SEO_TITLE", "SEO_DESCRIPTION", "SEO_KEYWORDS", 
          "SEO_OG_IMAGE", "SEO_TWITTER_IMAGE", "STORE_ADDRESS", "CONTACT_PHONE", "CONTACT_EMAIL",
          "GOOGLE_SITE_VERIFICATION", "BING_SITE_VERIFICATION", "YANDEX_SITE_VERIFICATION", 
          "PINTEREST_SITE_VERIFICATION", "FACEBOOK_DOMAIN_VERIFICATION"
        ],
      },
    },
  });
  
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  const siteName = settings.SITE_NAME || "Raihans Shop";
  const title = settings.SEO_TITLE || "Raihans Shop | Online Grocery Store in Bangladesh";
  const description = settings.SEO_DESCRIPTION || "Shop fresh vegetables, fruits, fish, meat, rice, dairy products, snacks and daily essentials online from Raihans Shop. Fast delivery and Cash on Delivery available across Bangladesh.";
  const keywords = settings.SEO_KEYWORDS ? settings.SEO_KEYWORDS.split(",") : [
    "Raihans Shop", "Online Grocery Bangladesh", "Grocery Delivery Bangladesh", 
    "Online Supermarket", "Fresh Vegetables", "Fresh Fish", "Fresh Meat", 
    "Rice", "Daily Essentials", "Bangladesh Grocery", "Rajshahi Grocery", 
    "Cash On Delivery"
  ];
  const ogImage = settings.SEO_OG_IMAGE || "/logo.png";
  const twitterImage = settings.SEO_TWITTER_IMAGE || "/logo.png";

  return {
    metadataBase: new URL("https://raihans.shop"),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description: description,
    keywords: keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    verification: {
      google: settings.GOOGLE_SITE_VERIFICATION,
      yandex: settings.YANDEX_SITE_VERIFICATION,
      other: {
        "msvalidate.01": settings.BING_SITE_VERIFICATION,
        "p:domain_verify": settings.PINTEREST_SITE_VERIFICATION,
        "facebook-domain-verification": settings.FACEBOOK_DOMAIN_VERIFICATION,
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/favicon-icon.png", type: "image/png" },
      ],
      apple: "/favicon-icon.png",
      shortcut: "/favicon-icon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: "en_BD",
      url: "https://raihans.shop",
      title: title,
      description: description,
      siteName: siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [twitterImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#22C55E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global settings
  const settingsRecords = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  const currencyCode = settings.CURRENCY || "BDT";
  
  const activeCurrency = await prisma.currency.findUnique({
    where: { code: currencyCode }
  }) || defaultBDT;

  const siteName = settings.SITE_NAME || "Raihans Shop";
  const contactEmail = settings.CONTACT_EMAIL || "support@raihans.shop";
  const contactPhone = settings.CONTACT_PHONE || "+8801700000000";
  const address = settings.STORE_ADDRESS || "Rajshahi, Bangladesh";

  const globalSettings = {
    currency: currencyCode,
    activeCurrency: {
      ...activeCurrency,
      position: activeCurrency.position as "left" | "right",
    },
    siteName,
    taxRate: settings.TAX_RATE ? parseFloat(settings.TAX_RATE) : 0.05,
    deliveryCharge: settings.DELIVERY_CHARGE ? parseFloat(settings.DELIVERY_CHARGE) : 50,
    contactEmail,
    contactPhone,
    address,
  };

  const socialLinks = [
    settings.SOCIAL_FACEBOOK,
    settings.SOCIAL_LINKEDIN,
    settings.SOCIAL_GITHUB,
    settings.SOCIAL_INSTAGRAM,
    settings.SOCIAL_YOUTUBE,
    settings.SOCIAL_TWITTER
  ].filter(Boolean) as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://raihans.shop/#organization",
        "name": siteName,
        "url": "https://raihans.shop",
        "logo": "https://raihans.shop/logo.png",
        "sameAs": socialLinks.length > 0 ? socialLinks : undefined,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": contactPhone,
          "contactType": "customer service",
          "email": contactEmail,
          "areaServed": "BD",
          "availableLanguage": ["en", "bn"]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://raihans.shop/#website",
        "url": "https://raihans.shop",
        "name": siteName,
        "publisher": {
          "@id": "https://raihans.shop/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://raihans.shop/search?query={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://raihans.shop/#localbusiness",
        "name": siteName,
        "image": "https://raihans.shop/logo.png",
        "telephone": contactPhone,
        "email": contactEmail,
        "url": "https://raihans.shop",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": address,
          "addressLocality": "Rajshahi",
          "addressCountry": "BD"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "24.3745",
          "longitude": "88.6042"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "08:00",
            "closes": "22:00"
          }
        ],
        "priceRange": "$$"
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics */}
        {settings.GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {settings.GOOGLE_TAG_MANAGER_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settings.GOOGLE_TAG_MANAGER_ID}');
            `}
          </Script>
        )}

        {/* Microsoft Clarity */}
        {settings.MICROSOFT_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${settings.MICROSOFT_CLARITY_ID}");
            `}
          </Script>
        )}

        {/* Meta Pixel */}
        {settings.FACEBOOK_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
        {/* Google Tag Manager (noscript) */}
        {settings.GOOGLE_TAG_MANAGER_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.GOOGLE_TAG_MANAGER_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        
        {/* Meta Pixel (noscript) */}
        {settings.FACEBOOK_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${settings.FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

        <Providers settings={globalSettings}>
          {children}
          <ResponsiveToaster />
        </Providers>
      </body>
    </html>
  );
}
