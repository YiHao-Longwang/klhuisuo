import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import "./admin-analytics.test.mjs";

const templateRoot = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the 吉隆坡会所 page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>吉隆坡会所 \| 吉隆坡下水 · 吉隆坡水汇 · 按摩娱乐会所<\/title>/i);
  assert.match(html, /name="keywords" content="[^"]*吉隆坡SPA[^"]*吉隆坡会所[^"]*klspa/i);
  assert.match(html, /name="keywords" content="[^"]*吉隆坡水汇[^"]*下水[^"]*水汇/i);
  assert.match(html, /favicon-48x48\.png/);
  assert.match(html, /apple-touch-icon\.png/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /https:\/\/share\.google\//);
  assert.match(html, /\/assets\/klhuisuo-logo\.jpeg/);
  assert.match(html, /"paymentAccepted":\["Cash","Credit Card","Debit Card"\]/);
  assert.match(html, /"currenciesAccepted":"MYR"/);
  assert.match(html, /"makesOffer":/);
  assert.match(html, /城中一隅/);
  assert.match(html, /普通价目/);
  assert.match(html, /汤泉之内/);
  assert.match(html, /\/assets\/generated\/bath-pool\.jpg/);
  assert.match(html, /\+60 14-315 5632/);
  assert.match(html, /Telegram/);
  assert.match(html, /https:\/\/wa\.me\/60143155632/);
  assert.match(html, /https:\/\/t\.me\/nhlg09/);
  assert.doesNotMatch(html, /href="\/packages\/#pk-b1f1"|Buy 1 Free 1/i);
  assert.match(html, /href="\/packages\/#pk-solo"/);
  assert.match(html, /href="\/packages\/#pk-kids"/);
  assert.match(html, /href="\/facilities\/"/);
  assert.match(html, /href="\/packages\/#treatments"/);
  assert.match(html, /href="\/faq\/"/);
  assert.match(html, /class="mobile-tech-link promo-tech-link" type="button" data-tech-inquiry="true" aria-label="最新 男士必看 技师挑选"/);
  assert.doesNotMatch(html, /href="\/jishi-tiaoxuan\/"/);
  assert.match(html, /<strong>最新!!<\/strong> 男士必看/);
  assert.doesNotMatch(html, /class="brand wordmark" href="\/" aria-label="吉隆坡会所 home">吉隆坡会所/);
  assert.doesNotMatch(html, /klhuisuodw@gmail\.com|react-loading-skeleton|codex-preview/i);
});

