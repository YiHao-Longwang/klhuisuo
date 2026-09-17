(function () {
  "use strict";

  var CART_KEY = "klhuisuo_reservation_cart_v1";
  var API_KEY = "klhuisuo_admin_api_base";
  var WA = window.KLHUISUO_WHATSAPP_URL || "https://wa.me/60143155632?text=";
  var TG = window.KLHUISUO_TELEGRAM_URL || "https://t.me/nhlg09";
  var bookingState = null;
  var holidays = {
    "2026-01-01": true,
    "2026-02-01": true,
    "2026-02-02": true,
    "2026-02-03": true,
    "2026-02-17": true,
    "2026-02-18": true,
    "2026-03-07": true,
    "2026-03-20": true,
    "2026-03-21": true,
    "2026-03-22": true,
    "2026-03-23": true,
    "2026-05-01": true,
    "2026-05-27": true,
    "2026-05-31": true,
    "2026-06-01": true,
    "2026-06-17": true,
    "2026-08-25": true,
    "2026-08-31": true,
    "2026-09-16": true,
    "2026-11-08": true,
    "2026-11-09": true,
    "2026-12-25": true
  };

  var products = {
    solo: {
      en: "12-Hour Entry",
      cn: "12 小时普通入场",
      unitEn: "/ person",
      unitCn: "/ 人",
      weekday: 169,
      weekend: 199,
      stay: "12h",
      kind: "spa-tiered",
      leadHours: 0,
      sc: 0.1,
      sst: 0.08
    },
    daytime: {
      en: "Daytime Entry",
      cn: "日间普通入场",
      unitEn: "/ person",
      unitCn: "/ 人",
      single: 199,
      stay: "daytime",
      kind: "spa-daily",
      leadHours: 0,
      hours: [9, 17],
      sc: 0.1,
      sst: 0.08
    },
    scrub: {
      en: "Body Scrub Add-On",
      cn: "古法搓背加项",
      unitEn: "/ person",
      unitCn: "/ 人",
      weekday: 199,
      weekend: 239,
      stay: "12h",
      kind: "spa-tiered",
      leadHours: 0,
      sc: 0.1,
      sst: 0.08
    },
    "allday-sm": {
      en: "Body Care Add-Ons",
      cn: "身体护理加项",
      unitEn: "/ person",
      unitCn: "/ 人",
      single: 379,
      stay: "12h",
      kind: "spa-daily",
      leadHours: 0,
      sc: 0.1,
      sst: 0.08
    },
    "daytime-duo": {
      en: "Two-Guest Booking",
      cn: "双人普通预约",
      unitEn: "/ 2 people",
      unitCn: "/ 2 人",
      single: 379,
      stay: "daytime",
      kind: "spa-daily",
      leadHours: 0,
      hours: [9, 17],
      sc: 0.1,
      sst: 0.08
    },
    kids: {
      en: "Kids Ticket",
      cn: "儿童票",
      unitEn: "/ child",
      unitCn: "/ 小孩",
      weekday: 58,
      weekend: 88,
      stay: "12h",
      kind: "spa-tiered",
      leadHours: 0,
      sc: 0.1,
      sst: 0.08
    },
    "outcall-classic": {
      en: "Classic 2-Hour Home Massage",
      cn: "经典 2 小时上门按摩",
      unitEn: "/ 2-hour session",
      unitCn: "/ 2 小时",
      single: 699,
      stay: "outcall",
      kind: "home",
      leadHours: 3,
      hours: [9, 22],
      sc: 0,
      sst: 0.08
    },
    "outcall-anytime": {
      en: "Anytime Hourly Home Massage (2h)",
      cn: "随时 2 小时上门按摩",
      unitEn: "/ 2-hour session",
      unitCn: "/ 2 小时",
      single: 798,
      stay: "outcall",
      kind: "home",
      leadHours: 3,
      sc: 0,
      sst: 0.08
    },
    "outcall-fourhands": {
      en: "Four-Hands Premium · 2h",
      cn: "四手尊宠 · 2 小时",
      unitEn: "/ 2-hour session",
      unitCn: "/ 2 小时",
      single: 1699,
      stay: "outcall",
      kind: "home",
      leadHours: 3,
      hours: [9, 22],
      sc: 0,
      sst: 0.08
    }
  };

  function locale() {
    return "cn";
  }

  function text(en, cn) {
    return locale() === "cn" ? cn : en;
  }

  function tr(lang, en, cn) {
    return lang === "cn" ? cn : en;
  }

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]").filter(function (item) {
        return item && products[item.code];
      });
    } catch {
      return [];
    }
  }

  function apiBase() {
    var configured = (window.ONESPA_API_BASE || "").trim().replace(/\/$/, "");
    if (configured) return configured;
    var saved = (localStorage.getItem(API_KEY) || "").trim().replace(/\/$/, "");
    if (saved) return saved;
    if (location.hostname === "localhost" && location.port !== "4000") return "http://localhost:4000";
    return "";
  }

  function endpoint(path) {
    return apiBase() + path;
  }

  function afterPageReady(callback) {
    if (document.readyState === "complete") {
      setTimeout(callback, 0);
      return;
    }
    window.addEventListener("load", function () {
      setTimeout(callback, 0);
    }, { once: true });
  }

  function setActiveSubnavLink(nav, link) {
    var changed = !link.classList.contains("on");
    nav.querySelectorAll(".pill").forEach(function (item) {
      var isActive = item === link;
      item.classList.toggle("on", isActive);
      if (isActive) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
    if (changed) link.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function initSubnav() {
    return;
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
  }

  function updateCartCount() {
    var count = readCart().reduce(function (sum, item) {
      return sum + Number(item.qty || 1);
    }, 0);
    var label = String(count);
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      // Only write when the value actually differs - this runs from a
      // MutationObserver, and an unconditional write would retrigger it.
      if (el.textContent !== label) el.textContent = label;
      if (el.hidden !== (count === 0)) el.hidden = count === 0;
    });
  }

  function money(value) {
    return "RM" + Number(value || 0).toFixed(2);
  }

  function baseMoney(value) {
    return "RM" + Number(value || 0).toFixed(0);
  }

  function today() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function selectedDateTime(date, time) {
    return new Date(date + "T" + time + ":00+08:00");
  }

  function minStartTime(product) {
    var d = new Date();
    d.setHours(d.getHours() + Number(product.leadHours == null ? 1 : product.leadHours));
    return d;
  }

  function isWeekendOrHoliday(date) {
    var day = new Date(date + "T12:00:00+08:00").getDay();
    return day === 5 || day === 6 || !!holidays[date];
  }

  function tierFor(product, date) {
    return product.single ? "single" : isWeekendOrHoliday(date) ? "weekend" : "weekday";
  }

  function basePrice(product, date) {
    var tier = tierFor(product, date);
    return product.single || product[tier];
  }

  function monthKey(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
  }

  function dateString(year, month, day) {
    return year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  }

  function monthTitle(date, lang) {
    var year = date.getFullYear();
    var month = date.getMonth();
    if (lang === "cn") return year + " 年 " + (month + 1) + " 月";
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  function selectedDateLabel(date, lang) {
    var d = new Date(date + "T12:00:00+08:00");
    if (lang === "cn") {
      return d.getMonth() + 1 + " 月 " + d.getDate() + " 日（星期" + ["日", "一", "二", "三", "四", "五", "六"][d.getDay()] + "）";
    }
    var mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    return mon + " " + d.getDate() + " (" + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] + ")";
  }

  function lineFor(item) {
    var product = products[item.code];
    var qty = Math.max(1, Number(item.qty || 1));
    var tier = tierFor(product, item.date);
    var price = basePrice(product, item.date);
    var subtotal = price * qty;
    var sc = Math.round(subtotal * product.sc * 100) / 100;
    var sst = Math.round((subtotal + sc) * product.sst * 100) / 100;
    return {
      product: product,
      tier: tier,
      price: price,
      qty: qty,
      subtotal: subtotal,
      sc: sc,
      sst: sst,
      total: subtotal + sc + sst
    };
  }

  function totals(items) {
    return items.reduce(
      function (sum, item) {
        var line = lineFor(item);
        sum.subtotal += line.subtotal;
        sum.sc += line.sc;
        sum.sst += line.sst;
        sum.total += line.total;
        return sum;
      },
      { subtotal: 0, sc: 0, sst: 0, total: 0 }
    );
  }

  function timeOptions(product, date, selected) {
    var start = 0;
    var end = 23;
    var minStart = minStartTime(product);
    if (product.hours) {
      start = product.hours[0];
      end = product.hours[1];
    }
    var html = "";
    for (var h = start; h <= end; h += 1) {
      var value = String(h).padStart(2, "0") + ":00";
      var disabled = selectedDateTime(date, value) < minStart;
      html +=
        '<button class="booking-time' +
        (selected === value ? " selected" : "") +
        '" type="button" data-booking-time="' +
        value +
        '"' +
        (disabled ? " disabled" : "") +
        ">" +
        value +
        "</button>";
    }
    return html;
  }

  function modal() {
    var existing = document.querySelector("[data-booking-modal]");
    if (existing) return existing;
    var el = document.createElement("div");
    el.className = "booking-modal";
    el.setAttribute("data-booking-modal", "");
    el.innerHTML =
      '<div class="booking-backdrop" aria-hidden="true"></div>' +
      '<form class="booking-panel" data-booking-form>' +
      '<button class="booking-x" type="button" data-booking-close aria-label="Close">×</button>' +
      '<h3 data-booking-title></h3>' +
      '<div class="booking-rulecards" data-booking-rates></div>' +
      '<p class="booking-tier-note" data-booking-tier-note></p>' +
      '<input name="date" type="hidden" required />' +
      '<div class="booking-calendar" aria-label="Booking calendar">' +
      '<div class="booking-monthbar"><button type="button" data-booking-prev aria-label="Previous month">‹</button><b data-booking-month></b><button type="button" data-booking-next aria-label="Next month">›</button></div>' +
      '<div class="booking-weekdays" data-booking-weekdays></div>' +
      '<div class="booking-days" data-booking-days></div>' +
      "</div>" +
      '<div class="booking-note" data-booking-note></div>' +
      '<input name="time" type="hidden" required />' +
      '<input name="qty" type="hidden" value="1" required />' +
      '<div class="booking-controls"><div><span class="booking-control-label" data-time-label></span><div class="booking-timegrid" data-booking-times></div></div><div><span class="booking-control-label" data-qty-label></span><div class="booking-stepper"><button type="button" data-booking-qty="-1">−</button><b data-booking-qty-value>1</b><button type="button" data-booking-qty="1">+</button></div></div></div>' +
      '<div class="booking-price" data-booking-price></div>' +
      '<p class="booking-error" data-booking-error hidden></p>' +
      '<button class="btn wide" type="submit" data-booking-submit></button>' +
      "</form>";
    document.body.appendChild(el);
    el.addEventListener("click", function (event) {
      if (event.target.closest("[data-booking-close]")) {
        closeModal();
        return;
      }

      var prev = event.target.closest("[data-booking-prev]");
      var next = event.target.closest("[data-booking-next]");
      var day = event.target.closest("[data-booking-day]");
      var time = event.target.closest("[data-booking-time]");
      var qty = event.target.closest("[data-booking-qty]");
      if (prev || next) {
        if (!bookingState) return;
        bookingState.month = new Date(
          bookingState.month.getFullYear(),
          bookingState.month.getMonth() + (prev ? -1 : 1),
          1
        );
        renderBookingCalendar(el);
        return;
      }
      if (day && !day.disabled) {
        el.querySelector("[data-booking-form]").elements.date.value = day.getAttribute("data-booking-day");
        renderBookingCalendar(el);
        renderBookingTimes(el);
        refreshBookingPrice(el);
      }
      if (time && !time.disabled) {
        el.querySelector("[data-booking-form]").elements.time.value = time.getAttribute("data-booking-time");
        setBookingError(el, "");
        renderBookingTimes(el);
        refreshBookingPrice(el);
      }
      if (qty) {
        var qtyInput = el.querySelector("[data-booking-form]").elements.qty;
        var nextQty = Math.max(1, Math.min(20, Number(qtyInput.value || 1) + Number(qty.getAttribute("data-booking-qty"))));
        qtyInput.value = String(nextQty);
        el.querySelector("[data-booking-qty-value]").textContent = String(nextQty);
        refreshBookingPrice(el);
      }
    });
    return el;
  }

  function setBookingError(el, message) {
    if (!el) return;
    var error = el.querySelector("[data-booking-error]");
    if (!error) return;
    error.textContent = message || "";
    error.hidden = !message;
  }

  function cartConfirmModal() {
    var existing = document.querySelector("[data-cart-confirm]");
    if (existing) return existing;
    var el = document.createElement("div");
    el.className = "cart-confirm-modal";
    el.setAttribute("data-cart-confirm", "");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<div class="cart-confirm-backdrop" aria-hidden="true"></div>' +
      '<section class="cart-confirm-panel" role="dialog" aria-modal="true" aria-labelledby="cart-confirm-title">' +
      '<button class="cart-confirm-x" type="button" data-cart-confirm-close aria-label="Close">×</button>' +
      '<div class="cart-confirm-mark" aria-hidden="true">✓</div>' +
      '<h3 id="cart-confirm-title" data-cart-confirm-title></h3>' +
      '<p data-cart-confirm-copy></p>' +
      '<div class="cart-confirm-actions">' +
      '<button class="btn line" type="button" data-cart-confirm-close data-cart-confirm-stay></button>' +
      '<a class="btn" data-cart-confirm-link></a>' +
      "</div>" +
      "</section>";
    document.body.appendChild(el);
    el.addEventListener("click", function (event) {
      if (event.target.closest("[data-cart-confirm-close]")) {
        closeCartConfirm();
      }
    });
    return el;
  }

  function closeCartConfirm() {
    var el = document.querySelector("[data-cart-confirm]");
    if (!el) return;
    el.classList.remove("on");
    el.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-confirm-open");
  }

  function openCartConfirm(item) {
    var lang = item.locale || locale();
    var el = cartConfirmModal();
    el.querySelector("[data-cart-confirm-title]").textContent = tr(lang, "Added to Cart", "已加入购物车");
    el.querySelector("[data-cart-confirm-copy]").textContent = tr(
      lang,
      "Your booking item is saved. You can continue browsing or checkout now.",
      "预约项目已保存。你可以继续浏览，或现在去结账。"
    );
    el.querySelector("[data-cart-confirm-stay]").textContent = tr(lang, "Continue Browsing", "继续浏览");
    var link = el.querySelector("[data-cart-confirm-link]");
    link.href = "/cart/";
    link.textContent = tr(lang, "Go to Cart", "去购物车");
    document.body.classList.add("cart-confirm-open");
    el.classList.add("on");
    el.setAttribute("aria-hidden", "false");
  }

  function rateCards(product, lang) {
    if (product.single) {
      return "";
    }

    return (
      '<div class="booking-rate-card"><span>' +
      tr(lang, "Sun-Thu", "星期日-四") +
      "</span><b>" +
      baseMoney(product.weekday) +
      "<sup>++</sup></b></div>" +
      '<div class="booking-rate-card"><span>' +
      tr(lang, "Fri, Sat & Public Holidays", "星期五六 & 公共假期") +
      "</span><b>" +
      baseMoney(product.weekend) +
      "<sup>++</sup></b></div>"
    );
  }

  function renderBookingCalendar(el) {
    if (!bookingState) return;
    var product = products[bookingState.code];
    var lang = bookingState.lang;
    var form = el.querySelector("[data-booking-form]");
    var selected = form.elements.date.value;
    var now = today();
    var month = bookingState.month;
    var year = month.getFullYear();
    var monthIndex = month.getMonth();
    var days = new Date(year, monthIndex + 1, 0).getDate();
    var firstDay = new Date(year, monthIndex, 1).getDay();
    var minMonth = monthKey(new Date(now + "T12:00:00+08:00"));
    var html = "";

    el.querySelector("[data-booking-month]").textContent = monthTitle(month, lang);
    el.querySelector("[data-booking-prev]").disabled = monthKey(month) <= minMonth;
    el.querySelector("[data-booking-weekdays]").innerHTML = (
      lang === "cn" ? ["日", "一", "二", "三", "四", "五", "六"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    )
      .map(function (day) {
        return "<span>" + day + "</span>";
      })
      .join("");

    for (var blank = 0; blank < firstDay; blank += 1) {
      html += '<span class="booking-day blank"></span>';
    }
    for (var day = 1; day <= days; day += 1) {
      var value = dateString(year, monthIndex, day);
      var disabled = value < now;
      var tier = tierFor(product, value);
      var holiday = !!holidays[value];
      var classes = "booking-day" + (selected === value ? " selected" : "") + (tier === "weekend" ? " premium" : "") + (disabled ? " disabled" : "");
      html +=
        '<button type="button" class="' +
        classes +
        '" data-booking-day="' +
        value +
        '"' +
        (disabled ? " disabled" : "") +
        ' aria-pressed="' +
        (selected === value ? "true" : "false") +
        '"><span class="booking-day-num">' +
        day +
        (holiday ? '<i aria-hidden="true"></i>' : "") +
        '</span><span class="booking-day-price">' +
        baseMoney(basePrice(product, value)) +
        "</span></button>";
    }
    el.querySelector("[data-booking-days]").innerHTML = html;
  }

  function firstAvailableTime(product, date) {
    var start = product.hours ? product.hours[0] : 0;
    var end = product.hours ? product.hours[1] : 23;
    var minStart = minStartTime(product);
    for (var h = start; h <= end; h += 1) {
      var value = String(h).padStart(2, "0") + ":00";
      if (selectedDateTime(date, value) >= minStart) return value;
    }
    return "";
  }

  function renderBookingTimes(el) {
    if (!bookingState) return;
    var form = el.querySelector("[data-booking-form]");
    var product = products[bookingState.code];
    var date = form.elements.date.value || today();
    var selected = form.elements.time.value;
    if (!selected || selectedDateTime(date, selected) < minStartTime(product)) {
      selected = firstAvailableTime(product, date);
      form.elements.time.value = selected;
    }
    el.querySelector("[data-booking-times]").innerHTML = selected
      ? timeOptions(product, date, selected)
      : '<span class="booking-no-slots">' + tr(bookingState.lang, "No online slots left for this date.", "这个日期已没有可线上预约时间。") + "</span>";
  }

  function bookingNotes(code, lang) {
    var notes = {
      solo: [
        tr(lang, "Regular 12-hour entry. Massage and treatments are separate add-ons.", "普通 12 小时入场。按摩与护理项目另行加购。"),
        tr(lang, "Choose your arrival date and approximate check-in time.", "选择到店日期和大概入场时间。"),
        tr(lang, "All items are charged at the regular listed price.", "所有项目按普通价目计算。"),
        tr(lang, "All items are charged at the regular listed price.", "所有项目按普通价目计算。")
      ],
      daytime: [
        tr(lang, "Booking time is your approximate arrival time.", "预约时间是大概到店时间。")
      ],
      scrub: [
        tr(lang, "This item is handled as a separate add-on.", "此项目按加项处理。")
      ],
      "allday-sm": [
        tr(lang, "Body-care add-ons are charged separately.", "身体护理加项另行收费。"),
        tr(lang, "Entry tickets are charged separately where needed.", "如需入场票，另行收费。")
      ],
      "daytime-duo": [
        tr(lang, "For two guests, choose the same date and time.", "两位客人请选择同一天同一时间。"),
        tr(lang, "The time selected is your approximate arrival time.", "选择的时间是大概到店时间。")
      ],
      kids: [
        tr(lang, "Kids Ticket: age 12 & under, must be accompanied by an adult", "儿童票：12 岁及以下，须有大人陪同入场"),
        tr(lang, "Children aged 2 and under can be registered at the front desk.", "2 岁及以下可到前台登记。")
      ],
      "outcall-classic": [
        tr(lang, "Fixed two-hour session; choose a start time from 9:00 am to 10:00 pm daily", "固定 2 小时；每日 09:00–22:00 可选开始时段"),
        tr(lang, "Our team will follow up on the address and arrival time.", "客服会跟进地址与到达时间。"),
        tr(lang, "RM100 travel fee applies; for urgent bookings within 3 hours, contact us directly.", "车费 RM100 另计；3 小时内加急请直接联系客服。")
      ],
      "outcall-anytime": [
        tr(lang, "Fixed two-hour session at RM798 flat; session length is not selected at checkout", "固定 2 小时、一口价 RM798，不在结账页自选时长"),
        tr(lang, "Our team will follow up on the address and arrival time.", "客服会跟进地址与到达时间。"),
        tr(lang, "RM100 travel fee applies; for a longer session or urgent bookings within 3 hours, contact us directly.", "车费 RM100 另计；更长时段或 3 小时内加急请直接联系客服。")
      ],
      "outcall-fourhands": [
        tr(lang, "Fixed two-hour session with two therapists working on one guest", "固定 2 小时，两位技师同时为一位客人服务"),
        tr(lang, "Choose a start time from 9:00 am to 10:00 pm daily; our team will follow up on details.", "每日 09:00–22:00 可选开始时段；客服会跟进细节。"),
        tr(lang, "RM100 travel fee applies; for urgent bookings within 3 hours, contact us directly.", "车费 RM100 另计；3 小时内加急请直接联系客服。")
      ]
    };

    return (notes[code] || [])
      .map(function (note) {
        return "<p>· " + note + "</p>";
      })
      .join("");
  }

  function refreshBookingPrice(el) {
    if (!bookingState) return;
    var form = el.querySelector("[data-booking-form]");
    var code = bookingState.code;
    var lang = bookingState.lang;
    var selectedDate = form.elements.date.value || today();
    var preview = lineFor({ code: code, date: selectedDate, time: form.elements.time.value || "00:00", qty: form.elements.qty.value });
    var unitPreview = lineFor({ code: code, date: selectedDate, time: form.elements.time.value || "00:00", qty: 1 });
    var unitTotal = Number((preview.price * preview.qty).toFixed(2));
    var selectedText = lang === "cn"
      ? "已选 " + selectedDateLabel(selectedDate, lang) + " · 当天 " + baseMoney(preview.price)
      : selectedDateLabel(selectedDate, lang) + " · " + baseMoney(preview.price);
    var allInText = lang === "cn"
      ? " · 到手 " + money(unitPreview.total)
      : " · " + money(unitPreview.total) + " all-in";
    el.querySelector("[data-booking-price]").innerHTML =
      "<strong>" + selectedText + '<b class="booking-allin">' + allInText + "</b></strong>";
    el.querySelector("[data-booking-submit]").textContent =
      preview.qty > 1
        ? tr(lang, "Book " + preview.qty + " · " + baseMoney(unitTotal), "预订 " + preview.qty + " 份 · " + baseMoney(unitTotal))
        : tr(lang, "Book · " + baseMoney(preview.price), "预订 · " + baseMoney(preview.price));
  }

  function closeModal() {
    var el = document.querySelector("[data-booking-modal]");
    if (el) el.classList.remove("on");
    document.body.classList.remove("booking-open");
  }

  function openModal(code, forcedLocale) {
    var product = products[code];
    if (!product) return;
    var el = modal();
    var form = el.querySelector("[data-booking-form]");
    var date = form.elements.date;
    var time = form.elements.time;
    var qty = form.elements.qty;
    var lang = forcedLocale || locale();
    var todayValue = today();

    bookingState = {
      code: code,
      lang: lang,
      month: new Date(todayValue + "T12:00:00+08:00")
    };
    form.dataset.code = code;
    form.dataset.locale = lang;
    el.querySelector("[data-booking-title]").textContent = tr(lang, "Pick your date", "选到店日期");
    el.querySelector("[data-booking-rates]").innerHTML = rateCards(product, lang);
    el.querySelector("[data-booking-tier-note]").textContent =
      product.single ? "" : tr(lang, "Sunday counts as weekday price.", "星期日也是平日价");
    el.querySelector("[data-booking-note]").innerHTML = bookingNotes(code, lang);
    el.querySelector("[data-time-label]").textContent = lang === "cn" ? "时间" : "Time";
    el.querySelector("[data-qty-label]").textContent = lang === "cn" ? "数量" : "Qty";
    el.querySelector("[data-booking-submit]").textContent = tr(lang, "Book", "预订");
    setBookingError(el, "");
    date.value = todayValue;
    time.value = "";
    qty.value = "1";
    el.querySelector("[data-booking-qty-value]").textContent = "1";

    renderBookingCalendar(el);
    renderBookingTimes(el);
    refreshBookingPrice(el);
    document.body.classList.add("booking-open");
    el.classList.add("on");
  }

  document.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-book]");
    if (!btn) return;
    event.preventDefault();
    openModal(btn.getAttribute("data-book"), btn.getAttribute("data-book-locale"));
  });

  document.addEventListener("submit", function (event) {
    var form = event.target.closest("[data-booking-form]");
    if (!form) return;
    event.preventDefault();
    var code = form.dataset.code;
    var product = products[code];
    if (!product) return;
    if (!form.elements.time.value) {
      setBookingError(document.querySelector("[data-booking-modal]"), text("Please choose a time before adding to cart.", "加入购物车前请选择时间。"));
      return;
    }
    var item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      code: code,
      locale: form.dataset.locale || locale(),
      name: form.dataset.locale === "cn" ? product.cn : product.en,
      date: form.elements.date.value,
      time: form.elements.time.value,
      qty: Math.max(1, Number(form.elements.qty.value || 1))
    };
    var cart = readCart();
    cart.push(item);
    writeCart(cart);
    closeModal();
    openCartConfirm(item);
  });

  function cartMessage(ref, items, customer) {
    var lang = locale();
    var lines = [];
    lines.push(lang === "cn" ? "你好，我已提交预约。" : "Hi, I have submitted a reservation.");
    if (ref) lines.push((lang === "cn" ? "预约编号: " : "Reservation ref: ") + ref);
    lines.push((lang === "cn" ? "姓名: " : "Name: ") + customer.name);
    if (customer.phone) lines.push("WhatsApp: " + customer.phone);
    if (customer.telegram) lines.push("Telegram: " + customer.telegram);
    items.forEach(function (item, index) {
      var line = lineFor(item);
      lines.push(
        (index + 1) +
          ". " +
          (lang === "cn" ? line.product.cn : line.product.en) +
          " x" +
          line.qty +
          " · " +
          item.date +
          " " +
          item.time +
          " · " +
          money(line.total)
      );
    });
    return lines.join("\n");
  }

  function renderCart() {
    var root = document.querySelector("[data-cart-page]");
    if (!root) return;
    var lang = root.getAttribute("data-locale") || locale();
    var items = readCart();

    if (!items.length) {
      root.innerHTML =
        '<div class="cart-empty"><h3>' +
        (lang === "cn" ? "购物车是空的" : "Your cart is empty") +
        "</h3><p>" +
        (lang === "cn" ? "先选择普通入场和预约时间。" : "Pick an entry ticket and reservation time first.") +
        '</p><a class="btn" href="' +
        "/packages/" +
        '">' +
        (lang === "cn" ? "看价目" : "View Prices") +
        "</a></div>";
      return;
    }

    var sum = totals(items);
    var rows = items
      .map(function (item) {
        var line = lineFor(item);
        return (
          '<article class="cart-item"><div><h3>' +
          (lang === "cn" ? line.product.cn : line.product.en) +
          "</h3><p>" +
          item.date +
          " · " +
          item.time +
          " · " +
          (lang === "cn" ? "数量 " : "Qty ") +
          line.qty +
          " · " +
          (lang === "cn" ? line.product.unitCn : line.product.unitEn) +
          '</p></div><div class="cart-item-price">' +
          money(line.total) +
          '</div><button type="button" class="cart-remove" data-remove="' +
          item.id +
          '">' +
          (lang === "cn" ? "移除" : "Remove") +
          "</button></article>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="cart-layout"><div class="cart-list">' +
      rows +
      '</div><form class="reserve-form" data-reserve-form><h3>' +
      (lang === "cn" ? "结账资料" : "Checkout Details") +
      '</h3><label><span>' +
      (lang === "cn" ? "姓名" : "Name") +
      '</span><input name="name" required autocomplete="name" /></label><label><span>' +
      (lang === "cn" ? "WhatsApp 电话" : "WhatsApp phone") +
      '</span><input name="phone" autocomplete="tel" placeholder="' +
      (lang === "cn" ? "例如 +60 14-315 5632" : "Example: +60 14-315 5632") +
      '" /></label><label><span>' +
      (lang === "cn" ? "Telegram 用户名" : "Telegram username") +
      '</span><input name="telegram" autocomplete="off" placeholder="' +
      (lang === "cn" ? "例如 @username" : "Example: @username") +
      '" /></label><p class="reserve-help">' +
      (lang === "cn" ? "WhatsApp 或 Telegram 至少填一个。" : "Fill in WhatsApp or Telegram, at least one contact method.") +
      '</p><label><span>Email</span><input name="email" type="email" autocomplete="email" /></label><label><span>' +
      (lang === "cn" ? "备注" : "Notes") +
      '</span><textarea name="notes" rows="3"></textarea></label><div class="cart-total"><div><span>Subtotal</span><b>' +
      money(sum.subtotal) +
      "</b></div><div><span>Service charge</span><b>" +
      money(sum.sc) +
      "</b></div><div><span>SST</span><b>" +
      money(sum.sst) +
      "</b></div><div class=\"grand\"><span>Total</span><b>" +
      money(sum.total) +
      "</b></div></div><p class=\"cart-pay-note\">" +
      (lang === "cn" ? "提交后客服会尽快跟进。" : "Our team will follow up soon after submission.") +
      '</p><button class="btn wide" type="submit">' +
      (lang === "cn" ? "提交预约" : "Submit Reservation") +
      '</button><div class="reserve-status" data-reserve-status></div></form></div>';
  }

  document.addEventListener("click", function (event) {
    var remove = event.target.closest("[data-remove]");
    if (!remove) return;
    writeCart(readCart().filter(function (item) {
      return item.id !== remove.getAttribute("data-remove");
    }));
    renderCart();
  });

  document.addEventListener("submit", function (event) {
    var form = event.target.closest("[data-reserve-form]");
    if (!form) return;
    event.preventDefault();
    var status = form.querySelector("[data-reserve-status]");
    var items = readCart();
    var customer = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      telegram: form.elements.telegram.value.trim(),
      email: form.elements.email.value.trim(),
      notes: form.elements.notes.value.trim()
    };
    if (!customer.phone && !customer.telegram) {
      status.textContent = text("Please provide WhatsApp phone or Telegram username.", "请至少填写 WhatsApp 电话或 Telegram 用户名。");
      return;
    }
    status.textContent = text("Saving reservation...", "正在保存预约...");
    fetch(endpoint("/api/reservations"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: locale(), customer: customer, items: items })
    })
      .then(function (res) {
        return res.json().then(function (body) {
          if (!res.ok) throw new Error(body.error || "Reservation failed");
          return body;
        });
      })
      .then(function (body) {
        writeCart([]);
        var ref = body.reservation && body.reservation.reservation_ref;
        var href = WA + encodeURIComponent(cartMessage(ref, items, customer));
        status.innerHTML =
          '<div class="reserve-ok"><b>' +
          (locale() === "cn" ? "预约已提交" : "Reservation submitted") +
          "</b><p>" +
          (ref || "") +
          '</p><div class="reserve-contact-actions"><a class="btn contact-wa" target="_blank" rel="noopener" href="' +
          href +
          '">' +
          (locale() === "cn" ? "发送 WhatsApp 给店员" : "Send WhatsApp to Staff") +
          '</a><a class="btn contact-tg" target="_blank" rel="noopener" href="' +
          TG +
          '">' +
          (locale() === "cn" ? "Telegram 联系店员" : "Contact Staff on Telegram") +
          "</a></div></div>";
        updateCartCount();
      })
      .catch(function (error) {
        var href = WA + encodeURIComponent(cartMessage("", items, customer));
        status.innerHTML =
          '<div class="reserve-error"><b>' +
          (locale() === "cn" ? "预约暂时无法保存" : "Reservation could not be saved") +
          "</b><p>" +
          error.message +
          '</p><div class="reserve-contact-actions"><a class="btn contact-wa" target="_blank" rel="noopener" href="' +
          href +
          '">' +
          (locale() === "cn" ? "改用 WhatsApp 发送" : "Send by WhatsApp Instead") +
          '</a><a class="btn contact-tg" target="_blank" rel="noopener" href="' +
          TG +
          '">' +
          (locale() === "cn" ? "改用 Telegram 联系" : "Contact by Telegram Instead") +
          "</a></div></div>";
      });
  });

  afterPageReady(function () {
    updateCartCount();
    renderCart();
    initSubnav();
  });

  /**
   * This script is deferred, so it runs and paints before React finishes
   * hydrating. Hydration then reconciles the shell back to its server-rendered
   * markup, wiping out whatever we rendered - which left the cart stuck on
   * "Loading your cart..." and the header badge on 0 until a manual refresh.
   *
   * Re-render whenever the placeholder reappears. renderCart() only runs while
   * .cart-loading is on screen, so this settles after one pass and never
   * clobbers a checkout form the customer is part-way through filling in.
   */
  function refreshCartUI() {
    updateCartCount();
    var root = document.querySelector("[data-cart-page]");
    if (root && root.querySelector(".cart-loading")) renderCart();
  }

  // setTimeout rather than requestAnimationFrame: rAF is paused in background
  // and inactive tabs, which would leave the cart unrendered until the tab is
  // focused - the same "refresh before it works" symptom we are fixing.
  var refreshQueued = false;
  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    setTimeout(function () {
      refreshQueued = false;
      refreshCartUI();
    }, 0);
  }

  if (window.MutationObserver && document.body) {
    new MutationObserver(queueRefresh).observe(document.body, { childList: true, subtree: true });
  }

  // Back/forward out of the bfcache does not fire load, and another tab may
  // have changed the cart while this one sat idle.
  window.addEventListener("pageshow", queueRefresh);
  window.addEventListener("popstate", queueRefresh);
  window.addEventListener("storage", function (event) {
    if (!event.key || event.key === CART_KEY) queueRefresh();
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) queueRefresh();
  });
})();
