(function () {
  "use strict";

  var TOKEN_KEY = "klhuisuo_admin_token";
  var socket = null;
  var socketScript = null;
  var rows = [];
  var clickSummary = [];
  var recentClicks = [];
  var lastReservationStatus = "";

  function $(selector) {
    return document.querySelector(selector);
  }

  function storedApiBase() {
    var configured = (window.ONESPA_API_BASE || "").trim().replace(/\/$/, "");
    if (configured) return configured;
    if (location.hostname === "localhost" && location.port !== "4000") return "http://localhost:4000";
    return "";
  }

  function endpoint(path) {
    return storedApiBase() + path;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function money(cents) {
    return "RM" + (Number(cents || 0) / 100).toFixed(2);
  }

  function lineMoney(value) {
    return "RM" + Number(value || 0).toFixed(2);
  }

  function formatDate(value) {
    if (!value) return "-";
    return String(value).slice(0, 10);
  }

  function formatDateTime(value) {
    if (!value) return "-";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return formatDate(value);
    return date.toLocaleString("en-MY", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function setStatus(message, tone, target) {
    var el = $(target || "[data-admin-status]");
    if (!el) return;
    el.textContent = message;
    el.dataset.tone = tone || "";
  }

  function currentToken() {
    return ($("[data-admin-token]")?.value || "").trim();
  }

  function currentFilter() {
    return $("[data-admin-filter]")?.value || "all";
  }

  function setLoggedIn(isLoggedIn) {
    var login = $("[data-admin-login]");
    var dashboard = $("[data-admin-dashboard]");
    if (login) login.hidden = isLoggedIn;
    if (dashboard) dashboard.hidden = !isLoggedIn;
  }

  function isDashboardVisible() {
    var dashboard = $("[data-admin-dashboard]");
    return Boolean(dashboard && !dashboard.hidden);
  }

  function readJsonResponse(res, fallback) {
    return res.text().then(function (text) {
      var body = {};
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          body = { error: text.slice(0, 180) };
        }
      }
      if (!res.ok) throw new Error(body.error || fallback || "Request failed.");
      return body;
    });
  }

  function emptyClickStats() {
    return [
      { site: "klhuisuo", source: "main", channel: "whatsapp", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "klhuisuo", source: "main", channel: "telegram", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "klhuisuo", source: "main", channel: "wechat", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "klhuisuo", source: "jishi_tiaoxuan", channel: "whatsapp", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "klhuisuo", source: "jishi_tiaoxuan", channel: "telegram", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "klhuisuo", source: "jishi_tiaoxuan", channel: "wechat", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "onespa", source: "baiqu", channel: "whatsapp", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "onespa", source: "baiqu", channel: "telegram", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "onespa", source: "baiqu", channel: "wechat", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "onespa", source: "jishi_tiaoxuan", channel: "whatsapp", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "onespa", source: "jishi_tiaoxuan", channel: "telegram", total: 0, today: 0, this_week: 0, this_month: 0 },
      { site: "onespa", source: "jishi_tiaoxuan", channel: "wechat", total: 0, today: 0, this_week: 0, this_month: 0 }
    ];
  }

  function siteLabel(site) {
    if (site === "klhuisuo") return "吉隆坡会所";
    if (site === "onespa") return "OneSpa";
    return "旧记录";
  }

  function channelLabel(channel) {
    if (channel === "whatsapp") return "WhatsApp";
    if (channel === "telegram") return "Telegram";
    if (channel === "wechat") return "WeChat";
    return "Unknown";
  }

  function sourceLabel(source) {
    if (source === "main") return "主页";
    if (source === "baiqu") return "白区";
    if (source === "jishi_tiaoxuan") return "技师挑选";
    return "旧来源";
  }

  function metricLabel(site, source) {
    return site === "unknown" || source === "unknown" ? "records" : "unique IPs";
  }

  function clickRow(site, source, channel) {
    return (
      clickSummary.find(function (row) {
        return (row.site || "unknown") === site && (row.source || "unknown") === source && row.channel === channel;
      }) ||
      emptyClickStats().find(function (row) {
        return row.site === site && row.source === source && row.channel === channel;
      }) ||
      { site: site, source: source, channel: channel, total: 0, today: 0, this_week: 0, this_month: 0 }
    );
  }

  function clickStatItems() {
    var items = emptyClickStats();
    clickSummary.forEach(function (row) {
      var site = row.site || "unknown";
      var source = row.source || "unknown";
      var channel = row.channel;
      if (
        site === "unknown" &&
        !items.some(function (item) {
          return item.site === site && item.source === source && item.channel === channel;
        })
      ) {
        items.push({
          site: site,
          source: source,
          channel: channel,
          total: 0,
          today: 0,
          this_week: 0,
          this_month: 0
        });
      }
    });
    return items;
  }

  function renderClickStats() {
    var root = $("[data-admin-click-stats]");
    var recentRoot = $("[data-admin-click-recent]");
    if (!root) return;

    root.innerHTML = clickStatItems()
      .map(function (item) {
        var channel = item.channel;
        var row = clickRow(item.site, item.source, channel);
        var metric = metricLabel(item.site, item.source);
        return (
          '<article class="admin-click-card ' +
          channel +
          '"><span>' +
          siteLabel(item.site) +
          " · " +
          sourceLabel(item.source) +
          " · " +
          channelLabel(channel) +
          '</span><strong>' +
          escapeHtml(row.total || 0) +
          '</strong><div>' +
          metric +
          ' · <b>' +
          escapeHtml(row.today || 0) +
          '</b> today · <b>' +
          escapeHtml(row.this_week || 0) +
          '</b> this week · <b>' +
          escapeHtml(row.this_month || 0) +
          "</b> this month</div></article>"
        );
      })
      .join("");

    if (!recentRoot) return;
    if (!recentClicks.length) {
      recentRoot.innerHTML = '<div class="admin-click-muted">No contact clicks recorded yet.</div>';
      return;
    }
    recentRoot.innerHTML =
      '<h3>Recent clicks</h3>' +
      recentClicks
        .slice(0, 8)
        .map(function (row) {
          return (
            '<div class="admin-click-line"><b>' +
            escapeHtml(siteLabel(row.site) + " · " + sourceLabel(row.source) + " · " + channelLabel(row.channel)) +
            '</b><span>' +
            escapeHtml(row.label || row.path || "-") +
            '</span><time>' +
            escapeHtml(formatDateTime(row.created_at)) +
            "</time></div>"
          );
        })
        .join("");
  }

  function normalizeWhatsApp(value) {
    var digits = String(value || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.charAt(0) === "0") return "6" + digits;
    return digits;
  }

  function telegramHref(value) {
    var raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    raw = raw.replace(/^@/, "").replace(/^t\.me\//i, "").replace(/^telegram\.me\//i, "");
    return raw ? "https://t.me/" + encodeURIComponent(raw) : "";
  }

  function contactActions(row) {
    var actions = [];
    var phoneDigits = normalizeWhatsApp(row.customer_phone);
    var tg = telegramHref(row.customer_telegram);
    if (phoneDigits) {
      actions.push(
        '<a class="admin-contact admin-wa" target="_blank" rel="noopener" href="https://wa.me/' +
          phoneDigits +
          '">WhatsApp</a>'
      );
    }
    if (tg) {
      actions.push(
        '<a class="admin-contact admin-tg" target="_blank" rel="noopener" href="' +
          escapeHtml(tg) +
          '">Telegram</a>'
      );
    }
    if (!actions.length) return '<span class="admin-no-contact">No chat contact</span>';
    return actions.join("");
  }

  function statusOptions(value) {
    return ["pending", "confirmed", "completed", "cancelled", "no_show"]
      .map(function (status) {
        return '<option value="' + status + '"' + (status === value ? " selected" : "") + ">" + status.replace("_", " ") + "</option>";
      })
      .join("");
  }

  function itemRows(row) {
    var items = Array.isArray(row.items) ? row.items : [];
    if (!items.length) return '<div class="admin-item muted">No item details saved.</div>';
    return items
      .map(function (item) {
        return (
          '<div class="admin-item"><div><b>' +
          escapeHtml(item.nameEn || item.name || item.code || "Package") +
          "</b><span>" +
          escapeHtml(item.date || formatDate(row.visit_date)) +
          " · " +
          escapeHtml(item.time || "-") +
          " · Qty " +
          escapeHtml(item.qty || 1) +
          (item.unit ? " · " + escapeHtml(item.unit) : "") +
          '</span></div><strong>' +
          lineMoney(item.total) +
          "</strong></div>"
        );
      })
      .join("");
  }

  function render() {
    var root = $("[data-admin-list]");
    if (!root) return;
    var filter = currentFilter();
    var visible = rows.filter(function (row) {
      return filter === "all" || row.status === filter;
    });

    if (!visible.length) {
      root.innerHTML = '<div class="admin-empty">No reservations found.</div>';
      return;
    }

    root.innerHTML = visible
      .map(function (row) {
        return (
          '<article class="admin-card" data-ref="' +
          escapeHtml(row.reservation_ref) +
          '"><div class="admin-card-head"><div><span class="admin-ref">' +
          escapeHtml(row.reservation_ref) +
          '</span><h2>' +
          escapeHtml(row.customer_name) +
          '</h2><div class="admin-contact-row">' +
          contactActions(row) +
          '</div></div><div class="admin-money">' +
          money(row.total_cents) +
          '</div></div><div class="admin-detail-grid"><div><span>Visit date</span><b>' +
          escapeHtml(formatDate(row.visit_date)) +
          '</b></div><div><span>Created</span><b>' +
          escapeHtml(formatDateTime(row.created_at)) +
          '</b></div></div><div class="admin-customer"><span>' +
          (row.customer_phone ? "WhatsApp: " + escapeHtml(row.customer_phone) : "") +
          (row.customer_phone && row.customer_telegram ? " · " : "") +
          (row.customer_telegram ? "Telegram: " + escapeHtml(row.customer_telegram) : "") +
          (row.customer_email ? " · Email: " + escapeHtml(row.customer_email) : "") +
          '</span></div><div class="admin-items">' +
          itemRows(row) +
          '</div><div class="admin-breakdown"><div><span>Subtotal</span><b>' +
          money(row.subtotal_cents) +
          '</b></div><div><span>Service charge</span><b>' +
          money(row.service_charge_cents) +
          '</b></div><div><span>SST</span><b>' +
          money(row.sst_cents) +
          '</b></div><div class="grand"><span>Total</span><b>' +
          money(row.total_cents) +
          '</b></div></div><div class="admin-actions"><label><span>Status</span><select data-admin-update="' +
          escapeHtml(row.reservation_ref) +
          '">' +
          statusOptions(row.status) +
          "</select></label></div>" +
          (row.customer_notes ? '<p class="admin-note">' + escapeHtml(row.customer_notes) + "</p>" : "") +
          "</article>"
        );
      })
      .join("");
  }

  function saveToken() {
    localStorage.setItem(TOKEN_KEY, currentToken());
  }

  function refresh() {
    saveToken();
    var token = currentToken();
    var wasLoggedIn = isDashboardVisible();
    if (!token) {
      setLoggedIn(false);
      setStatus("Enter your admin token to continue.", "bad", "[data-admin-login-status]");
      return;
    }

    setStatus("Loading reservations...", "");
    fetch(endpoint("/api/reservations?token=" + encodeURIComponent(token)))
      .then(function (res) {
        return readJsonResponse(res, "Could not load reservations.");
      })
      .then(function (body) {
        rows = body.reservations || [];
        setLoggedIn(true);
        render();
        lastReservationStatus = "Loaded " + rows.length + " reservations.";
        setStatus(lastReservationStatus, "ok");
        setStatus("", "", "[data-admin-login-status]");
        refreshClickStats();
        connectSocket();
      })
      .catch(function (error) {
        if (wasLoggedIn) {
          setLoggedIn(true);
          setStatus(error.message, "bad");
        } else {
          setLoggedIn(false);
          setStatus(error.message, "bad", "[data-admin-login-status]");
        }
      });
  }

  function refreshClickStats() {
    var token = currentToken();
    if (!token) return;
    renderClickStats();

    fetch(endpoint("/api/contact-clicks?token=" + encodeURIComponent(token)))
      .then(function (res) {
        return readJsonResponse(res, "Could not load contact click stats.");
      })
      .then(function (body) {
        clickSummary = body.summary || [];
        recentClicks = body.recent || [];
        renderClickStats();
      })
      .catch(function (error) {
        var root = $("[data-admin-click-stats]");
        if (root) root.innerHTML = '<div class="admin-empty">' + escapeHtml(error.message) + "</div>";
      });
  }

  function updateReservation(ref, status) {
    saveToken();
    fetch(endpoint("/api/reservations"), {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-admin-token": currentToken()
      },
      body: JSON.stringify({ reservationRef: ref, status: status })
    })
      .then(function (res) {
        return readJsonResponse(res, "Could not update reservation.");
      })
      .then(function () {
        var row = rows.find(function (item) {
          return item.reservation_ref === ref;
        });
        if (row) row.status = status;
        setStatus("Updated " + ref + ".", "ok");
      })
      .catch(function (error) {
        setStatus(error.message, "bad");
        refresh();
      });
  }

  function upsert(row) {
    var index = rows.findIndex(function (item) {
      return item.reservation_ref === row.reservation_ref;
    });
    if (index >= 0) rows[index] = Object.assign({}, rows[index], row);
    else rows.unshift(row);
    render();
  }

  function loadSocketScript(base) {
    if (window.io) return Promise.resolve();
    if (socketScript) return socketScript;
    socketScript = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = (base || "") + "/socket.io/socket.io.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return socketScript;
  }

  function connectSocket() {
    var token = currentToken();
    var base = storedApiBase();
    if (socket && socket.connected) return;

    loadSocketScript(base)
      .then(function () {
        if (!window.io) throw new Error("Socket.IO client did not load.");
        if (socket) socket.disconnect();
        socket = window.io(base || undefined, {
          auth: { token: token },
          query: { token: token },
          transports: ["websocket", "polling"]
        });
        socket.on("connect", function () {
          setStatus((lastReservationStatus || "Reservations loaded.") + " Realtime connected.", "ok");
        });
        socket.on("connect_error", function (error) {
          setStatus((lastReservationStatus || "Reservations loaded.") + " Realtime offline: " + error.message, "bad");
        });
        socket.on("reservation:created", function (row) {
          upsert(row);
          setStatus("New reservation received: " + row.reservation_ref, "ok");
        });
        socket.on("reservation:updated", function (row) {
          upsert(row);
          setStatus("Reservation updated: " + row.reservation_ref, "ok");
        });
      })
      .catch(function () {
        setStatus("Websocket client not found. Check that the backend and /socket.io proxy are running.", "bad");
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var tokenInput = $("[data-admin-token]");
    if (!tokenInput) return;
    tokenInput.value = localStorage.getItem(TOKEN_KEY) || "";

    $("[data-admin-refresh]")?.addEventListener("click", refresh);
    $("[data-admin-refresh-clicks]")?.addEventListener("click", refreshClickStats);
    $("[data-admin-save]")?.addEventListener("click", refresh);
    $("[data-admin-logout]")?.addEventListener("click", function () {
      localStorage.removeItem(TOKEN_KEY);
      rows = [];
      clickSummary = [];
      recentClicks = [];
      lastReservationStatus = "";
      if (socket) socket.disconnect();
      tokenInput.value = "";
      setLoggedIn(false);
      setStatus("Logged out.", "", "[data-admin-login-status]");
    });
    $("[data-admin-filter]")?.addEventListener("change", render);
    tokenInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") refresh();
    });
    document.addEventListener("change", function (event) {
      if (!event.target || !event.target.closest) return;
      var select = event.target.closest("[data-admin-update]");
      if (!select) return;
      updateReservation(select.getAttribute("data-admin-update"), select.value);
    });

    if (tokenInput.value) refresh();
    else {
      setLoggedIn(false);
      setStatus("Enter your admin token to continue.", "", "[data-admin-login-status]");
    }
  });
})();