test("server-renders Chinese pages at root paths and redirects old /cn paths", async () => {
  for (const path of ["/", "/packages", "/facilities", "/tcm", "/contact"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);

    const html = await response.text();
    assert.match(html, /lang="zh-Hans"/);
    assert.match(html, /[\u4e00-\u9fff]/);
    assert.match(html, /\+60 14-315 5632/);
    assert.match(html, /Telegram/);
    assert.match(html, /href="\/packages\/"/);
    assert.doesNotMatch(html, /href="\/cn\//);
  }

  for (const path of ["/cn", "/cn/packages", "/cn/facilities", "/cn/tcm", "/cn/contact", "/cn/cart"]) {
    const response = await render(path);
    assert.equal(response.status, 307, path);
  }

  const packages = await (await render("/packages")).text();
  assert.doesNotMatch(packages, /img-b1f1\.jpg|买一送一/);
  assert.match(packages, /class="cards"/);
  assert.match(packages, /class="tlist"/);
  assert.match(packages, /\/assets\/generated\/treatment-room\.jpg/);

  const facilities = await (await render("/facilities")).text();
  assert.match(facilities, /\/assets\/generated\/bath-pool\.jpg/);

  const tcm = await (await render("/tcm")).text();
  assert.match(tcm, /\/assets\/generated\/herbal-room\.jpg/);
  assert.doesNotMatch(tcm, /免费中医把脉|预约免费把脉/);

  const homeMassage = await (await render("/home-massage")).text();
  assert.doesNotMatch(homeMassage, /四手护理|四手尊宠|outcall-fourhands/);

  const beauty = await render("/beauty");
  assert.equal(beauty.status, 404);
});

test("redirects the old cart and uses chat-only booking", async () => {
  const cart = await render("/cart");
  assert.equal(cart.status, 307);
  assert.match(cart.headers.get("location") ?? "", /\/contact\/?$/);

  const admin = await (await render("/admin")).text();
  assert.match(admin, /预约管理/);
  assert.match(admin, /顾客联络资料/);
  assert.match(admin, /data-admin-login/);
  assert.match(admin, /data-admin-dashboard/);
  assert.match(admin, /data-admin-page/);
  assert.match(admin, /data-admin-click-stats/);
  assert.match(admin, /data-admin-refresh-clicks/);
  assert.match(admin, /href="\/admin\/clicks"/);
  assert.match(admin, /admin-reservations\.js\?v=20261002-community/);
  assert.match(admin, /data-admin-token/);
  assert.match(admin, /data-admin-filter/);
  assert.doesNotMatch(admin, /API base|data-admin-api-base/);

  const clickHistory = await (await render("/admin/clicks")).text();
  assert.match(clickHistory, /Click Analytics/);
  assert.match(clickHistory, /data-click-history-page/);
  assert.match(clickHistory, /data-click-tab="history"/);
  assert.match(clickHistory, /data-click-tab="graph"/);
  assert.match(clickHistory, /data-click-period/);
  assert.match(clickHistory, /This week/);
  assert.match(clickHistory, /This month/);
  assert.match(clickHistory, /admin-click-history\.js\?v=20261002-community/);
  assert.match(clickHistory, /<option value="wechat">WeChat<\/option>/);
  assert.match(clickHistory, /<option value="klhuisuo">吉隆坡会所<\/option>/);
  assert.match(clickHistory, /<option value="jinyuehui">金悦汇<\/option>/);
  assert.match(clickHistory, /data-click-channel-note/);

  for (const path of ["/packages", "/home-massage"]) {
    const html = await (await render(path)).text();
    assert.match(html, /进店预约报龙王/);
    assert.match(html, /WhatsApp 预约/);
    assert.match(html, /Telegram 预约/);
    assert.match(html, /WeChat 预约/);
    assert.doesNotMatch(html, /data-book=/);
    assert.doesNotMatch(html, /booking-cart\.js/);
  }
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(layout, /booking-cart\.js/);
  await assert.rejects(access(new URL("../public/booking-cart.js", import.meta.url)));

  const contactScript = await readFile(new URL("../public/contact-clicks.js", import.meta.url), "utf8");
  assert.match(contactScript, /api\/contact-clicks/);
  assert.match(contactScript, /sendBeacon/);
  assert.match(contactScript, /whatsapp/);
  assert.match(contactScript, /telegram/);
  assert.match(contactScript, /wechat/);
  assert.match(contactScript, /data-wechat-copy/);
  assert.match(contactScript, /codex-healthcheck/);

  const techPromoScript = await readFile(new URL("../public/tech-promo.js", import.meta.url), "utf8");
  assert.match(techPromoScript, /promoHidden = true/);
  assert.match(techPromoScript, /tech-inquiry-modal/);
  assert.match(techPromoScript, /加入 WhatsApp 群组/);
  assert.match(techPromoScript, /加入 Telegram 频道/);
  assert.match(techPromoScript, /chat\.whatsapp\.com\/HeRVJw5e6E12vbzpmP0oBr/);
  assert.match(techPromoScript, /t\.me\/kleznet168/);
  assert.match(techPromoScript, /data-click-source="jishi_tiaoxuan"/);
  assert.match(techPromoScript, /data-tech-inquiry/);

  const reservationServer = await readFile(new URL("../server/index.mjs", import.meta.url), "utf8");
  const reservationRoute = await readFile(new URL("../app/api/reservations/route.ts", import.meta.url), "utf8");
  for (const source of [reservationServer, reservationRoute]) {
    assert.match(source, /线上预约已关闭/);
    assert.match(source, /410/);
  }


  const adminScript = await readFile(new URL("../public/admin-reservations.js", import.meta.url), "utf8");
  assert.match(adminScript, /query: \{ token: token \}/);
  assert.match(adminScript, /实时连接中断/);
  assert.match(adminScript, /顾客联络资料/);
  assert.match(adminScript, /data-copy-phone/);
  assert.match(adminScript, /号码资料不完整/);

  const clickHistoryScript = await readFile(new URL("../public/admin-click-history.js", import.meta.url), "utf8");
  assert.match(clickHistoryScript, /view=history/);
  assert.match(clickHistoryScript, /view=series/);
  assert.match(clickHistoryScript, /period=/);
  assert.match(clickHistoryScript, /click-line-chart/);
  assert.match(clickHistoryScript, /klhuisuo_admin_token/);
  assert.doesNotMatch(clickHistoryScript, /data-click-days/);

  assert.match(adminScript, /this week/);
  assert.match(adminScript, /this month/);
  assert.doesNotMatch(adminScript, /last 7 days/);
});

test("keeps starter preview removed", async () => {
  const [page, layout, packageJson, robots, sitemap] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
  ]);

  assert.match(page, /HomeExperience/);
  assert.match(page, /ContactButtons/);
  assert.match(layout, /applicationName: "klhuisuo"/);
  assert.match(layout, /contact-clicks\.js\?v=20260922-chat-only/);
  assert.match(layout, /tech-promo\.js\?v=20261002-community/);
  assert.match(robots, /Sitemap: https:\/\/klhuisuo\.klyihao\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/klhuisuo\.klyihao\.com\/packages\//);
  assert.doesNotMatch(sitemap, /\/cn\//);
  const chineseRoutes = await readFile(new URL("../app/cn-pages.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(chineseRoutes, /Telegram 我们|WhatsApp 我们/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
});
