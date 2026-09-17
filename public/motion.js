/* Header state, mobile drawer and in-page nav highlighting.

   Reveal-on-scroll is not here: it lives in globals.css as a scroll-driven
   animation, because hydration in this RSC setup finishes after window load
   and discards classes a script adds. The toggles below only fire on user
   interaction or scroll, well after that, so they survive. */
(function () {
  "use strict";

  var root = document.documentElement;

  function clearStaleScrollLocks() {
    document.body.classList.remove("booking-open", "cart-confirm-open");
    root.classList.remove("tech-inquiry-modal-open");
  }
  /* Lifts the sticky bar off the page once the user has scrolled. */
  function initHeader() {
    if (!document.querySelector(".topbar")) return;

    var onScroll = function () {
      root.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Close the <details> drawer on outside click, on Escape, and after a tap
     on one of its links - a drawer left open is a common annoyance. */
  function initDrawer() {
    var drawer = document.querySelector(".mnav");
    if (!drawer) return;

    document.addEventListener("click", function (event) {
      if (drawer.open && !drawer.contains(event.target)) drawer.open = false;
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer.open) drawer.open = false;
    });

    drawer.addEventListener("click", function (event) {
      if (event.target.closest(".mnav-list a")) drawer.open = false;
    });
  }

  /* Highlight the subnav pill whose section is currently in view. */
  function initSubnav() {
    var pills = document.querySelectorAll(".subnav .pill[href^='#']");
    if (!pills.length) return;

    var map = [];
    for (var i = 0; i < pills.length; i++) {
      var id = pills[i].getAttribute("href").slice(1);
      var section = id && document.getElementById(id);
      if (section) map.push({ pill: pills[i], section: section });
    }
    if (!map.length) return;

    function keepPillVisible(pill) {
      var nav = pill.closest(".subnav");
      if (!nav) return;
      var navBox = nav.getBoundingClientRect();
      var pillBox = pill.getBoundingClientRect();
      if (pillBox.left < navBox.left || pillBox.right > navBox.right) {
        nav.scrollTo({
          left: nav.scrollLeft + pillBox.left - navBox.left - navBox.width / 3,
          behavior: "smooth"
        });
      }
    }

    function setActive(current, keepVisible) {
      for (var i = 0; i < map.length; i++) {
        var active = map[i] === current;
        map[i].pill.classList.toggle("on", active);
        if (active) map[i].pill.setAttribute("aria-current", "true");
        else map[i].pill.removeAttribute("aria-current");
      }
      if (keepVisible) keepPillVisible(current.pill);
    }

    function refreshActive() {
      var anchor = (document.querySelector(".topbar")?.getBoundingClientRect().bottom || 0) + 80;
      var current = map[0];
      for (var i = 0; i < map.length; i++) {
        if (map[i].section.getBoundingClientRect().top <= anchor) current = map[i];
      }
      setActive(current, false);
    }

    document.addEventListener("click", function (event) {
      var link = event.target.closest(".subnav .pill[href^='#']");
      if (!link) return;
      for (var i = 0; i < map.length; i++) {
        if (map[i].pill === link) setActive(map[i], true);
      }
    });
    refreshActive();
    window.addEventListener("scroll", refreshActive, { passive: true });
    window.addEventListener("resize", refreshActive);
  }

  function init() {
    clearStaleScrollLocks();
    initHeader();
    initDrawer();
    initSubnav();
  }

  window.addEventListener("pageshow", clearStaleScrollLocks);
  window.addEventListener("hashchange", clearStaleScrollLocks);

  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
})();
