import type { ReactNode } from "react";
import { brandCn, brandEn, Header, Footer, FloatingWhatsApp } from "./site-common";

/** One composition for both languages; prices and timings stay paired. */
export function HomeExperience({ locale, contact }: { locale: "en" | "cn"; contact: ReactNode }) {
  const cn = locale === "cn";
  const base = "";
  const t = (en: string, zh: string) => cn ? zh : en;
  const menu = [
    ["solo", "12-Hour Entry", "12 小时普通入场", "Regular adult entry", "普通成人入场", "169", "199"],
    ["kids", "Kids Ticket", "儿童票", "For children aged 12 and under", "12 岁及以下儿童票，需成人陪同", "58", "88"],
  ];
  const ritual = [
    ["01", "43°", "Soak", "入汤", "Ease into the herbal pool. Let the warm water set the pace.", "走进温热的中药池，让水温带你慢下来。"],
    ["02", "温", "Find your warmth", "暖身", "Salt steam, dry sauna or wet sauna. Choose your kind of heat.", "岩盐蒸房、干蒸或湿蒸，选自己舒服的温度。"],
    ["03", "13°", "Cool down", "清凉", "A cold plunge, whenever you feel ready. Take it at your own pace.", "想清醒一下，就试试玄冰池。以自己的舒适感为准。"],
    ["04", "缓", "Rest. Repeat.", "歇一歇", "Have some water, settle into a seat, and leave room for another round.", "喝点水，找个地方坐下。休息好了，再来一轮。"],
  ];
  return <>
    <Header active="Home" locale={locale} />
    <main id="main-content" className="journal-home" lang={cn ? "zh-Hans" : "en"}>
      <section className="opening container">
        <div className="opening-copy">
          <div className="journal-label"><span className="status-dot" />{t("KUALA LUMPUR · OPEN 24 HOURS", "吉隆坡 · 24 小时不打烊")}</div>
          <h1>{t("The city moves.", "城中一隅，")}<br /><em>{t("You don’t have to.", "慢下来。")}</em></h1>
          <p className="opening-intro">{t("A Kuala Lumpur bathhouse, with time on your side.", `${brandCn}，一间把时间留给你的汤泉会所。`)}</p>
          <p className="opening-description">{t("Warm water. A little quiet. A table when you’re hungry. Come to LG Floor at Viva Home Mall and let the hours be yours.", "泡一池温汤，寻一处安静，饿了就好好吃顿饭。来 Viva Home Mall LG Floor，把匆忙留在门外。")}</p>
          <div className="opening-actions"><a className="btn" href="#featured">{t("Find your stay", "选一段慢时光")}<span aria-hidden="true">↗</span></a><a className="journal-link" href="#ritual">{t("Explore the ritual", "从泡汤开始")}<span aria-hidden="true">↓</span></a></div>
          <div className="opening-note"><span className="opening-number">12<span>h</span></span><p>{t("Your time starts at check-in.", "从入场那一刻，开始计时。")}<br /><span>{t("12-hour entry from RM169++", "12 小时门票 RM169++ 起")}</span></p></div>
        </div>
        <figure className="opening-image"><img src="/assets/generated/bath-pool.jpg" alt={t("Illustrative jade-water bath with soft light and drifting steam", "意境示意：柔光与薄雾中的碧色汤池")} width="1672" height="941" fetchPriority="high" /><figcaption><span>{brandCn} · {brandEn.toUpperCase()}</span><span>{t("An invitation to pause", "给自己，一点留白")}</span></figcaption></figure>
      </section>

      <section id="ritual" className="ritual-section">
        <div className="container"><div className="journal-section-top"><div><div className="journal-label">01 / {t("THE BATHING RITUAL", "汤泉之序")}</div><h2>{t("Water. Warmth. A fresh start.", "一池温热，一身轻松。")}</h2></div><p>{t("There is no schedule to follow. Just a simple rhythm to make your own.", "不用赶行程，也不用看时间。跟着身体的节奏，慢慢来。")}</p></div>
          <ol className="ritual-sequence">{ritual.map(([n, mark, en, zh, copy, zhCopy]) => <li key={n}><div className="ritual-mark">{mark}<span>{n}</span></div><h3>{t(en, zh)}</h3><p>{t(copy, zhCopy)}</p></li>)}</ol>
          <a className="journal-link" href={cn ? "/wenquan/" : "/onsen-kl/"}>{t("A guide to our baths", "认识中式汤泉")}<span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section id="featured" className="stay-section container">
        <div className="menu-intro"><div className="journal-label">02 / {t("ENTRY PRICES", "普通价目")}</div><h2>{t("Make room", "留一点时间，")}<br /><em>{t("for yourself.", "给自己。")}</em></h2><p>{t("Only regular entry prices are shown here. Massage, scrub, beauty and TCM services are separate add-ons.", "这里只列普通入场价。按摩、搓背、美容与中医项目另行加购。")}</p><a className="journal-link" href={`${base}/packages/#treatments`}>{t("Full treatment menu", "查看完整护理价目")}<span aria-hidden="true">↗</span></a></div>
        <div className="stay-menu"><div className="menu-column-head"><span>{t("ENTRY / NOTES", "入场 / 说明")}</span><span>{t("SUN–THU", "周日–周四")}</span><span>{t("FRI–SAT / PH", "周五–周六 / 假日")}</span><span /></div>
          {menu.map(([id, en, zh, desc, zhDesc, weekday, weekend]) => <a key={id} className="stay-row" href={`${base}/packages/#pk-${id}`}><div><h3>{t(en, zh)}</h3><p>{t(desc, zhDesc)}</p></div><span className="menu-price"><small>RM</small>{weekday}<sup>++</sup></span><span className="menu-price"><small>RM</small>{weekend}<sup>++</sup></span><span className="menu-arrow" aria-hidden="true">↗</span></a>)}
          <p className="menu-footnote">{t("++ = 10% service charge + 8% SST. Sunday is the weekday tier. Public holidays use the higher tier.", "++ = 10% 服务费 + 8% SST。星期日按平日收费，公共假期按高价档收费。")}</p>
          <a className="journal-link" href={`${base}/packages/#featured`}>{t("View regular price list", "查看普通价目")}<span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section id="facilities" className="house-section">
        <div className="container"><div className="journal-section-top"><div><div className="journal-label">03 / {t("INSIDE THE BATHHOUSE", "汤泉之内")}</div><h2>{t("Stay a little longer.", "泡完汤，还不想走。")}</h2></div><p>{t("Inside the Bathhouse, the space between treatments is part of the pleasure.", "汤池之外，还有许多让你愿意留下来的小事。")}</p></div>
          <figure className="house-spread"><img src="/assets/generated/steam.jpg" alt={t("Illustrative salt steam room in amber light", "意境示意：暖光中的岩盐蒸房")} width="1536" height="1024" loading="lazy" /><figcaption><span>01 / {t("HIMALAYAN SALT STEAM", "岩盐蒸房")}</span><p>{t("Warm light, a quiet seat, and nowhere else you need to be. The steam rooms and saunas are included in your 12-hour entry.", "暖暖的灯光，一个安静的位置，不必急着去下一个地方。蒸房与桑拿均包含在 12 小时门票内。")}</p></figcaption></figure>
          <div className="house-index">{[["02", "Screening & Sleep Lounge", "放映厅 · 眠息厅", "A film, a nap, or a whole unhurried evening.", "看一场电影，睡一个好觉，慢慢度过整晚。"],["03", "Dining & Small Pleasures", "餐饮与小满足", "Buffet dinner, fruit and something sweet.", "自助晚餐、水果和冰淇淋，让胃口也放松。"],["04", "A Room of Your Own", "私享一室", "Private dining and theme rooms, reserved ahead.", "私人宴席与主题包厢，提前为你安排。"]].map(([n,en,zh,desc,zhDesc]) => <div key={n}><span>{n}</span><h3>{t(en,zh)}</h3><p>{t(desc,zhDesc)}</p></div>)}</div>
          <a className="journal-link" href={`${base}/facilities/`}>{t("Explore the bathhouse", "慢慢逛，看看全部设施")}<span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="care-directory container"><div><div className="journal-label">04 / {t("A LITTLE MORE CARE", "多一份照顾")}</div><h2>{t("Your own kind", "照顾自己，")}<br /><em>{t("of wellbeing.", "不止一种方式。")}</em></h2></div><div className="care-links">{[["packages/#treatments","Massage & body care","按摩与身体护理","Tui na, foot therapy and traditional body polish.","推拿、足疗与古法搓背。"],["beauty/","Beauty studio","美容护理","Time for your skin, with one-to-one care.","一对一护理，把时间留给肌肤。"],["tcm/","TCM wellness","中医调理","Start with a conversation and a pulse assessment.","从沟通与把脉开始，了解身体。"],["home-massage/","Care, brought to you","上门按摩","Massage at your home or hotel, within 30km.","30 公里范围内，送到住家或酒店的放松。"]].map(([href,en,zh,desc,zhDesc]) => <a href={`${base}/${href}`} key={href}><div><h3>{t(en,zh)}</h3><p>{t(desc,zhDesc)}</p></div><span aria-hidden="true">↗</span></a>)}</div></section>

      <section id="faq" className="visit-section"><div className="container visit-grid"><div><div className="journal-label">05 / {t("WHEN YOU’RE READY", "准备好，就来吧")}</div><h2>{t("A message away.", "发个消息，问一下。")}</h2><p>{t("Tell us your guest count and arrival time. Our team can help with current availability and service details.", "把人数和大概到店时间告诉我们。客服可以协助你了解当天安排与项目细节。")}</p>{contact}<a className="journal-link" href={`${base}/contact/`}>{t("Find us at Viva Home Mall · LG Floor", "Viva Home Mall LG Floor · 到店指引")}<span aria-hidden="true">↗</span></a></div><div className="visit-notes"><div><span>01</span><h3>{t("Come at any hour", "随时都欢迎")}</h3><p>{t("Open 24 hours. A 12-hour entry starts when you check in.", "全天 24 小时营业。12 小时门票从入场计时。")}</p></div><div><span>02</span><h3>{t("Ask before coming", "来之前先问问")}</h3><p>{t("Message us for current service availability and room details.", "可以先联系客服了解当天项目与房型情况。")}</p></div><a className="journal-link" href={`${base}/faq/`}>{t("More before-you-come questions", "第一次来，想多了解一点")}<span aria-hidden="true">↗</span></a></div></div></section>
    </main>
    <Footer locale={locale} /><FloatingWhatsApp locale={locale} />
  </>;
}
