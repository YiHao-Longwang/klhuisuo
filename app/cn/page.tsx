import { redirect } from "next/navigation";
import { siteUrl } from "../seo";

export default function ChineseHomeRedirect() {
  redirect(`${siteUrl}/`);
}
