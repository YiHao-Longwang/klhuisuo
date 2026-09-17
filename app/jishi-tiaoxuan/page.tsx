import { pageMetadata } from "../seo";
import TechnicianSelection from "../technician-selection";

export const metadata = pageMetadata({
  title: "吉隆坡会所技师挑选 | 吉隆坡会所 吉隆坡服务预约",
  description:
    "吉隆坡会所技师挑选页面，可查看今日出勤技师、区域、状态与可外出服务，并可进入白区查看 吉隆坡会所 水汇价目。",
  path: "/jishi-tiaoxuan/",
  keywords: [
    "吉隆坡会所技师挑选",
    "吉隆坡技师",
    "吉隆坡下水",
    "吉隆坡全套服务",
    "吉隆坡莞式按摩服务",
    "吉隆坡会所",
  ],
});

export default function Home() {
  return <TechnicianSelection />;
}
