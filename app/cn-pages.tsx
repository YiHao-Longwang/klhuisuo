import {
  experienceImage,
  ContactButtons,
  Diamond,
  FloatingWhatsApp,
  Footer,
  Header,
  Hero,
  JsonLd,
  SectionHead,
  telegramDisplay,
  telegramHrefCn,
  wechatId,
  whatsappHrefCn,
  whatsappNumberDisplay,
} from "./site-common";
import { faqJsonLd, googleBusinessProfileUrl, pageMetadata } from "./seo";

/**
 * Every Chinese sub-page used to share one static metadata export pointing at
 * /cn/, which made all of them look like duplicates of the Chinese homepage.
 * Each slug now gets its own title, description and canonical.
 */
export const cnPageSeo: Record<string, { title: string; description: string; path: string; keywords: string[]; image?: string }> = {
  packages: {
    title: "吉隆坡水汇价目 | 普通入场与按摩价格 · 吉隆坡会所",
    description:
      "吉隆坡会所水汇价目：普通 12 小时入场、儿童票、按摩护理、搓背去角质与包厢价格，适合搜索吉隆坡下水、吉隆坡水汇、下水、水汇的客人查看。",
    path: "/packages/",
    keywords: ["吉隆坡SPA价格", "吉隆坡按摩价格", "吉隆坡水疗价目", "吉隆坡水汇价目", "吉隆坡会所价目", "吉隆坡温泉价格", "吉隆坡下水", "吉隆坡水汇", "下水", "水汇"],
    image: "/assets/hero-packages-rain.jpg",
  },
  facilities: {
    title: "吉隆坡水汇设施 | 汤泉汗蒸桑拿包厢 · 吉隆坡会所",
    description:
      "吉隆坡会所位于吉隆坡 Viva Home Mall：冷热汤池、岩盐蒸房房、桑拿、按摩包厢、搓背房、休息大厅与餐饮区，24 小时开放，适合吉隆坡下水与吉隆坡水汇搜索。",
    path: "/facilities/",
    keywords: ["吉隆坡SPA设施", "吉隆坡汗蒸", "吉隆坡桑拿", "吉隆坡娱乐", "吉隆坡会所设施", "吉隆坡下水", "吉隆坡水汇", "下水", "水汇"],
    image: "/assets/fac-hero-immersive.jpg",
  },
  "home-massage": {
    title: "吉隆坡上门按摩 | 酒店住家马杀鸡 · 吉隆坡会所",
    description:
      "吉隆坡会所上门按摩服务：技师上门到酒店、公寓与住家，自带床单毛巾与精油，价格公开，WhatsApp 即可预约。",
    path: "/home-massage/",
    keywords: ["吉隆坡上门按摩", "吉隆坡按摩", "KL上门马杀鸡", "吉隆坡会所按摩"],
    image: "/assets/outcall-hero.jpg",
  },
  beauty: {
    title: "吉隆坡美容SPA | 美白嫩肤脱毛 · 吉隆坡会所",
    description:
      "吉隆坡会所美容部：全身亮肤、光子嫩肤、局部护理与脱毛项目，可搭配汤泉门票，男女皆可，一对一美容师服务。",
    path: "/beauty/",
    keywords: ["吉隆坡美容", "吉隆坡美容SPA", "吉隆坡水疗", "吉隆坡会所美容"],
    image: "/assets/beauty-hero.jpg",
  },
  tcm: {
    title: "吉隆坡中医调理 | 艾灸推拿正骨 · 吉隆坡会所",
    description:
      "吉隆坡会所中医部：免费把脉、艾灸、中药泥灸、正骨与经络调理，驻店中医师一对一，价格清楚列明。",
    path: "/tcm/",
    keywords: ["吉隆坡中医", "吉隆坡艾灸", "吉隆坡推拿", "吉隆坡按摩", "吉隆坡会所中医"],
    image: "/assets/tcm-hero.jpg",
  },
  faq: {
    title: "常见问题 | 吉隆坡SPA预约须知 · 吉隆坡会所",
    description:
      "吉隆坡会所常见问题：12 小时使用时间、平日与周末价格、儿童票、停车与到店流程，一次看清楚。",
    path: "/faq/",
    keywords: ["吉隆坡SPA预约", "吉隆坡会所预约", "吉隆坡按摩问题", "吉隆坡水疗"],
  },
  contact: {
    title: "联系我们 | 吉隆坡SPA地址电话 · 吉隆坡会所",
    description:
      "吉隆坡会所地址：吉隆坡 Viva Home Mall LG Floor，24 小时营业，WhatsApp +60 14-315 5632 预约吉隆坡SPA与按摩。",
    path: "/contact/",
    keywords: ["吉隆坡会所地址", "吉隆坡SPA地址", "吉隆坡按摩电话", "Viva Home Mall spa"],
  },
  wenquan: {
    title: "吉隆坡水汇汤泉 | 24小时中式泡汤 · 吉隆坡会所",
    description:
      "吉隆坡会所 24 小时温泉汤泉：热汤池、汗蒸、桑拿与冰池交替，12 小时任泡任休息，位于 Viva Home Mall，也覆盖吉隆坡下水、吉隆坡水汇、下水、水汇搜索。",
    path: "/wenquan/",
    keywords: ["吉隆坡温泉", "吉隆坡汤泉", "吉隆坡泡汤", "KL onsen spa", "24小时汤泉", "吉隆坡下水", "吉隆坡水汇", "下水", "水汇"],
  },
  "terms-conditions": {
    title: "条款与细则 | 吉隆坡会所 吉隆坡SPA",
    description: "吉隆坡会所条款与细则：服务项目、价格说明与到店流程。",
    path: "/terms-conditions/",
    keywords: ["吉隆坡会所条款", "吉隆坡SPA条款"],
  },
  "privacy-policy": {
    title: "隐私政策 | 吉隆坡会所 吉隆坡SPA",
    description: "吉隆坡会所隐私政策：联系资料的使用范围与保护方式。",
    path: "/privacy-policy/",
    keywords: ["吉隆坡会所隐私", "吉隆坡SPA隐私政策"],
  },
};

const cnFallbackSeo = {
  title: "吉隆坡会所 | 吉隆坡下水水汇按摩娱乐",
  description:
    "吉隆坡会所中文页面：吉隆坡SPA、吉隆坡下水、吉隆坡水汇、下水、水汇、吉隆坡按摩、吉隆坡娱乐、24 小时汤泉、价目、设施、美容、中医与联系资料。",
  path: "/",
  keywords: ["吉隆坡SPA", "吉隆坡按摩", "吉隆坡娱乐", "吉隆坡会所", "吉隆坡下水", "吉隆坡水汇", "下水", "水汇", "klspa", "klmassage", "klentertainment"],
};

