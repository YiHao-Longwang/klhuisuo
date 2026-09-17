import type { ReactNode } from "react";

/** Renders a structured-data block (see faqJsonLd / localBusinessJsonLd in seo.ts). */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const assetBase = "/assets";

/** Original commissioned atmosphere images; never serve the previous photo set. */
export function experienceImage(source: string) {
  if (/steam|salt/.test(source)) return "/assets/generated/steam.jpg";
  if (/tcm|meridian|moxa|mud|bone|intimate/.test(source)) return "/assets/generated/herbal-room.jpg";
  if (/beauty|photon|spot|hair/.test(source)) return "/assets/generated/beauty-suite.jpg";
  if (/locker|grooming/.test(source)) return "/assets/generated/grooming-room.jpg";
  if (/massage|scrub|treatment|outcall|daytime|solo/.test(source)) return "/assets/generated/treatment-room.jpg";
  if (/dining|vip/.test(source)) return "/assets/generated/dining-room.jpg";
  if (/golf/.test(source)) return "/assets/generated/golf-room.jpg";
  if (/movie|recliner/.test(source)) return "/assets/generated/rest-lounge.jpg";
  if (/immersive|corridor/.test(source)) return "/assets/generated/light-corridor.jpg";
  return "/assets/generated/bath-pool.jpg";
}

/**
 * Brand naming. Kept in one place so the outlet name never drifts between
 * pages. Deliberately distinct from other similarly named listings; see the
 * note on sameAsProfiles in seo.ts.
 */
export const brandEn = "Kuala Lumpur Club";
export const brandCn = "吉隆坡会所";
export const brandFull = `${brandEn} ${brandCn}`;
export const whatsappNumberDisplay = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+60 14-315 5632";
const whatsappDigits = whatsappNumberDisplay.replace(/\D/g, "");
const whatsappBase = `https://wa.me/${whatsappDigits}`;
export const whatsappCartBase = `${whatsappBase}?text=`;
export const whatsappHref = `${whatsappBase}?text=Hi%2C%20I%20would%20like%20to%20ask%20about%20the%20prices`;
export const whatsappHrefCn = `${whatsappBase}?text=%E4%BD%A0%E5%A5%BD%EF%BC%8C%E6%88%91%E6%83%B3%E4%BA%86%E8%A7%A3%E4%BB%B7%E7%9B%AE`;
export const telegramHref = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/nhlg09";
export const telegramHrefCn = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/nhlg09";
export const telegramDisplay = telegramHref.replace(/^https?:\/\/t\.me\//, "@").replace(/\/$/, "");
export const wechatId = process.env.NEXT_PUBLIC_WECHAT_ID || "Longwang1918";

export const navItems = [
  ["Home", "/"],
  ["Facilities", "/facilities/"],
  ["Prices", "/packages/"],
  ["TCM", "/tcm/"],
  ["Beauty", "/beauty/"],
  ["Home Service", "/home-massage/"],
  ["Contact", "/contact/"],
  ["FAQ", "/faq/"],
  ["技师挑选", "/jishi-tiaoxuan/"],
];
const cnNavItems = [
  ["Home", "首页", "/"],
  ["Facilities", "汤泉空间", "/facilities/"],
  ["Packages", "普通价目", "/packages/"],
  ["TCM", "中医调理", "/tcm/"],
  ["Beauty", "美容护理", "/beauty/"],
  ["Home Service", "上门按摩", "/home-massage/"],
  ["Contact", "来访指引", "/contact/"],
  ["FAQ", "常见问题", "/faq/"],
  ["技师挑选", "技师挑选", "/jishi-tiaoxuan/"],
];
const navLabels: Record<string, string> = {
  Facilities: "The bathhouse", Packages: "Prices", TCM: "TCM wellness",
  Beauty: "Beauty", "Home Service": "At home", Contact: "Visit us",
};

export const footerPolicies = [
  ["Terms & Conditions", "/terms-conditions/"],
  ["Privacy Policy", "/privacy-policy/"],
];

const footerPoliciesCn = [
  ["条款与细则", "/terms-conditions/"],
  ["隐私政策", "/privacy-policy/"],
];

const footerHighlights = ["Open 24 Hours", "12-Hour Stay", "Viva Home Mall KL"];
const footerHighlightsCn = ["24 小时营业", "12 小时任你待", "Viva Home Mall KL"];

const footerExperienceLinks = [
  ["Prices", "/packages/"],
  ["Facilities", "/facilities/"],
  ["Home Massage", "/home-massage/"],
  ["Beauty Studio", "/beauty/"],
  ["TCM Wellness", "/tcm/"],
];

const footerExperienceLinksCn = [
  ["价目", "/packages/"],
  ["设施", "/facilities/"],
  ["上门按摩", "/home-massage/"],
  ["美容部", "/beauty/"],
  ["中医部", "/tcm/"],
];

/**
 * Public profiles for this outlet. Keep in sync with sameAsProfiles in seo.ts.
 */
const socialLinks = [
  ["Instagram", "https://www.instagram.com/vivadespa/"],
  ["Telegram", telegramHref],
  ["WeChat", `#wechat-${wechatId}`],
];

type Locale = "en" | "cn";

/**
 * Wordmark. Set in type so this visual system is not tied to another outlet's
 * image mark. Pass tone="cream" on dark ground.
 */
export function Brandmark({ tone = "ink" }: { tone?: "ink" | "cream" }) {
  return (
    <span className={`brandmark${tone === "cream" ? " on-dark" : ""}`} aria-hidden="true">
      <img className="brandmark-logo" src="/assets/klhuisuo-logo.jpeg" alt="" loading="eager" decoding="async" />
      <span className="brandmark-copy">
        <span className="brandmark-cn">{brandCn}</span>
        <span className="brandmark-en">{brandEn}</span>
      </span>
    </span>
  );
}

export function Diamond() {
  return <span className="dia" aria-hidden="true" />;
}

export function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M21 11.6a8.4 8.4 0 0 1-12.3 7.4L4 20l1.1-4.4A8.4 8.4 0 1 1 21 11.6Z" />
      <path d="M8.8 10.2c.5 1.9 2.1 3.5 4 4l1.3-1.2 2.1 1" />
    </svg>
  );
}

