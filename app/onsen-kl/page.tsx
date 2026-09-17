import { redirect } from "next/navigation";
import { siteUrl } from "../seo";

export default function OnsenLegacyRedirect() {
  redirect(`${siteUrl}/wenquan/`);
}