const cnBase = "";

const packageCards = [
  {
    id: "pk-solo",
    title: "12 小时普通入场",
    tag: "普通入场",
    image: "img-solo.jpg",
    desc: "成人普通入场，入场后可停留 12 小时",
    prices: [
      { label: "星期日-星期四", price: "169", per: "/ 人" },
      { label: "星期五、六与公共假期", price: "199", per: "/ 人" },
    ],
    features: ["汤池、汗蒸、桑拿、休息区与餐饮区", "12 小时从入场开始计算", "每位成人各买一张普通入场票"],
    notes: ["星期日和星期一到星期四同一档，走的是低价那一边。", "按摩、搓背、美容与中医项目另行加购。"],
    button: "预约",
  },
  {
    id: "pk-kids",
    title: "儿童票",
    tag: "普通儿童票",
    image: "img-daytime.jpg",
    desc: "12 岁及以下儿童，须成人陪同",
    prices: [
      { label: "星期日-星期四", price: "58", per: "/ 小孩" },
      { label: "星期五、六与公共假期", price: "88", per: "/ 小孩" },
    ],
    features: ["12 岁及以下儿童使用", "必须与成人客人一起入场", "同样使用 12 小时入场时间"],
    notes: ["2 岁及以下可到前台登记。"],
    button: "预约",
  },
];

const treatmentGroups = [
  {
    cn: "全身项目",
    en: "SPA / Full Body",
    rows: [
      ["舒缓触感疗程", "60 分钟", "RM369++"],
      ["热石深层排毒疗程", "80 分钟", "RM499++"],
      ["法式尊享", "100 分钟", "RM699++"],
      ["五行至尊 SPA", "110 分钟", "RM799++"],
    ],
  },
  {
    cn: "足疗项目",
    en: "Foot Massage",
    rows: [
      ["经典足疗", "60 分钟", "RM299++"],
      ["足疗", "80 分钟", "RM499++"],
    ],
  },
  {
    cn: "指压项目",
    en: "Shiatsu Massage",
    rows: [
      ["局部调理", "30 分钟", "RM199++"],
      ["中式推拿", "60 分钟", "RM299++"],
      ["传统泰式按摩", "70 分钟", "RM399++"],
    ],
  },
  {
    cn: "小项目",
    en: "Other Treatment",
    rows: [
      ["舒耳疗程", "单次", "RM150++"],
      ["唐式耳浴", "60 分钟", "RM299++"],
      ["扬州修脚", "单次", "RM150++"],
      ["穴位拔罐", "单次", "RM150++"],
      ["经络刮痧", "单次", "RM150++"],
      ["古法搓背", "单次", "RM150++"],
      ["花式背踩", "30 分钟", "RM199++"],
      ["洗眼 SPA", "单次", "RM150++"],
    ],
  },
  {
    cn: "保养项目",
    en: "Maintenance · Signature",
    rows: [
      ["四手和韵疗程", "70 分钟", "RM999++"],
      ["下肢深层调理", "90 分钟", "RM699++"],
      ["骨盆能量调理", "90 分钟", "RM699++"],
    ],
  },
];

const drinkRows = [
  ["威士忌可乐桶", "1.5L RM59", "3L RM99"],
  ["Mojito 桶", "1.5L RM59", "3L RM99"],
  ["Jager 桶", "1.5L RM59", "3L RM99"],
  ["龙舌兰日出", "1.5L RM69", "3L RM118"],
  ["梅子凤梨冰酒", "1.5L RM69", "3L RM118"],
  ["Sangria", "1.5L RM69", "3L RM118"],
  ["长岛冰茶", "1.5L RM79", "3L RM138"],
  ["葡萄柚朗姆", "1.5L RM79", "3L RM128"],
];

const rooms = [
  {
    id: "room-golf",
    title: "高尔夫房",
    image: "fac-golf.jpg",
    big: "199",
    cap: "3 小时",
    hourly: [
      ["2 小时", "RM139"],
      ["按小时租", "RM99 / 小时"],
    ],
    features: ["关上门就能挥杆，私人高尔夫模拟房，旁边还有 4 张按摩椅", "按房收费，不按人头收费", "RM99 / 1 小时 · RM139 / 2 小时 · RM199 / 3 小时", "只接受 WhatsApp 预约"],
  },
  {
    id: "room-storm",
    title: "暴雨淋浴房",
    image: "fac-storm.jpg",
    big: "699",
    cap: "私人房 · 最多 15 人",
    hourly: [["按小时租", "RM499 / 小时"]],
    features: ["私人房预约，适合多人同行", "最多 15 人私人包间", "按房收费；入场票与护理项目另计", "只接受 WhatsApp 咨询与预约"],
  },
];

const facilities = [
  ["冷热交替池", "fac-icefire.jpg?osw=0.9.23", "13°C 玄冰池与 43°C 中药池冷热交替，星空顶下泡完通体舒畅。"],
  ["岩盐蒸房", "fac-steam.jpg?osw=0.9.23", "暖光盐晶墙汗蒸房，坐着发一身透汗，循环更舒畅。"],
  ["护理房", "fac-massage.jpg?osw=0.9.23", "独立护理房，三张床位，家人朋友可同房一起做；推拿、泰式、精油等 20 项护理都在这里安排。"],
  ["古法搓背", "fac-scrub.jpg?osw=0.9.23", "专设搓澡房，传统手艺搓出一身轻，需要可另行加购。"],
  ["放映厅 · 眠息厅", "fac-movie.jpg?osw=0.9.23", "影视厅连着休息厅，人手一副耳机，爱看的看片，想睡的安睡。"],
  ["光影长廊", "fac-immersive.jpg?osw=0.9.23", "星幕光影长廊，泡完慢慢回神，顺手就是一张大片。"],
  ["足部护理房", "fac-recliner.jpg?osw=0.9.23", "足浴专用躺椅房，足疗、修脚都在这里做，做完顺势休息。"],
  ["盐石汗蒸房", "fac-onsen.jpg?osw=0.9.23", "躺在温热盐石床上，让热力慢慢透进身体，泡汤前后都适合。"],
  ["护理房", "fac-treatment.jpg?osw=0.9.23", "热石排毒、法式尊享、五行至尊等深层疗程会安排在这里。"],
  ["颐和私人餐房", "fac-vip.jpg?osw=0.9.23", "适合正式聚餐的包房，可围桌点招牌菜，需要提前预约。"],
  ["高尔夫主题房", "fac-golf.jpg?osw=0.9.23", "高尔夫主题私人房，每房 RM99/小时起，可直接预约。"],
  ["更衣室", "fac-locker.jpg?osw=0.9.23", "每位客人都有独立储物柜与宽敞长凳，泡汤前先舒服安顿。"],
  ["梳洗区", "fac-grooming.jpg?osw=0.9.23", "洗漱台与梳妆座位齐全，汗蒸泡汤后可以好好整理。"],
  ["餐厅", "fac-dining.jpg?osw=0.9.23", "晚餐自助 6-9pm，其他时段有简餐、水果与冰淇淋。"],
];

