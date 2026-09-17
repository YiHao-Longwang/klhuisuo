import { redirect } from "next/navigation";
import { siteUrl } from "../seo";

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function PolicyPage() {
  redirect(`${siteUrl}/`);
}
