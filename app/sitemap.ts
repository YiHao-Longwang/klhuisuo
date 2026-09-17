import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";

const routes = [
  "",
  "/jishi-tiaoxuan",
  "/packages",
  "/facilities",
  "/home-massage",
  "/beauty",
  "/tcm",
  "/wenquan",
  "/faq",
  "/contact",
  "/terms-conditions",
  "/privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}/`,
    lastModified: new Date(),
    changeFrequency: route.includes("packages") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.includes("packages") ? 0.9 : 0.75,
  }));
}
