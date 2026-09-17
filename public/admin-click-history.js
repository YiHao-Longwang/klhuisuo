(function () {
  "use strict";

  var TOKEN_KEY = "klhuisuo_admin_token";
  var LIMIT = 25;
  var offset = 0;
  var total = 0;
  var recordTotal = 0;
  var activeTab = "history";
  var historyRows = [];
  var seriesRows = [];
  var dailyGroupRows = [];

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.from(document.querySelectorAll(selector));
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

  function setStatus(message, tone, target) {
    var el = $(target || "[data-click-status]");
    if (!el) return;
    el.textContent = message;
    el.dataset.tone = tone || "";
  }

  function currentToken() {
    return ($("[data-click-token]")?.value || "").trim();
  }

  function currentChannel() {
    return $("[data-click-channel]")?.value || "all";
  }

  function currentSite() {
    return $("[data-click-site]")?.value || "all";
  }

  function currentSource() {
    return $("[data-click-source]")?.value || "all";
  }

  function currentPeriod() {
    return $("[data-click-period]")?.value || "week";
  }

  function saveToken() {
    localStorage.setItem(TOKEN_KEY, currentToken());
  }

  function setLoggedIn(isLoggedIn) {
    var login = $("[data-click-login]");
    var dashboard = $("[data-click-dashboard]");
    if (login) login.hidden = isLoggedIn;
    if (dashboard) dashboard.hidden = !isLoggedIn;
  }

  function formatDateTime(value) {
    if (!value) return "-";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
    return date.toLocaleString("en-MY", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatDay(value) {
    var date = new Date(value + "T00:00:00+08:00");
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-MY", { month: "short", day: "2-digit" });
  }

  function channelLabel(channel) {
    if (channel === "whatsapp") return "WhatsApp";
    if (channel === "telegram") return "Telegram";
    if (channel === "wechat") return "WeChat";
    return "Unknown";
  }

  function channelClass(channel) {
    if (channel === "whatsapp") return "whatsapp";
    if (channel === "telegram") return "telegram";
    if (channel === "wechat") return "wechat";
    return "unknown";
  }

  function siteLabel(site) {
    if (site === "klhuisuo") return "吉隆坡会所";
    if (site === "onespa") return "OneSpa";
    return "旧记录";
  }

  function sourceLabel(source) {
    if (source === "jishi_tiaoxuan") return "技师挑选";
    if (source === "baiqu") return "白区";
    if (source === "main") return "主页/普通页面";
    return "旧记录";
  }

  function renderHistory() {
    var root = $("[data-click-table]");
    if (!root) return;
    if (!historyRows.length) {
      root.innerHTML = '<div class="admin-empty">No contact clicks found.</div>';
    } else {
      root.innerHTML =
        '<div class="click-table-scroll"><table class="click-table"><thead><tr>' +
        "<th>Date</th><th>Site</th><th>Area</th><th>Channel</th><th>Button label</th><th>Page</th><th>Link</th>" +
        "</tr></thead><tbody>" +
        historyRows
          .map(function (row) {
            var href = row.href || "";
            return (
              "<tr><td>" +
              escapeHtml(formatDateTime(row.created_at)) +
              "</td><td>" +
              escapeHtml(siteLabel(row.site)) +
              "</td><td>" +
              escapeHtml(sourceLabel(row.source)) +
              '</td><td><span class="click-channel-pill ' +
              channelClass(row.channel) +
              '">' +
              channelLabel(row.channel) +
              "</span></td><td>" +
              escapeHtml(row.label || "-") +
              "</td><td>" +
              escapeHtml(row.path || "-") +
              "</td><td>" +
              (href
                ? '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener">Open</a>'
                : '<span class="muted">-</span>') +
              "</td></tr>"
            );
          })
          .join("") +
        "</tbody></table></div>";
    }

    var page = Math.floor(offset / LIMIT) + 1;
    var maxPage = Math.max(1, Math.ceil(recordTotal / LIMIT));
    var pageEl = $("[data-click-page]");
    var prev = $("[data-click-prev]");
    var next = $("[data-click-next]");
    if (pageEl) pageEl.textContent = "Page " + page + " of " + maxPage + " · " + recordTotal + " records · " + total + " unique IPs";
    if (prev) prev.disabled = offset <= 0;
    if (next) next.disabled = offset + LIMIT >= recordTotal;
  }

  function renderGraph() {
    var root = $("[data-click-graph]");
    if (!root) return;
    if (!seriesRows.length) {
      root.innerHTML = '<div class="admin-empty">No graph data found.</div>';
      return;
    }

    var max = seriesRows.reduce(function (highest, row) {
      return Math.max(highest, Number(row.total || 0));
    }, 0);
    var yMax = max <= 5 ? 5 : Math.ceil(max / 5) * 5;
    var width = 900;
    var height = 340;
    var padLeft = 48;
    var padRight = 24;
    var padTop = 30;
    var padBottom = 52;
    var innerWidth = width - padLeft - padRight;
    var innerHeight = height - padTop - padBottom;
    var lastIndex = Math.max(1, seriesRows.length - 1);
    var labelEvery = Math.max(1, Math.ceil(seriesRows.length / 7));
    var whatsappTotal = seriesRows.reduce(function (sum, row) {
      return sum + Number(row.whatsapp || 0);
    }, 0);
    var telegramTotal = seriesRows.reduce(function (sum, row) {
      return sum + Number(row.telegram || 0);
    }, 0);
    var wechatTotal = seriesRows.reduce(function (sum, row) {
      return sum + Number(row.wechat || 0);
    }, 0);

    function x(index) {
      return padLeft + (index / lastIndex) * innerWidth;
    }

    function y(value) {
      return padTop + innerHeight - (Number(value || 0) / yMax) * innerHeight;
    }

    function linePath(key) {
      return seriesRows
        .map(function (row, index) {
          return (index ? "L" : "M") + x(index).toFixed(1) + " " + y(row[key]).toFixed(1);
        })
        .join(" ");
    }

    function points(key, klass) {
      return seriesRows
        .map(function (row, index) {
          var value = Number(row[key] || 0);
          return (
            '<circle class="click-line-point ' +
            klass +
            '" cx="' +
            x(index).toFixed(1) +
            '" cy="' +
            y(value).toFixed(1) +
            '" r="' +
            (value ? 4.8 : 3.2) +
            '"><title>' +
            escapeHtml(formatDay(row.day) + " · " + channelLabel(key) + " " + value + " unique IPs") +
            "</title></circle>"
          );
        })
        .join("");
    }

    function yAxis() {
      return [0, 0.25, 0.5, 0.75, 1]
        .map(function (ratio) {
          var value = Math.round(yMax * ratio);
          var pos = y(value).toFixed(1);
          return (
            '<g><line class="click-grid-line" x1="' +
            padLeft +
            '" x2="' +
            (width - padRight) +
            '" y1="' +
            pos +
            '" y2="' +
            pos +
            '"></line><text class="click-axis-label" x="' +
            (padLeft - 14) +
            '" y="' +
            (Number(pos) + 4) +
            '" text-anchor="end">' +
            value +
            "</text></g>"
          );
        })
        .join("");
    }

    function xAxis() {
      return seriesRows
        .map(function (row, index) {
          if (index !== 0 && index !== seriesRows.length - 1 && index % labelEvery !== 0) return "";
          return (
            '<text class="click-axis-label" x="' +
            x(index).toFixed(1) +
            '" y="' +
            (height - 16) +
            '" text-anchor="middle">' +
            escapeHtml(formatDay(row.day)) +
            "</text>"
          );
        })
        .join("");
    }

    function renderNumber(value, klass) {
      return '<span class="click-count ' + klass + '">' + Number(value || 0) + "</span>";
    }

    function dailyTotalsTable() {
      return (
        '<div class="click-detail-card"><div class="click-detail-head"><span>Daily totals</span><b>unique IPs</b></div>' +
        '<div class="click-table-scroll"><table class="click-breakdown-table"><thead><tr>' +
        "<th>Date</th><th>WhatsApp</th><th>Telegram</th><th>WeChat</th><th>Total</th>" +
        "</tr></thead><tbody>" +
        seriesRows
          .slice()
          .reverse()
          .map(function (row) {
            return (
              "<tr><td>" +
              escapeHtml(formatDay(row.day)) +
              "</td><td>" +
              renderNumber(row.whatsapp, "wa") +
              "</td><td>" +
              renderNumber(row.telegram, "tg") +
              "</td><td>" +
              renderNumber(row.wechat, "wc") +
              "</td><td><strong>" +
              Number(row.total || 0) +
              "</strong></td></tr>"
            );
          })
          .join("") +
        "</tbody></table></div></div>"
      );
    }

    function dailyGroupsTable() {
      var rows = dailyGroupRows || [];
      if (!rows.length) {
        return '<div class="click-detail-card"><div class="click-detail-head"><span>Daily by site / area</span><b>unique IPs</b></div><div class="admin-empty">No grouped data for this period.</div></div>';
      }
      return (
        '<div class="click-detail-card"><div class="click-detail-head"><span>Daily by site / area</span><b>first channel wins</b></div>' +
        '<div class="click-table-scroll"><table class="click-breakdown-table group"><thead><tr>' +
        "<th>Date</th><th>Site</th><th>Area</th><th>WhatsApp</th><th>Telegram</th><th>WeChat</th><th>Total</th>" +
        "</tr></thead><tbody>" +
        rows
          .map(function (row) {
            return (
              "<tr><td>" +
              escapeHtml(formatDay(row.day)) +
              "</td><td>" +
              escapeHtml(siteLabel(row.site)) +
              "</td><td>" +
              escapeHtml(sourceLabel(row.source)) +
              "</td><td>" +
              renderNumber(row.whatsapp, "wa") +
              "</td><td>" +
              renderNumber(row.telegram, "tg") +
              "</td><td>" +
              renderNumber(row.wechat, "wc") +
              "</td><td><strong>" +
              Number(row.total || 0) +
              "</strong></td></tr>"
            );
          })
          .join("") +
        "</tbody></table></div></div>"
      );
    }

    root.innerHTML =
      '<div class="click-chart-summary"><div><span>WhatsApp</span><strong class="wa">' +
      whatsappTotal +
      '</strong></div><div><span>Telegram</span><strong class="tg">' +
      telegramTotal +
      '</strong></div><div><span>WeChat</span><strong class="wc">' +
      wechatTotal +
      '</strong></div><div><span>Highest day</span><strong>' +
      max +
      '</strong></div></div><div class="click-chart-legend"><span><i class="wa"></i>WhatsApp</span><span><i class="tg"></i>Telegram</span><span><i class="wc"></i>WeChat</span></div>' +
      '<div class="click-line-wrap"><svg class="click-line-chart" viewBox="0 0 ' +
      width +
      " " +
      height +
      '" role="img" aria-label="WhatsApp, Telegram and WeChat unique IP line graph">' +
      yAxis() +
      '<line class="click-axis-line" x1="' +
      padLeft +
      '" x2="' +
      (width - padRight) +
      '" y1="' +
      (padTop + innerHeight) +
      '" y2="' +
      (padTop + innerHeight) +
      '"></line><path class="click-line wa" d="' +
      linePath("whatsapp") +
      '"></path><path class="click-line tg" d="' +
      linePath("telegram") +
      '"></path><path class="click-line wc" d="' +
      linePath("wechat") +
      '"></path>' +
      points("whatsapp", "wa") +
      points("telegram", "tg") +
      points("wechat", "wc") +
      xAxis() +
      '</svg></div><div class="click-detail-grid">' +
      dailyTotalsTable() +
      dailyGroupsTable() +
      "</div>";
  }

  function switchTab(tab) {
    activeTab = tab === "graph" ? "graph" : "history";
    $all("[data-click-tab]").forEach(function (button) {
      var isActive = button.getAttribute("data-click-tab") === activeTab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    $all("[data-click-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-click-panel") !== activeTab;
    });
  }

  function loadHistory() {
    var token = currentToken();
    var query =
      "?view=history&token=" +
      encodeURIComponent(token) +
      "&site=" +
      encodeURIComponent(currentSite()) +
      "&source=" +
      encodeURIComponent(currentSource()) +
      "&channel=" +
      encodeURIComponent(currentChannel()) +
      "&limit=" +
      LIMIT +
      "&offset=" +
      offset;
    return fetch(endpoint("/api/contact-clicks" + query))
      .then(function (res) {
        return readJsonResponse(res, "Could not load click history.");
      })
      .then(function (body) {
        historyRows = body.clicks || [];
        total = Number(body.total || 0);
        recordTotal = Number(body.record_total || body.total || 0);
        renderHistory();
      });
  }

  function loadSeries() {
    var token = currentToken();
    var period = currentPeriod();
    var periodQuery = /^\d+$/.test(period) ? "&days=" + encodeURIComponent(period) : "&period=" + encodeURIComponent(period);
    var query =
      "?view=series&token=" +
      encodeURIComponent(token) +
      "&site=" +
      encodeURIComponent(currentSite()) +
      "&source=" +
      encodeURIComponent(currentSource()) +
      "&channel=" +
      encodeURIComponent(currentChannel()) +
      periodQuery;
    return fetch(endpoint("/api/contact-clicks" + query))
      .then(function (res) {
        return readJsonResponse(res, "Could not load click graph.");
      })
      .then(function (body) {
        seriesRows = body.series || [];
        dailyGroupRows = body.daily_groups || [];
        renderGraph();
      });
  }

  function refreshAll() {
    saveToken();
    if (!currentToken()) {
      setLoggedIn(false);
      setStatus("Enter your admin token to continue.", "bad", "[data-click-login-status]");
      return;
    }

    setLoggedIn(true);
    setStatus("Loading click analytics...", "");
    Promise.all([loadHistory(), loadSeries()])
      .then(function () {
        setStatus("Loaded " + total + " unique IPs.", "ok");
        setStatus("", "", "[data-click-login-status]");
      })
      .catch(function (error) {
        setStatus(error.message, "bad");
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var tokenInput = $("[data-click-token]");
    if (!tokenInput) return;
    tokenInput.value = localStorage.getItem(TOKEN_KEY) || "";

    $("[data-click-save]")?.addEventListener("click", refreshAll);
    $("[data-click-refresh]")?.addEventListener("click", refreshAll);
    $("[data-click-logout]")?.addEventListener("click", function () {
      localStorage.removeItem(TOKEN_KEY);
      tokenInput.value = "";
      historyRows = [];
      seriesRows = [];
      dailyGroupRows = [];
      total = 0;
      recordTotal = 0;
      offset = 0;
      setLoggedIn(false);
      setStatus("Logged out.", "", "[data-click-login-status]");
    });
    $("[data-click-channel]")?.addEventListener("change", function () {
      offset = 0;
      refreshAll();
    });
    $("[data-click-site]")?.addEventListener("change", function () {
      offset = 0;
      refreshAll();
    });
    $("[data-click-source]")?.addEventListener("change", function () {
      offset = 0;
      refreshAll();
    });
    $("[data-click-period]")?.addEventListener("change", refreshAll);
    $("[data-click-prev]")?.addEventListener("click", function () {
      offset = Math.max(0, offset - LIMIT);
      refreshAll();
    });
    $("[data-click-next]")?.addEventListener("click", function () {
      if (offset + LIMIT < recordTotal) offset += LIMIT;
      refreshAll();
    });
    $all("[data-click-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        switchTab(button.getAttribute("data-click-tab"));
      });
    });
    tokenInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") refreshAll();
    });

    switchTab(activeTab);
    if (tokenInput.value) refreshAll();
    else {
      setLoggedIn(false);
      setStatus("Enter your admin token to continue.", "", "[data-click-login-status]");
    }
  });
})();
