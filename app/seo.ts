import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://klhuisuo.klyihao.com").replace(/\/$/, "");

export const seoKeywords = [
  "吉隆坡会所",
  "吉隆坡会所 吉隆坡下水",
  "吉隆坡会所 吉隆坡按摩",
  "吉隆坡会所 吉隆坡娱乐",
  "klhuisuo",
  "吉隆坡SPA",
  "吉隆坡会所",
  "吉隆坡按摩",
  "吉隆坡下水",
  "吉隆坡莞式按摩服务",
  "莞式按摩吉隆坡",
  "吉隆坡娱乐",
  "吉隆坡桑拿",
  "吉隆坡上门",
  "吉隆坡上门按摩",
  "吉隆坡温泉",
  "吉隆坡汤泉",
  "KL spa",
  "klspa",
  "KL massage",
  "klmassage",
  "KL entertainment",
  "klentertainment",
  "24 hour spa KL",
  "onsen KL",
  "massage KL",
  "Viva Home Mall spa",
  "Kuala Lumpur spa",
  "KL onsen spa",
  "massage Kuala Lumpur",
  "spa Kuala Lumpur 24 hours",
  "吉隆坡水疗",
  "吉隆坡会所 spa",
  "吉隆坡会所桑拿",
  "吉隆坡会所按摩",
  "吉隆坡会所娱乐",
  "吉隆坡spa会所",
];

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = "/assets/hero-onsen-warm.jpg",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    keywords: [...keywords, ...seoKeywords],
    alternates: {
      canonical: canonicalPath,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "吉隆坡会所",
      type: "website",
      images: [
        {
          url: image,
          width: 1280,
          height: 853,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Placeholder until this clone receives its own Google Business Profile. */
export const googleBusinessProfileUrl = siteUrl;

/**
 * Profiles that represent this same business. `sameAs` is how Google ties the
 * site, the Business Profile and the social accounts together as one entity.
 */
const sameAsProfiles = [
  "https://www.instagram.com/vivadespa/",
  "https://t.me/nhlg09",
];

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "@id": `${siteUrl}/#business`,
  name: "吉隆坡会所",
  alternateName: [
    "吉隆坡会所",
    "Kuala Lumpur Club",
    "吉隆坡会所SPA",
    "吉隆坡会所下水",
    "吉隆坡会所按摩",
    "吉隆坡会所娱乐",
    "KL Spa",
    "吉隆坡莞式按摩服务",
  ],
  url: siteUrl,
  image: `${siteUrl}/assets/hero-onsen-warm.jpg`,
  sameAs: sameAsProfiles,
  telephone: "+60 14-315 5632",
  priceRange: "RM58-RM1699",
  paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
  currenciesAccepted: "MYR",
  description:
    "吉隆坡会所 is a 24-hour spa, massage, hot-spring and wellness destination in Kuala Lumpur at Viva Home Mall, relevant for 吉隆坡会所、吉隆坡下水、吉隆坡按摩 and 吉隆坡娱乐 searches.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "LG Floor, Viva Home Mall, 85 Jalan Loke Yew, Taman Miharja",
    addressLocality: "Kuala Lumpur",
    postalCode: "52200",
    addressCountry: "MY",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  areaServed: ["Kuala Lumpur", "Cheras", "Taman Miharja", "Viva Home Mall"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "booking",
      telephone: "+60 14-315 5632",
      areaServed: "MY",
      availableLanguage: ["English", "Chinese", "Malay"],
    },
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "吉隆坡会所下水" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "吉隆坡会所按摩" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "吉隆坡桑拿" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "吉隆坡上门按摩" } },
  ],
  knowsAbout: [
    "吉隆坡SPA",
    "吉隆坡会所 吉隆坡下水",
    "吉隆坡会所 吉隆坡按摩",
    "吉隆坡会所 吉隆坡娱乐",
    "吉隆坡水疗",
    "吉隆坡按摩",
    "吉隆坡下水",
    "吉隆坡莞式按摩服务",
    "莞式按摩吉隆坡",
    "吉隆坡温泉",
    "吉隆坡娱乐",
    "klspa",
    "klmassage",
    "klentertainment",
    "Kuala Lumpur spa",
    "KL onsen spa",
  ],
};

/**
 * FAQPage structured data. Google can surface these as expandable answers in
 * search results, so the FAQ copy on the page must match the copy passed here.
 */
export function faqJsonLd(faqs: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