const homeChips = ["同一批店内技师", "床单毛巾与精油都会带到", "酒店 · 公寓 · 住家", "客服跟进细节"];
const homePlans = [
  {
    code: "outcall-classic",
    title: "经典 2 小时上门按摩",
    tag: "日间推荐",
    image: "outcall-plan-warm.jpg?osw=0.9.23",
    desc: "先用精油松开背部，再用传统泰式拉伸全身，两小时完整放松。",
    price: "RM699",
    features: ["60 分钟精油按摩 + 60 分钟传统泰式，顺序固定", "开始时间 9:00 AM-10:00 PM", "适合酒店或家里好好留出一段放松时间", "线上最早可预约 3 小时后的时段；更急请 WhatsApp"],
  },
  {
    code: "outcall-anytime",
    title: "随时 2 小时上门按摩",
    tag: "自由搭配",
    image: "outcall-plan-classic.jpg?osw=0.9.23",
    desc: "固定两小时，一个清楚价格。告诉我们你偏好精油、推拿、泰式或足部护理。",
    price: "RM798",
    features: ["固定 120 分钟，RM798", "可备注偏好的精油、推拿、泰式或足疗组合", "全天可预约，最早为下单后 3 小时", "需要更长时间请直接 WhatsApp"],
  },
  {
    code: "outcall-fourhands",
    title: "四手尊宠 · 2 小时",
    tag: "四手护理",
    image: "outcall-plan-duo.jpg?osw=0.9.23",
    desc: "两位技师同步护理，肩背与腿部同时照顾，两小时等于四小时手感。",
    price: "RM1,699",
    night: true,
    features: ["两位技师同步，只服务一位客人", "背部与腿部同时护理，释放更快", "每日 9:00 AM-10:00 PM 可开始；RM100 交通费覆盖两位技师", "线上最早可预约 3 小时后；更急请 WhatsApp"],
  },
];
const homeFlow = [
  ["1 · WhatsApp 找我们", "告诉我们想预约哪项服务。用 Telegram 或 WeChat 也一样。"],
  ["2 · 客服跟进细节", "客服会协助查看技师情况，并说明服务价与 8% SST。"],
  ["3 · 大概说个时间", "说个大概时间就够了。把地址发给我们，我们会查看是否在 30km 范围内。"],
  ["4 · 技师到达", "技师按约定时间到达，在你的床上铺好一次性床单后开始。"],
];
const homeFaqs = [
  ["价格怎么算？", "经典 RM699 + 8% SST；随时 RM798 + 8% SST；四手 RM1,699 + 8% SST。RM100 交通费另计。"],
  ["地址怎么处理？", "团队会跟进服务地址与到达时间，并查看是否在 30km 范围。"],
  ["服务范围到哪里？", "距离门店 30km 内，以下单后的实际地址确认。"],
  ["我需要准备什么？", "不用搬家具，只要有一个能平躺、不被打扰的位置。技师会带精油、一次性床单和毛巾。"],
  ["最快多久能到？", "线上最早可选下单后 3 小时。更急的话，把地址和时间 WhatsApp 给我们。"],
  ["半夜可以预约吗？", "随时服务可全天预约，包括凌晨 3 点。经典和四手开始时间为每日 9am-10pm。"],
  ["怎么联系？", "通过 WhatsApp、Telegram 或 WeChat 找客服即可。"],
];

const beautyChips = ["普通价目咨询", "男女都可预约", "一对一专员服务", "WhatsApp 提前预约"];
const lightTreatments = [
  ["光子嫩肤", "beauty-photon.jpg?osw=0.9.23", "温和光电面部护理，针对暗沉、粗糙与肤色不均，让肌肤看起来更干净透亮。"],
  ["淡斑护理", "beauty-spot.jpg?osw=0.9.23", "针对面部色素沉着的局部亮肤护理；现场皮肤评估后确认方案与价格。"],
  ["冰点脱毛", "beauty-hair.jpg?osw=0.9.23", "810nm 冰点技术，低温感更温和；按部位报价，也可组合多部位。"],
];
const signature = [
  ["项目内容", "先泡汤汗蒸，再到美容部完成身体植物焕亮护理；身体膜等待时同步完成水光面部护理与手部护理。"],
  ["适合人群", "肤色暗沉、肤色不均、干燥缺水、手部粗糙，或重要场合前想让状态更亮的人。"],
  ["须知", "敏感肌、近期暴晒或怀孕请先告知专员；护理后 48 小时注意防晒与保湿。"],
];
const facial = [
  ["项目内容", "深层清洁、黑头清理、铲皮、精华导入、面部刮痧、冰锤舒缓与修复面膜。"],
  ["适合人群", "毛孔堵塞、黑头明显、妆容不服帖，或皮肤很久没做深层清洁。"],
  ["须知", "有开放伤口或严重爆痘请先告知专员；护理后少化厚妆并注意防晒。"],
];
const beautyFaqs = [
  ["美容包含温泉门票吗？", "美容护理不自动包含温泉门票；如需入场，请另外向客服确认。"],
  ["男生可以预约吗？", "可以。主推护理男女都适合，光电项目会先做皮肤评估。"],
  ["需要提前预约吗？", "需要，每个 session 都是一对一。请 WhatsApp 锁定时段。"],
  ["为什么光电项目没有标价？", "光子、淡斑和脱毛会按皮肤状态与部位定制，咨询后确认完整报价。"],
  ["怎么联系？", "可以通过 WhatsApp、Telegram 或 WeChat 咨询。"],
];

