/* =====================================================================
   Runs synchronously in <head>, before first paint.
   Lives in its own file so the Content-Security-Policy can forbid every
   inline script on the page.
   ===================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;

  // Clickjacking defence. GitHub Pages cannot send X-Frame-Options or a
  // frame-ancestors header, so refuse to render inside another site's frame.
  // Same-origin frames and local previews (localhost, file://) are left alone.
  if (window.top !== window.self) {
    var local = /^(localhost|127\.0\.0\.1|\[::1\])?$/.test(location.hostname);
    var sameOrigin = false;
    try {
      sameOrigin = window.top.location.origin === location.origin;
    } catch (e) {
      /* cross-origin parent: access throws */
    }
    if (!local && !sameOrigin) {
      root.style.display = "none";
      try {
        window.top.location = location.href;
      } catch (e) {
        /* sandboxed frame: stay hidden */
      }
    }
  }

  // Scroll-reveal hides content only while .js is set. If js/main.js never finishes
  // (network error, or a typo in js/data.js), show everything instead of a blank page.
  root.classList.add("js");
  window.addEventListener("load", function () {
    if (!root.classList.contains("is-ready")) root.classList.remove("js");
  });

  // Apply the saved theme before paint to avoid a flash. The key is namespaced
  // because every project under this github.io origin shares one localStorage.
  try {
    var KEY = "portfolio.theme";
    var theme = localStorage.getItem(KEY);
    if (!theme) {
      theme = localStorage.getItem("theme"); // pre-namespace key
      if (theme === "light" || theme === "dark") localStorage.setItem(KEY, theme);
      localStorage.removeItem("theme");
    }
    // No saved choice: follow the operating system (paper by day, graphite by night)
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.setAttribute("data-theme", theme);
  } catch (e) {
    /* storage unavailable */
  }
})();
