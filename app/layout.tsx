import type { Metadata } from "next";
import "./globals.css";
import { localBusinessJsonLd, pageMetadata, siteUrl } from "./seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({
    title: "吉隆坡会所 | 吉隆坡下水 · 吉隆坡水汇 · 吉隆坡按摩娱乐",
    description:
      "吉隆坡会所 at Viva Home Mall Kuala Lumpur: 24-hour spa, hot spring, 吉隆坡下水, 吉隆坡水汇, 下水, 水汇, 吉隆坡按摩, 吉隆坡娱乐, 吉隆坡莞式按摩服务, beauty, TCM wellness and home massage booking.",
    path: "/",
    keywords: [
      "吉隆坡会所 吉隆坡下水",
      "吉隆坡会所 吉隆坡水汇",
      "吉隆坡会所 吉隆坡按摩",
      "吉隆坡会所 吉隆坡娱乐",
      "吉隆坡会所 SPA",
      "吉隆坡按摩推荐",
      "吉隆坡下水",
      "吉隆坡水汇",
      "下水",
      "水汇",
      "吉隆坡莞式按摩服务",
      "Kuala Lumpur spa",
      "Viva Home Mall massage",
    ],
  }),
  applicationName: "klhuisuo",
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-48x48.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script src="/motion.js?v=20260914-subnav-stable" defer />
        <script src="/contact-clicks.js?v=20260908-wechat" defer />
        <script src="/booking-cart.js?v=20260914-cn-root" defer />
        <script src="/wechat-copy.js?v=20260903-wechat" defer />
        <script src="/tech-promo.js?v=20260914-hidden" defer />
      </body>
    </html>
  );
}
