import { redirect } from "next/navigation";
import { cnPageSeo } from "../../cn-pages";
import { pageMetadata, siteUrl } from "../../seo";

const fallbackSeo = {
  title: "吉隆坡会所 | 吉隆坡SPA按摩娱乐",
  description:
    "吉隆坡会所中文页面：吉隆坡SPA、吉隆坡按摩、吉隆坡娱乐、24 小时汤泉、价目、设施、美容、中医与联系资料。",
  path: "/",
  keywords: ["吉隆坡SPA", "吉隆坡按摩", "吉隆坡娱乐", "吉隆坡会所", "klspa", "klmassage", "klentertainment"],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug.join("/");
  return pageMetadata(cnPageSeo[key === "onsen-kl" ? "wenquan" : key] ?? fallbackSeo);
}

export function generateStaticParams() {
  return Object.keys(cnPageSeo).map((slug) => ({ slug: [slug] }));
}

export default async function ChineseSubPageRedirect({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug.join("/");
  redirect(key === "wenquan" || key === "onsen-kl" ? `${siteUrl}/wenquan/` : `${siteUrl}/${key}/`);
}