const tcmChips = ["免费中医把脉", "驻店中医师", "一对一专员服务", "WhatsApp 提前预约"];
const tcmTreatments = [
  ["全身经络药拓调理", "tcm-meridian.jpg?osw=0.9.23", "72 种中草药药包配合专业技法沿经络推行，做完温暖、松开、轻盈。", "RM699"],
  ["艾灸", "tcm-moxa.jpg?osw=0.9.23", "温热艾灸一层层渗入，适合手脚冰冷和身体寒凉感。", "RM199"],
  ["草本泥灸", "tcm-mud.jpg?osw=0.9.23", "温热草本泥包覆调理，热感柔和包住身体，第一分钟就很舒服。", "RM199"],
  ["中医正骨调理", "tcm-bone.jpg?osw=0.9.23", "经中医师评估后，以传统正骨手法调理关节紧绷与体态疲劳。", "RM598"],
  ["女性私密养护", "tcm-intimate.jpg?osw=0.9.23", "女性专属私密护理，独立房间，女性专员全程一对一。", ""],
];
const specialties = [
  ["01 · 艾灸 / 泥灸 · RM199 · 每项", "温经散寒，行气通络，扶阳固本，适合寒湿性体质"],
  ["02 · 全身经络药拓调理 · RM699 · 特价", "72 种中草药药包配合专业技法疏通经络，进行全身舒缓养护"],
  ["03 · 中医正骨调理 · RM598", "经中医师评估，调理筋骨关节，改善疼痛"],
  ["04 · 药液筋膜松解（肩颈腰背）· RM499", "针对肩颈、腰背筋膜紧绷、酸麻胀痛进行专项调理"],
  ["05 · 体态与富贵包调理 · RM499", "驼背、圆肩、高低肩、富贵包及肩背体态调理"],
  ["06 · 刺络 · RM338", "减轻局部组织压力，疏通经络，调和气血，改善不适"],
  ["07 · 针灸 · RM598", "刺激穴位，缓解疼痛，改善功能失调，促进自我修复"],
  ["08 · 小针刀 · RM878", "用于松解慢性软组织黏连，针对肌肉骨骼疼痛进行松解调理"],
];
const physician = [
  ["针灸 · RM598", "由中医师按你的情况选择经络穴位进行细针刺激。"],
  ["小针刀 · RM878", "针对顽固劳损与粘连的深层松解，评估后由医师一对一操作。"],
  ["刺络 · RM338", "传统疗法，用于局部瘀滞、酸重不适。"],
];
const tcmInfo = {
  meridian: [
    ["项目内容", "72 种草本药包加热后，沿经络按压、滚动与推行。"],
    ["适合人群", "久坐久站、肩颈腰背紧、手脚冰冷或感觉身体沉重不通。"],
    ["须知", "这是养生舒缓护理，不是医疗治疗；怀孕、高血压或心脏病请提前告知。"],
  ],
  intimate: [
    ["项目内容", "围绕清洁、滋养与放松的一对一私密护理，在独立房间完成。"],
    ["适合人群", "产后日常养护、干涩不适或想做规律私密保养的女性。"],
    ["须知", "经期与怀孕期间不适合；若有持续症状，请先咨询医生。"],
  ],
};
const tcmFaqs = [
  ["需要提前预约吗？", "需要。每个 session 都是一对一，请 WhatsApp 锁定时段。"],
  ["把脉真的免费吗？", "是的，评估免费且没有强制消费；评估后会说明适合项目与价格。"],
  ["价格是最终价吗？", "列出的价格与店内菜单一致，实际以现场公示为准。"],
  ["针灸和小针刀谁操作？", "由中医师亲自操作，且必须先做把脉评估。"],
  ["女性私密养护是医疗服务吗？", "不是，这是日常舒适护理，不涉及医疗诊断或治疗。"],
  ["怎么联系？", "可以通过 WhatsApp、Telegram 或 WeChat 联系客服。"],
];

const faqRows: [string, string][] = [
  [
    "吉隆坡会所 在吉隆坡哪里？",
    "地址是 LG Floor, Viva Home Mall, 85 Jalan Loke Yew, Taman Miharja, 52200 Kuala Lumpur，靠近 Cheras 一带。",
  ],
  ["营业时间是几点？", "吉隆坡会所 是吉隆坡 24 小时SPA会所，全年无休，周末与公共假期照常营业。"],
  ["Viva Home Mall 有停车位吗？", "有，直接停在 Viva Home Mall，然后前往 LG Floor；Grab 或德士可在商场正门上下车。"],
  [
    "12 小时门票包含什么？",
    "从进场算起 12 小时，汤池、汗蒸房、桑拿、休息大厅与餐饮区都包含，毛巾与基本浴衣也有提供。",
  ],
  [
    "要怎么预约吉隆坡SPA或按摩？",
    "用 WhatsApp +60 14-315 5632 联系我们，Telegram 或 WeChat 也可以，告诉我们人数、日期和大概几点到。",
  ],
  ["真的可以待 12 小时？", "可以。从进场那一刻开始算满 12 小时，这段时间店里的设施都能随便用。"],
  ["星期日算平日还是周末？", "在我们这里算平日。星期日到星期四同属低价档，星期五、星期六和公共假期是另一档。"],
  ["公共假期怎么算钱？", "按周末那一档。不用自己算，日历上选好日期就会显示当天价格。"],
  ["普通成人入场怎么选？", "选择 12 小时普通入场即可。按摩、搓背、美容与中医项目另行加购。"],
  ["多人怎么买？", "每位大人各买一张12 小时单人入场，选择同一天同一时间即可。"],
  ["普通入场包含按摩吗？", "不包含。普通入场包含 12 小时停留与设施使用；按摩、搓背、美容与中医项目都是另外加购。"],
  ["价格怎么结算？", "页面列出普通价目，实际以现场公示为准。"],
  ["小孩可以来吗？", "可以。12 岁及以下买儿童票，并要有大人陪同；2 岁及以下在前台登记就好，不收费。"],
  ["情侣可以一起泡吗？", "除了浴区都可以。浴区是男女分开的，店里没有混浴。"],
  ["需要泳衣吗？会提供什么？", "浴区以裸浴为主，想穿泳衣也可以自己带。毛巾和基本浴服店里都有提供。"],
  ["可以过夜吗？", "在 12 小时之内于休息区睡一晚没问题，只是要记得这里是 spa，不是酒店。"],
  ["食物是 halal 吗？", "不是。我们的食物属于非 halal，也没有申请 halal 认证。"],
  ["可以带蛋糕或外食吗？", "蛋糕和外食都可以带进来，唯独酒精饮品不行。"],
  ["生日怎么算价？", "生日到店也按普通价格结算。"],
  ["网站上的照片是真的吗？", "网站上的氛围图片是 AI 生成的，只是让你感受一下环境的调性，不等于实际房间。想看真实照片，WhatsApp、Telegram 或 WeChat 跟客服说一声，我们会把汤池、休息区或你在考虑的房型的实拍发给你。"],
  ["需要提前多久预约？", "没有时间限制，出门前甚至路上跟我们说一声都行。我们只需要知道你要来、大概几点到，好把房间和技师安排好。"],
  ["到店需要带什么？", "带手机就够了，到前台把订单调出来给同事看。"],
  ["walk-in 和预约有差吗？", "有些福利只给预约的客人，周末又比较满，所以先在聊天里说一声比较稳，但没有最短提前时间。"],
];