export function TelegramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M21 4 3.7 10.8c-.8.3-.8 1.4.1 1.6l4.3 1.3 1.7 5.2c.3.8 1.3 1 1.8.3l2.5-3.3 4.7 3.5c.7.5 1.7.1 1.9-.8L23 5.2c.2-.9-.9-1.6-1.6-1.2Z" />
      <path d="m8.2 13.7 6.7-4.2-5.1 5.8" />
    </svg>
  );
}

export function WeChatIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M10.5 18.5a8 6.2 0 1 1 7.6-4.2" />
      <path d="M14 16.6a5.1 4.1 0 1 0 4.7-2.6" />
      <path d="m8.2 18.3-3 .9.9-2" />
      <path d="m18 20.1 2.4.7-.7-1.7" />
      <path d="M7.8 10h.1M12 10h.1M16.2 17h.1M19.2 17h.1" />
    </svg>
  );
}

export function ContactButtons({
  locale = "cn",
  className = "",
  whatsappLabel,
  telegramLabel,
  wechatLabel,
}: {
  locale?: Locale;
  className?: string;
  whatsappLabel?: string;
  telegramLabel?: string;
  wechatLabel?: string;
}) {
  const isCn = locale === "cn";
  return (
    <div className={`contact-pair ${className}`.trim()}>
      <a className="btn contact-wa" href={isCn ? whatsappHrefCn : whatsappHref} target="_blank" rel="noopener">
        <WhatsAppIcon />
        {whatsappLabel ?? (isCn ? "WhatsApp 咨询" : "WhatsApp Us")}
      </a>
      <a className="btn contact-tg" href={isCn ? telegramHrefCn : telegramHref} target="_blank" rel="noopener">
        <TelegramIcon />
        {telegramLabel ?? (isCn ? "Telegram 咨询" : "Telegram Us")}
      </a>
      <button
        className="btn contact-wx"
        type="button"
        data-wechat-copy={wechatId}
        data-copy-label={wechatLabel ?? `WeChat ${wechatId}`}
        data-copied-label={isCn ? "已复制 WeChat ID" : "WeChat ID copied"}
      >
        <WeChatIcon />
        {wechatLabel ?? `WeChat ${wechatId}`}
      </button>
    </div>
  );
}

