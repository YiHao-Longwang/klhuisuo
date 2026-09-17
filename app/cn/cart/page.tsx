import { redirect } from "next/navigation";
import { siteUrl } from "../../seo";

export default function ChineseCartRedirect() {
  redirect(`${siteUrl}/cart/`);
}