function Money({ was, price, per }: { was?: string; price: string; per?: string }) {
  return (
    <span>
      {was ? <span className="was">{was}</span> : null}
      <span className="rm">
        <span className="cur">RM</span>
        {price}
        <sup className="osw-pp">++</sup>
        {per ? <span className="per">{per}</span> : null}
      </span>
    </span>
  );
}

function Band({ cn, en }: { cn: string; en: string }) {
  return (
    <div className="bandwrap-t">
      <div className="band">
        <b>{cn}</b>
        <span>{en}</span>
      </div>
    </div>
  );
}

function MiniGrid({ items }: { items: string[][] }) {
  return (
    <div className="minis">
      {items.map(([title, desc]) => (
        <article className="mini-card" key={title}>
          <h3>{title}</h3>
          <p className="desc">{desc}</p>
        </article>
      ))}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="chips">
      <div className="container">
        {items.map((chip) => (
          <span className="c" key={chip}>
            <Diamond />
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PackagesPageCn() {
  return (
    <>
      <Header active="Packages" locale="cn" />
      <main id="main-content" lang="zh-Hans">
        <Hero
          eyebrow="吉隆坡会所 · 吉隆坡 · 24 小时营业"
          title={<>吉隆坡SPA价目与价格</>}
          copy="这里只列普通入场与常规加项价目，页面不展示特别活动。"
          image="hero-packages-rain.jpg?osw=0.9.23"
        />

        <nav className="subnav" aria-label="Sections">
          <div className="row">
            <a className="pill on" href="#featured">普通入场</a>
            <a className="pill" href="#treatments">按摩</a>
            <a className="pill" href="#drinks">酒水桶</a>
            <a className="pill" href="#room">私人房</a>
            <a className="pill" href="#know">到店说明</a>
          </div>
        </nav>

        <section className="trust">
          <div className="container">
            <div className="t"><span className="dia" />可通过 WhatsApp、Telegram 或 WeChat 联系客服</div>
            <div className="t"><span className="dia" />从 check-in 起 12 小时，泡池、汗蒸、休息区与餐饮都包含</div>
            <div className="t"><span className="dia" />按摩、搓背、美容与中医项目为另外加购</div>
          </div>
        </section>

        <div className="osw-onsen-crosslink">
          <div className="container crosslinks">
            <a className="osw-product-text-link" href={`${cnBase}/wenquan/`}>吉隆坡 24 小时汤泉</a>
            <a className="osw-product-text-link" href={`${cnBase}/facilities/`}>完整价格与设施列表</a>
          </div>
        </div>

        <section id="featured">
          <SectionHead eyebrow="普通价目" title="普通入场价格" />
          <div className="container">
            <div className="cards">
              {packageCards.map((item) => (
                <article className="card" id={item.id} key={item.id}>
                  <div className="ph"><img src={experienceImage(item.image)} alt={item.title} loading="lazy" decoding="async" /></div>
                  <div className="body">
                    <div className="tagrow"><span className="tag">{item.tag}</span></div>
                    <h3>{item.title}</h3>
                    <p className="desc">{item.desc}</p>
                    <div className="prices">
                      {item.prices.map((row) => (
                        <div className="prow" key={row.label}>
                          <span className="lbl">{row.label}</span>
                          <span className="dots" />
                          <Money was={row.was} price={row.price} per={row.per} />
                        </div>
                      ))}
                    </div>
                    <p className="taxnote">++ = 10% 服务费 + 8% SST；选完日期后显示到手价</p>
                    <ul className="feat">{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                    {item.notes.map((note) => <div className="note soft" key={note}>{note}</div>)}
                    <div className="grow" />
                    <button
                      className="btn wide"
                      type="button"
                      data-book={item.id.replace("pk-", "")}
                      data-book-locale="cn"
                    >
                      {item.button}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="treatments">
          <SectionHead eyebrow="按摩与护理" title="加一项护理" sub="按摩、足疗、搓背等项目为普通加购价目，请先向客服确认档期。" />
          <div className="container">
            <div className="deal">以下为常规护理价目，所有项目按普通价目计算。</div>
            {treatmentGroups.map((group) => (
              <div key={group.en}>
                <Band cn={group.cn} en={group.en} />
                <div className="tlist">
                  {group.rows.map(([name, time, price]) => (
                    <div className="trow" key={name}>
                      <span className="nm">{name}</span>
                      <span className="min">{time}</span>
                      <span className="dots" />
                      <span className="rm">{price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="legend">++ = 10% 服务费 + 8% SST；最终金额由客服或前台确认。</p>
          </div>
        </section>

        <section id="drinks">
          <SectionHead eyebrow="酒水桶" title="派对酒水桶" sub="这里没人一杯一杯点。酒水桶 1.5L 起跳，球赛夜、私人房或聚会刚好够喝。" />
          <div className="container">
            <Band cn="酒水桶" en="Drink Barrels · 1.5L / 3L" />
            <div className="tlist">
              {drinkRows.map(([name, small, large]) => (
                <div className="trow" key={name}>
                  <span className="nm">{name}</span>
                  <span className="min">{small}</span>
                  <span className="dots" />
                  <span className="rm">{large}</span>
                </div>
              ))}
            </div>
            <p className="legend">可到店或 WhatsApp 点单 · 可在餐厅、影视厅或私人房享用 · 不可带外酒 · 价格未含 10% 服务费与 8% SST</p>
          </div>
        </section>

        <section id="room">
          <SectionHead eyebrow="私人房" title="私人房体验" />
          <div className="container">
            <div className="cards rooms">
              {rooms.map((room) => (
                <article className="card" id={room.id} key={room.id}>
                  <div className="ph"><img src={experienceImage(room.image)} alt={room.title} loading="lazy" decoding="async" /></div>
                  <div className="body">
                    <h3>{room.title}</h3>
                    <div className="roomprice">
                      <span className="big"><span className="cur">RM</span>{room.big}</span>
                      <span className="cap">{room.cap}</span>
                    </div>
                    {room.hourly.map(([label, price]) => (
                      <div className="hourly" key={label}><span>{label}</span><span className="dots" /><span className="rm">{price}</span></div>
                    ))}
                    <p className="taxnote">价格未含 10% 服务费与 8% SST，到店结算</p>
                    <ul className="feat">{room.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                    <div className="grow" />
                    <div className="contact-pair room-contact-pair"><a className="btn contact-wa wide" href={whatsappHrefCn} target="_blank" rel="noopener">WhatsApp 预约</a><a className="btn contact-tg wide" href={telegramHrefCn} target="_blank" rel="noopener">Telegram 预约</a></div>
                  </div>
                </article>
              ))}
            </div>
            <ul className="knowrules">
              <li>私人房只通过 WhatsApp 预约（{whatsappNumberDisplay}），不在线上售卖</li>
              <li>按房收费；入场票与护理项目另计</li>
              <li>到店时间、房型与最终价格由客服确认</li>
            </ul>
          </div>
        </section>

        <section id="know">
          <SectionHead eyebrow="到店说明" title="来之前可以先看" />
          <div className="container">
            <div className="knowwrap">
              <div className="know">
                <div className="t"><span className="dia" />普通入场为 12 小时使用，时间从 check-in 开始计算。</div>
                <div className="t"><span className="dia" />价格未含 10% 服务费与 8% SST，实际以现场公示为准。</div>
                <div className="t"><span className="dia" />按摩、搓背、美容与中医项目为另外加购，可先向客服咨询。</div>
                <div className="t"><span className="dia" />私人房、酒水桶与加项内容以现场供应和门店安排为准。</div>
              </div>
              <div className="policylinks">
                <a href={`${cnBase}/terms-conditions/`}><span>条款与细则</span></a>
                <a href={`${cnBase}/privacy-policy/`}><span>隐私政策</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </>
  );
}

export function FacilitiesPageCn() {
  return (
    <>
      <Header active="Facilities" locale="cn" />
      <main id="main-content" lang="zh-Hans">
        <Hero eyebrow="吉隆坡会所 · 设施" title={<>吉隆坡会所的设施都在这里</>} copy="汤池、汗蒸房、桑拿、休息厅、影视区到餐饮，一张票全部用足 12 小时。" image="fac-hero-immersive.jpg?osw=0.9.23" />
        <section id="facilities">
          <div className="container fac-page-grid">
            <div className="fac-grid">
              {facilities.map(([title, image, copy], index) => (
                <article className={`fac${index === 0 ? " lead" : ""}`} key={title}>
                  <div className="ph"><img src={experienceImage(image)} alt={title} loading="lazy" decoding="async" /></div>
                  <div className="fb">
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    {["护理房", "古法搓背", "足部护理房", "护理房"].includes(title) ? <a className="more" href={`${cnBase}/packages/#treatments`}>看按摩项目与价格 &rsaquo;</a> : null}
                    {title === "高尔夫主题房" ? <a className="more" href={`${cnBase}/packages/#room`}>看房间价格 &rsaquo;</a> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="treatments-teaser">
          <SectionHead eyebrow="护理项目" title="20 项按摩与护理" sub="足疗、耳疗、拔罐、刮痧到招牌疗程都有，价格全部公开写在价目页上。" />
          <div className="center-cta"><a className="btn line" href={`${cnBase}/packages/#treatments`}>看按摩项目与价格</a></div>
        </section>
      </main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </>
  );
}

export function HomeMassagePageCn() {
  return (
    <div className="osw-outcall">
      <Header active="Home Service" locale="cn" />
      <main id="main-content" lang="zh-Hans">
        <Hero eyebrow="吉隆坡会所 · 上门服务 · 吉隆坡" title={<>店里的按摩，<br />到你家</>} copy="店里的那批技师，现在也出门。酒店、公寓或住家都能去，按摩油和一次性床单毛巾由技师带齐，在你自己的床上铺好就开始。家具不用挪，你只要躺下。" image="outcall-hero.jpg?osw=0.9.23">
          <a className="btn clay" href="#outcall-plans">看价目</a>
          <ContactButtons locale="cn" className="hero-contact-pair" whatsappLabel="WhatsApp 咨询" telegramLabel="Telegram 咨询" />
        </Hero>
        <Chips items={homeChips} />
        <section id="outcall-plans">
          <SectionHead eyebrow="服务与价格" title="三个服务，价格清楚" sub="价格都写在上面，没有别的名目。只加 8% SST，不收服务费；30km 以内收 RM100 车马费，技师到了现金付。" />
          <div className="container">
            <div className="cards">
              {homePlans.map((plan) => (
                <article className={`card${plan.night ? " night" : ""}`} key={plan.title}>
                  <div className="ph"><img src={experienceImage(plan.image)} alt={plan.title} loading="lazy" decoding="async" /></div>
                  <div className="body">
                    <div className="tagrow"><span className={`tag${plan.night ? " hot" : ""}`}>{plan.tag}</span></div>
                    <h3>{plan.title}</h3>
                    <p className="desc">{plan.desc}</p>
                    <div className="grow">
                      <div className="price"><span className="rm">{plan.price}</span></div>
                      <p className="taxnote">价格只需加 8% SST，不收服务费。RM100 交通费到场现金支付。</p>
                      <ul className="feat">{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                    </div>
                    <div className="btnrow outcall-actions">
                      <button className="btn" type="button" data-book={plan.code} data-book-locale="cn">查询空档 · {plan.price}</button>
                      <ContactButtons locale="cn" className="outcall-contact-pair" whatsappLabel="WhatsApp 咨询" telegramLabel="Telegram 咨询" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="fine">价格只需加 8% SST，不收服务费。30km 内 RM100 交通费到场现金支付。</p>
          </div>
        </section>
        <section id="outcall-flow">
          <SectionHead eyebrow="预约流程" title="一个对话，从头到尾" />
          <div className="container"><MiniGrid items={homeFlow} /></div>
        </section>
        <section id="outcall-faq">
          <SectionHead eyebrow="预约前" title="上门服务 FAQ" />
          <div className="container">
            <div className="faqwrap">
              <div className="faq">{homeFaqs.map(([question, answer]) => <details key={question}><summary>{question}<span className="plus" /></summary><div className="a">{answer}</div></details>)}</div>
              <div className="center-cta faq-cta"><p className="fine">还有其他问题？</p><ContactButtons locale="cn" whatsappLabel="WhatsApp 咨询" telegramLabel="Telegram 咨询" /></div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </div>
  );
}

export function BeautyPageCn() {
  return (
    <>
      <Header active="Beauty" locale="cn" />
      <main id="main-content" lang="zh-Hans">
        <Hero eyebrow="吉隆坡会所 · 美容部 · 吉隆坡" title={<>美容护理，现在也在 吉隆坡会所</>} copy="美容项目按普通价目咨询确认。另外还有光子嫩肤、淡斑护理与冰点脱毛，都要先预约。" image="beauty-hero.jpg?osw=0.9.23" />
        <Chips items={beautyChips} />
        <section id="beauty-signature">
          <SectionHead eyebrow="美容价目" title="身体焕亮水光护理" sub="身体焕亮、水光面部与手部护理，请先咨询确认价格与时段。" />
          <div className="container"><MiniGrid items={signature} /><div className="deal">价格与时段请 WhatsApp 或 Telegram 咨询</div><div className="center-cta"><ContactButtons locale="cn" whatsappLabel="WhatsApp 预约" telegramLabel="Telegram 预约" /></div></div>
        </section>
        <section id="beauty-light">
          <SectionHead eyebrow="光电项目" title="三项护理，咨询后定制" sub="每项都会按皮肤与部位定制，现场咨询后确认价格，无隐藏收费。" />
          <div className="container"><div className="fac-grid">{lightTreatments.map(([title, image, desc]) => <article className="fac" key={title}><div className="ph"><img src={experienceImage(image)} alt={title} loading="lazy" decoding="async" /></div><div className="fb"><h3>{title}</h3><p>{desc}</p></div></article>)}</div></div>
        </section>
        <section id="beauty-facial">
          <SectionHead eyebrow="深层护理" title="完整面部管理" sub="从深层清洁到最后修复面膜，一次完整重置面部状态。" />
          <div className="container"><MiniGrid items={facial} /><div className="deal">价格与时段请 WhatsApp 或 Telegram 咨询</div><div className="center-cta"><ContactButtons locale="cn" whatsappLabel="WhatsApp 咨询" telegramLabel="Telegram 咨询" /></div></div>
        </section>
        <section id="beauty-team"><SectionHead eyebrow="你的专员" title="一对一美容专员" /><div className="container"><div className="deal text-left">每项护理都由驻店美容专员一对一完成，光电项目前会先做皮肤评估。</div></div></section>
        <section id="beauty-faq">
          <SectionHead eyebrow="预约前" title="美容部 FAQ" />
          <div className="container"><div className="faqwrap"><div className="faq">{beautyFaqs.map(([question, answer]) => <details key={question}><summary>{question}<span className="plus" /></summary><div className="a">{answer}</div></details>)}</div><div className="center-cta faq-cta"><p className="fine">还有其他问题？</p><ContactButtons locale="cn" whatsappLabel="WhatsApp 咨询" telegramLabel="Telegram 咨询" /></div></div></div>
        </section>
      </main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </>
  );
}

export function TcmPageCn() {
  return (
    <>
      <Header active="TCM" locale="cn" />
      <main id="main-content" lang="zh-Hans">
        <Hero eyebrow="吉隆坡会所 · 中医部 · 吉隆坡" title={<>中医养生，现在也在 吉隆坡会所</>} copy="驻店中医师先免费把脉，再谈要不要做。针灸、艾灸、草本泥灸与正骨调理都有，价格公开，WhatsApp 就能约。" image="tcm-hero.jpg?osw=0.9.23" />
        <Chips items={tcmChips} />
        <section id="tcm-pulse"><SectionHead eyebrow="免费体验" title="免费中医把脉" sub="一对一看你的体质和眼下的状态，评估完才谈该怎么调。" /><div className="container"><div className="deal"><b>全身药拓 · 肩颈脊柱调理 · 睡眠压力调理 · 药膳茶饮搭配</b></div><div className="center-cta"><ContactButtons locale="cn" whatsappLabel="预约免费把脉" telegramLabel="Telegram 预约" /></div></div></section>
        <section id="tcm-services"><SectionHead eyebrow="养生项目" title="五项传统护理，先约先得" sub="每个 session 都是一对一；列出的价格为普通价目，可先向客服咨询。" /><div className="container"><div className="fac-grid">{tcmTreatments.map(([title, image, desc, price]) => <article className="fac" key={title}><div className="ph"><img src={experienceImage(image)} alt={title} loading="lazy" decoding="async" /></div><div className="fb"><h3>{title}</h3><p>{desc}</p>{price ? <p><b>{price}</b></p> : null}</div></article>)}</div></div></section>
        <section id="targeted-care"><SectionHead eyebrow="中医调理 · CHINESE MEDICINE CARE" title="Traditional Chinese Medicine Specialties" sub="由中医师评估后安排的一对一传统调理" /><div className="container"><MiniGrid items={specialties} /><div className="deal">具体项目、时长及适用情况，以中医师现场评估为准</div><div className="center-cta"><ContactButtons locale="cn" whatsappLabel="WhatsApp 预约" telegramLabel="Telegram 预约" /></div></div></section>
        <section id="physician"><SectionHead eyebrow="医师项目" title="中医师操作项目" sub="针灸、小针刀与刺络均由中医师亲自操作，必须先把脉评估。" /><div className="container"><MiniGrid items={physician} /><div className="deal">列出的价格为普通价目，先免费把脉，适合才继续。</div><div className="center-cta"><ContactButtons locale="cn" whatsappLabel="预约医师项目" telegramLabel="Telegram 预约" /></div></div></section>
        <section id="meridian"><SectionHead eyebrow="招牌项目" title="全身经络药拓调理" sub="以十二经络为引导的全身温热调理，从紧到松，从冷到暖。" /><div className="container"><MiniGrid items={tcmInfo.meridian} /><div className="deal"><b>RM699</b> · 普通价目；请 WhatsApp 或 Telegram 咨询</div><div className="center-cta"><ContactButtons locale="cn" whatsappLabel="WhatsApp 预约" telegramLabel="Telegram 预约" /></div></div></section>
        <section id="intimate"><SectionHead eyebrow="女士专属" title="女性私密养护" sub="干净、专业、完全私密的女性护理。" /><div className="container"><MiniGrid items={tcmInfo.intimate} /><div className="deal">价格与时段请 WhatsApp 或 Telegram 咨询</div><div className="center-cta"><ContactButtons locale="cn" whatsappLabel="WhatsApp 预约" telegramLabel="Telegram 预约" /></div></div></section>
        <section id="tea"><SectionHead eyebrow="药食同源" title="中医草本茶饮" sub="中医部新鲜煮制草本茶，泡汤间隙可到店点，不需要预约。" /><div className="container"><div className="deal">护肝茶 RM29 · 祛湿茶 RM29 · 补肾茶 RM39 · 清肺茶 RM28 · 暖宫茶 RM28</div></div></section>
        <section id="tcm-team"><SectionHead eyebrow="你的调理师" title="中医师与康复调理师" /><div className="container"><div className="deal text-left">中医部由中医师与康复调理师驻店。医师项目会在把脉评估后由中医师亲自操作。</div></div></section>
        <section id="tcm-faq"><SectionHead eyebrow="预约前" title="中医部 FAQ" /><div className="container"><div className="faqwrap"><div className="faq">{tcmFaqs.map(([question, answer]) => <details key={question}><summary>{question}<span className="plus" /></summary><div className="a">{answer}</div></details>)}</div><div className="center-cta faq-cta"><p className="fine">还有其他问题？</p><ContactButtons locale="cn" whatsappLabel="WhatsApp 咨询" telegramLabel="Telegram 咨询" /></div></div></div></section>
      </main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </>
  );
}

export function FaqPageCn() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqRows)} />
      <Header active="FAQ" locale="cn" />
      <main id="main-content" lang="zh-Hans"><section id="faq"><SectionHead eyebrow="到店前" title="FAQ · 吉隆坡会所"sub="价格、设施、儿童票、停车与到店流程都在这里。还有不清楚，直接 WhatsApp 找真人。" /><div className="container"><div className="faqwrap"><div className="faq">{faqRows.map(([question, answer], index) => <details open={index === 0} key={question}><summary>{question}<span className="plus" /></summary><div className="a">{answer}</div></details>)}</div></div></div></section></main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </>
  );
}

const visitNotesCn: [string, string][] = [
  ["地址", "吉隆坡 Viva Home Mall LG Floor，85 Jalan Loke Yew, Taman Miharja, 52200 Kuala Lumpur，位于 Cheras 一带，从武吉免登与 KLCC 开车很快到。"],
  ["营业时间", "全年无休，每天 24 小时营业，周末与公共假期照常。"],
  ["停车", "直接停在 Viva Home Mall，再前往 LG Floor；Grab 或德士可在商场正门上下车。"],
  ["联系方法", "WhatsApp、Telegram 或 WeChat 找我们，说明人数、日期和大概到店时间即可。"],
  ["门票包含", "从进场算起 12 小时，汤池、汗蒸房、桑拿、休息大厅与餐饮区都包含，毛巾与基本浴衣有提供。"],
  ["按摩与护理", "按摩、搓背、美容与中医项目为另外加购，页面列明的是普通价目。"],
];

export function ContactPageCn() {
  return (
    <>
      <Header active="Contact" locale="cn" />
      <main id="main-content" lang="zh-Hans">
        <section id="contact">
          <SectionHead eyebrow="吉隆坡会所 · 联系我们" title="来找我们" />
          <div className="container">
            <div className="cinfo-wrap">
              <div className="cinfo"><span className="ck">地址</span><span className="cv">LG Floor, Viva Home Mall, 85 Jalan Loke Yew, Taman Miharja, 52200 Kuala Lumpur</span></div>
              <div className="cinfo"><span className="ck">营业时间</span><span className="cv">每天 24 小时营业</span></div>
              <div className="cinfo"><span className="ck">WhatsApp</span><span className="cv"><a href={whatsappHrefCn} target="_blank" rel="noopener">{whatsappNumberDisplay}（点击聊天）</a></span></div>
              <div className="cinfo"><span className="ck">Telegram</span><span className="cv"><a href={telegramHrefCn} target="_blank" rel="noopener">{telegramDisplay}（点击聊天）</a></span></div>
              <div className="cinfo"><span className="ck">WeChat</span><span className="cv"><button type="button" data-wechat-copy={wechatId} data-copy-label={`WeChat ID ${wechatId}`} data-copied-label="已复制 WeChat ID">WeChat ID {wechatId}（点击复制）</button></span></div>
            </div>
            <div className="btnrow contact-actions">
              <a className="btn" href={googleBusinessProfileUrl} target="_blank" rel="noopener">打开 Google Maps</a>
              <a className="btn line" href="https://waze.com/ul?q=Kuala Lumpur Club%20Viva%20Home%20Mall" target="_blank" rel="noopener">打开 Waze</a>
            </div>
            <div className="deal contact-note"><b>唯一门店</b> - 吉隆坡会所 只有这一间门店，位于吉隆坡 Taman Miharja 的 Viva Home Mall LG Floor。我们没有分店，请导航到以上地址。</div>
          </div>
        </section>

        <section id="visit">
          <SectionHead eyebrow="到店前" title="怎么来吉隆坡会所SPA会所" sub="营业时间、停车、预约流程与门票包含什么。" />
          <div className="container"><div className="knowwrap"><div className="know">{visitNotesCn.map(([head, body]) => <div className="t" key={head}><span className="dia" /><b>{head}</b>：{body}</div>)}</div></div></div>
        </section>
      </main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </>
  );
}

export function PolicyPageCn({ title, eyebrow, rows }: { title: string; eyebrow: string; rows: string[][] }) {
  return (
    <>
      <Header active="FAQ" locale="cn" />
      <main id="main-content" lang="zh-Hans"><section><SectionHead eyebrow={eyebrow} title={title} /><div className="container"><div className="knowwrap"><div className="know">{rows.map(([head, body]) => <div className="t" key={head}><span className="dia" /><b>{head}</b>：{body}</div>)}</div></div></div></section></main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </>
  );
}

export function OnsenPageCn() {
  return (
    <>
      <Header active="Facilities" locale="cn" />
      <main id="main-content" lang="zh-Hans">
        <Hero eyebrow="吉隆坡会所 · 中式汤泉" title={<>吉隆坡 24 小时温泉汤泉</>} copy="热汤泡开，汗蒸或桑拿出汗，再进冰池收一收。一轮一轮来，12 小时够你慢慢泡、慢慢躺。" image="hero-onsen-warm.jpg" />
        <section><SectionHead eyebrow="泡法" title="汤池 · 蒸房 · 冷池" sub="按自己的节奏循环，不赶时间。" /><div className="container"><MiniGrid items={[["热汤", "先泡进去，让身体从里面暖起来。"], ["汗蒸或桑拿", "发一身透汗，把绷着的地方松开。"], ["冰池", "短短几秒冷下来，人立刻清醒。"]]} /></div></section>
      </main>
      <Footer locale="cn" />
      <FloatingWhatsApp locale="cn" />
    </>
  );
}
