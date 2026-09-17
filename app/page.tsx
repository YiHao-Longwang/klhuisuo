import { HomeExperience } from "./home-experience";
import { ContactButtons, whatsappNumberDisplay } from "./site-common";
import { pageMetadata } from "./seo";

export const metadata = pageMetadata({
  title: "吉隆坡会所 | 吉隆坡下水 · 按摩娱乐会所",
  description:
    "吉隆坡会所是吉隆坡 24 小时SPA、桑拿、按摩与休闲娱乐会所，位于 Viva Home Mall。搜索吉隆坡会所、吉隆坡下水、吉隆坡按摩、吉隆坡上门与吉隆坡娱乐可预约。",
  path: "/",
  keywords: [
    "吉隆坡会所 吉隆坡下水",
    "吉隆坡会所 吉隆坡按摩",
    "吉隆坡会所 吉隆坡娱乐",
    "吉隆坡SPA",
    "吉隆坡桑拿",
    "吉隆坡会所",
    "吉隆坡按摩",
    "吉隆坡下水",
    "吉隆坡上门",
    "吉隆坡上门按摩",
    "吉隆坡莞式按摩服务",
    "吉隆坡娱乐",
    "吉隆坡会所",
    "klspa",
    "klmassage",
    "klentertainment",
  ],
});

export default function Home() {
  return <HomeExperience locale="cn" contact={<ContactButtons locale="cn" whatsappLabel={`WhatsApp ${whatsappNumberDisplay}`} />} />;
}
