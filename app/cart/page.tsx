import { FloatingWhatsApp, Footer, Header, SectionHead, telegramHref, whatsappCartBase } from "../site-common";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata({
  title: "预约购物车 | 吉隆坡会所",
  description: "确认 吉隆坡会所预约购物车。",
  path: "/cart/",
  noIndex: true,
});

export default function CartPage() {
  return (
    <>
      <Header active="Cart" />
      <main>
        <section id="cart">
          <SectionHead
            eyebrow="预约购物车"
            title="确认你的预约"
            sub="检查已选择的项目，提交后客服会尽快跟进。"
          />
          <div className="container">
            <div className="cart-shell" data-cart-page data-locale="cn">
              <div className="cart-loading">正在读取购物车...</div>
            </div>
          </div>
        </section>
      </main>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.KLHUISUO_TELEGRAM_URL=${JSON.stringify(telegramHref)};window.KLHUISUO_WHATSAPP_URL=${JSON.stringify(whatsappCartBase)};`,
        }}
      />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
