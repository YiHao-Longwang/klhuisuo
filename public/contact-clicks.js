(function () {
  "use strict";

  var SITE = "klhuisuo";

  if (/^\/(?:admin|codex-healthcheck)(?:\/|$)/.test(location.pathname)) return;

  function channelFor(control) {
    var explicit = String(control.getAttribute("data-click-channel") || "").trim().toLowerCase();
    if (explicit === "whatsapp" || explicit === "telegram" || explicit === "wechat") return explicit;

    var href = String(control.href || control.getAttribute("href") || "");
    var className = String(control.className || "");
    if (/wa\.me|whatsapp/i.test(href) || /(^|\s)(contact-wa|whatsapp)(\s|$)/i.test(className)) return "whatsapp";
    if (/t\.me|telegram\.me|telegram/i.test(href) || /(^|\s)(contact-tg|telegram)(\s|$)/i.test(className)) return "telegram";
    if (control.matches("[data-wechat-copy]") || /wechat/i.test(href) || /(^|\s)wechat(\s|$)/i.test(className)) return "wechat";
    return "";
  }

  function compactText(value) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, 120);
  }

  function sourceFor(control) {
    var attr = String(control.getAttribute("data-click-source") || "").trim().toLowerCase();
    if (attr === "jishi_tiaoxuan" || attr === "main") return attr;
    return /^\/jishi-tiaoxuan(?:\/|$)/.test(location.pathname) ? "jishi_tiaoxuan" : "main";
  }

  function send(payload) {
    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      var blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/contact-clicks", blob)) return;
    }
    fetch("/api/contact-clicks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body,
      keepalive: true
    }).catch(function () {});
  }

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var control = target.closest("a[href], button[data-wechat-copy], [data-click-channel]");
      if (!control) return;

      var channel = channelFor(control);
      if (!channel) return;

      send({
        channel: channel,
        site: SITE,
        source: sourceFor(control),
        path: location.pathname,
        href: control.href || control.getAttribute("href") || "",
        label: compactText(
          control.getAttribute("aria-label") ||
            control.getAttribute("data-copy-label") ||
            control.textContent ||
            channel
        )
      });
    },
    true
  );
})();