export function Header({ active = "Home", locale = "cn" }: { active?: string; locale?: Locale }) {
  const isCn = locale === "cn";
  const items = isCn
    ? cnNavItems.map(([key, label, href]) => ({ key, label, href }))
    : navItems.map(([label, href]) => ({ key: label, label: navLabels[label] ?? label, href }));

  return (
    <header className="topbar" lang={isCn ? "zh-Hans" : "en"}>
      <a className="skip-link" href="#main-content">{isCn ? "跳到主要内容" : "Skip to content"}</a>
      <div className="container">
        <a className="brand" href="/" aria-label={brandFull}>
          <Brandmark />
        </a>
        <nav className="nav" aria-label="Primary navigation">
          {items.filter(({ key }) => !["Home", "FAQ", "技师挑选"].includes(key)).map(({ key, label, href }) => (
            <a className={key === active ? "on" : undefined} aria-current={key === active ? "page" : undefined} href={href} key={key}>
              {label}
            </a>
          ))}
        </nav>
        <div className="top-right">
          <button className="mobile-tech-link promo-tech-link" type="button" data-tech-inquiry aria-label="最新 男士必看 技师挑选">
            <span className="promo-kicker">
              <strong>最新!!</strong> 男士必看
            </span>
            <span className="promo-main">技师挑选</span>
          </button>
          <details className="mnav">
            <summary aria-label="Menu">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <nav className="mnav-list" aria-label="Mobile navigation">
              {items.map(({ key, label, href }) => (
                key === "技师挑选" ? (
                  <button type="button" data-tech-inquiry key={key}>
                    {label}
                  </button>
                ) : (
                  <a href={href} key={key}>
                    {label}
                  </a>
                )
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Hero({
  eyebrow,
  title,
  copy,
  image,
  imageAlt,
  locale = "cn",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  image: string;
  imageAlt?: string;
  locale?: Locale;
  children?: ReactNode;
}) {
  const defaultAlt =
    locale === "cn"
      ? `${brandFull} — 吉隆坡 24 小时SPA汤泉会所`
      : `${brandFull} - 24 hour spa and hot spring in Kuala Lumpur`;

  return (
    <section className="hero chapter-hero" lang={locale === "cn" ? "zh-Hans" : "en"}>
      <div className="container">
        <div className="k">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{copy}</p>
        {children ? <div className="cta">{children}</div> : null}
      </div>
      <figure className="chapter-image"><img className="hero-img" src={experienceImage(image)} alt={imageAlt ?? defaultAlt} fetchPriority="high" decoding="async" /><figcaption>{locale === "cn" ? `${brandCn} · 汤泉手记` : `${brandEn.toUpperCase()} · THE BATHHOUSE JOURNAL`}</figcaption></figure>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="sec-head" data-reveal>
      <div className="k">{eyebrow}</div>
      <h2>{title}</h2>
      {sub ? <p className="sub">{sub}</p> : null}
      <div className="divider">
        <Diamond />
      </div>
    </div>
  );
}

export function Footer({ locale = "cn" }: { locale?: Locale }) {
  const isCn = locale === "cn";
  const items = isCn ? cnNavItems.map(([, label, href]) => [label, href]) : navItems;
  const policies = isCn ? footerPoliciesCn : footerPolicies;
  const highlights = isCn ? footerHighlightsCn : footerHighlights;
  const experiences = isCn ? footerExperienceLinksCn : footerExperienceLinks;

  return (
    <footer className="site" id="contact" lang={isCn ? "zh-Hans" : "en"}>
      <div className="container fwrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Brandmark tone="cream" />
            <div>
              <div className="slogan">
                {isCn ? "一间不打烊的" : "A Kuala Lumpur Bathhouse"}
                <br />
                {isCn ? "吉隆坡 24 小时温泉会所" : "That Never Closes"}
              </div>
              <p className="footer-copy">
                {isCn
                  ? `${brandCn}，吉隆坡 24 小时温泉会所，集合泡汤、按摩、美容、中医调理与私人养生护理。可通过 WhatsApp、Telegram 或 WeChat 联系客服。`
                  : `${brandFull} is a warm, all-hours retreat for hot spring bathing, massage, beauty, TCM and private wellness sessions in Kuala Lumpur. Contact us on WhatsApp, Telegram or WeChat.`}
              </p>
            </div>
          </div>

          <div className="footer-cta">
            <ContactButtons
              locale={locale}
              className="footer-contact-pair"
              whatsappLabel={`WhatsApp ${whatsappNumberDisplay}`}
              telegramLabel={isCn ? "Telegram 咨询" : "Telegram Us"}
            />
            <a className="footer-secondary" href="/packages/">
              {isCn ? "看价目" : "View Prices"}
            </a>
          </div>
        </div>

        <div className="footer-highlights" aria-label={isCn ? `${brandCn}亮点` : `${brandEn} highlights`}>
          {highlights.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="cols footer-grid">
          <div className="col footer-link-col">
            <h6>{isCn ? "浏览" : "Explore"}</h6>
            {items.map(([label, href]) => (
              label === "技师挑选" ? (
                <button type="button" data-tech-inquiry key={label}>
                  {label}
                </button>
              ) : (
                <a href={href} key={label}>
                  {label}
                </a>
              )
            ))}
          </div>
          <div className="col footer-link-col">
            <h6>{isCn ? "项目" : "Experiences"}</h6>
            {experiences.map(([label, href]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </div>
          <div className="col footer-visit-col">
            <h6>{isCn ? "地址" : "Visit"}</h6>
            <p>
              LG Floor, Viva Home Mall,
              <br />
              85 Jalan Loke Yew, Taman Miharja, 52200 Kuala Lumpur
            </p>
            
            <div className="footer-social">
              <h6>{isCn ? "关注我们" : "Follow Us"}</h6>
              <div className="footer-social-row">
                {socialLinks.map(([label, href]) => (
                  // rel="me" marks these as profiles of the same entity, which
                  // backs up the sameAs claim in the business structured data.
                  label === "WeChat" ? (
                    <button type="button" data-wechat-copy={wechatId} data-copy-label={`WeChat ${wechatId}`} data-copied-label={isCn ? "已复制 WeChat ID" : "WeChat ID copied"} key={label}>
                      WeChat {wechatId}
                    </button>
                  ) : (
                    <a href={href} key={label} target="_blank" rel="me noopener">
                      {label}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="col footer-policy-col">
            <h6>{isCn ? "政策" : "Policies"}</h6>
            {policies.map(([label, href]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <p className="image-disclosure">{isCn ? "本网站氛围图片由 AI 生成，仅供意境参考。想看真实环境照片，可在 WhatsApp、Telegram 或 WeChat 向客服索取；实际设施及服务以到店为准。" : "Atmosphere images on this site are AI-generated illustrations. Ask us on WhatsApp, Telegram or WeChat and we will send real photos of the outlet. Actual facilities and services may differ."}</p>
        <div className="bottom">
          <span>{`${brandFull} · © 2026 ${brandEn}. All rights reserved.`}</span>
          <span>{isCn ? `WeChat ID：${wechatId}` : `WeChat ID: ${wechatId}`}</span>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp({ locale = "cn" }: { locale?: Locale }) {
  const isCn = locale === "cn";

  return (
    <div className="contact-rail" lang={isCn ? "zh-Hans" : "en"} aria-label={isCn ? `联系${brandCn}` : `Contact ${brandEn}`}>
      <div className="contact-rail-intro"><span className="status-dot" /><span>{isCn ? "24 小时营业" : "ALWAYS OPEN"}</span><span>{isCn ? "客服咨询" : "Customer service"}</span></div>
      <a className="rail-channel whatsapp" href={isCn ? whatsappHrefCn : whatsappHref} target="_blank" rel="noopener" aria-label="WhatsApp">
        <WhatsAppIcon />
        WhatsApp
      </a>
      <a className="rail-channel telegram" href={isCn ? telegramHrefCn : telegramHref} target="_blank" rel="noopener" aria-label="Telegram">
        <TelegramIcon />
        Telegram
      </a>
      <button
        className="rail-channel wechat"
        type="button"
        data-wechat-copy={wechatId}
        data-copy-label={`WeChat ${wechatId}`}
        data-copied-label={isCn ? "已复制 WeChat ID" : "WeChat ID copied"}
        aria-label={`WeChat ${wechatId}`}
      >
        <WeChatIcon />
        WeChat
      </button>
    </div>
  );
}
