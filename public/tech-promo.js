(function () {
  var mediaBase = "https://chuqinbiao.klyihao.com";
  var showDelay = 2200;
  var promoHidden = true;
  var whatsappHref =
    "https://wa.me/60143155632?text=%E4%BD%A0%E5%A5%BD%EF%BC%8C%E6%88%91%E6%83%B3%E5%92%A8%E8%AF%A2%E6%8A%80%E5%B8%88%E6%8C%91%E9%80%89";
  var popup = null;
  var modal = null;
  var timer = null;

  if (/^\/(?:admin|cart|cn\/cart|jishi-tiaoxuan)(?:\/|$)/.test(window.location.pathname)) return;

  function mediaUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return mediaBase.replace(/\/$/, "") + (path.charAt(0) === "/" ? path : "/" + path);
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function collectPhotos(technicians) {
    var photos = [];
    (Array.isArray(technicians) ? technicians : []).forEach(function (tech) {
      (Array.isArray(tech.media) ? tech.media : [])
        .filter(function (item) {
          return item && item.type === "photo" && item.filePath;
        })
        .forEach(function (item) {
          photos.push({
            name: tech.name || "技师挑选",
            zone: tech.zone || "",
            src: mediaUrl(item.filePath),
          });
        });
    });
    return shuffle(photos);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function probePhoto(item) {
    return new Promise(function (resolve) {
      var image = new Image();
      var settled = false;
      var timeout = window.setTimeout(function () {
        if (settled) return;
        settled = true;
        resolve(null);
      }, 4500);

      image.onload = function () {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve(image.naturalWidth > 40 && image.naturalHeight > 40 ? item : null);
      };
      image.onerror = function () {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve(null);
      };
      image.src = item.src;
    });
  }

  async function firstWorkingPhoto(items) {
    var limit = Math.min(items.length, 24);
    for (var i = 0; i < limit; i += 1) {
      var photo = await probePhoto(items[i]);
      if (photo) return photo;
    }
    return null;
  }

  function schedule(delay) {
    window.clearTimeout(timer);
    timer = window.setTimeout(show, delay);
  }

  function closePopup(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (popup) {
      popup.remove();
      popup = null;
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.documentElement.classList.remove("tech-inquiry-modal-open");
  }

  function openModal(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    ensureModal();
    modal.hidden = false;
    document.documentElement.classList.add("tech-inquiry-modal-open");
    modal.querySelector(".tech-inquiry-modal-whatsapp")?.focus();
  }

  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "tech-inquiry-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="tech-inquiry-modal-backdrop" data-tech-modal-close></div>' +
      '<section class="tech-inquiry-modal-card" role="dialog" aria-modal="true" aria-label="技师挑选 WhatsApp 咨询">' +
      '<button class="tech-inquiry-modal-close" type="button" data-tech-modal-close aria-label="关闭">&times;</button>' +
      '<span class="tech-inquiry-modal-kicker">最新!! 男士必看</span>' +
      "<h3>技师挑选</h3>" +
      "<p>可以通过 WhatsApp 咨询更多关于技师挑选的内容哦 💋✨</p>" +
      '<a class="tech-inquiry-modal-whatsapp contact-wa whatsapp" href="' +
      whatsappHref +
      '" target="_blank" rel="noopener" data-click-source="jishi_tiaoxuan" aria-label="WhatsApp 咨询技师挑选">WhatsApp 咨询客服</a>' +
      "</section>";
    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-tech-modal-close]")) closeModal();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeModal();
    });
  }

  function render(photo) {
    if (popup) popup.remove();

    popup = document.createElement("aside");
    popup.className = "tech-promo";
    popup.setAttribute("aria-label", "技师挑选广告");
    popup.innerHTML =
      '<button class="tech-promo-card" type="button" data-tech-inquiry aria-label="打开技师挑选 WhatsApp 咨询">' +
      '<img src="' +
      escapeHtml(photo.src) +
      '" alt="' +
      escapeHtml(photo.name) +
      ' 技师照片">' +
      '<span class="tech-promo-badge">最新!!</span>' +
      '<span class="tech-promo-copy"><b>男士必看</b><strong>技师挑选</strong><small>' +
      escapeHtml(photo.name) +
      (photo.zone ? " · " + escapeHtml(photo.zone) + "区" : "") +
      "</small></span>" +
      "</button>" +
      '<button class="tech-promo-close" type="button" aria-label="关闭技师挑选广告">&times;</button>';

    document.body.appendChild(popup);
    popup.querySelector(".tech-promo-card")?.addEventListener("click", openModal);
    popup.querySelector(".tech-promo-close")?.addEventListener("click", closePopup);
  }

  async function show() {
    try {
      var response = await fetch("/api/technicians/working-today?promo=1", { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      var body = await response.json();
      var technicians = Array.isArray(body) ? body : body.technicians;
      var photo = await firstWorkingPhoto(collectPhotos(technicians));
      if (!photo) return;
      render(photo);
    } catch (error) {
      console.warn("Unable to show technician promo", error);
    }
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var inquiry = target.closest("[data-tech-inquiry]");
    if (inquiry) return openModal(event);

    var link = target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    try {
      var url = new URL(href, window.location.origin);
      if (/^\/jishi-tiaoxuan\/?$/.test(url.pathname)) openModal(event);
    } catch {}
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      ensureModal();
      if (!promoHidden) schedule(showDelay);
    });
  } else {
    ensureModal();
    if (!promoHidden) schedule(showDelay);
  }
})();
