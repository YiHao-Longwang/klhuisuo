import { PolicyPageCn, cnPageSeo } from "../cn-pages";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata(cnPageSeo["terms-conditions"]);

export default function PolicyPage() {
  return <PolicyPageCn eyebrow="吉隆坡会所 · 政策" title="条款与细则" rows={[ ["服务", "现场服务内容与开放项目以门店当天安排为准。"], ["价格", "页面价格仅供参考，最终以门店现场公示为准。"], ["到店", "请按现场指引使用设施，并配合工作人员安排。"] ]} />;
}
