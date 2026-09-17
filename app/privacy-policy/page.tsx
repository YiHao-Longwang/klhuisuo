import { PolicyPageCn, cnPageSeo } from "../cn-pages";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata(cnPageSeo["privacy-policy"]);

export default function PolicyPage() {
  return <PolicyPageCn eyebrow="吉隆坡会所 · 政策" title="隐私政策" rows={[ ["资料使用", "仅用于回应咨询与安排现场服务。"], ["联系资料", "仅用于客服跟进，不会公开展示。"], ["安全", "我们不会在页面展示不必要的个人资料。"] ]} />;
}
