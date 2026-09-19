/* =====================================================================
   Portfolio – main script
   Renders content from js/data.js and wires up interactions.
   ===================================================================== */
(function () {
  "use strict";

  const data = PORTFOLIO;
  const { profile, integrations } = data;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Only http(s), mailto and same-site relative URLs may become links or image sources.
  // Blocks javascript:/data: URLs even if js/data.js or an API response is tampered with.
  const safeUrl = (url = "") => {
    const value = String(url).trim();
    if (!value) return "";
    try {
      const { protocol } = new URL(value, document.baseURI);
      // file: keeps relative paths working when index.html is opened straight from disk
      return ["http:", "https:", "mailto:", "file:"].includes(protocol) ? value : "";
    } catch (e) {
      return "";
    }
  };
  const count = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

  /* ---------------- Icons (inline SVG, stroke-based) ---------------- */
  const PATHS = {
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    fork: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8M12 12v4"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  };
  const icon = (name, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name] || PATHS.code}</svg>`;

  const BRAND = {
    github:
      '<svg class="icon icon--fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>',
    linkedin:
      '<svg class="icon icon--fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    email: icon("mail"),
  };

  /* ---------------- Profile bindings ---------------- */
  function bindProfile() {
    $$("[data-bind]").forEach((el) => {
      const value = profile[el.dataset.bind];
      if (value) el.textContent = value;
    });
    $$("[data-bind-href]").forEach((el) => {
      const key = el.dataset.bindHref;
      const value = key === "mailto" ? `mailto:${profile.email}` : profile[key];
      if (safeUrl(value)) el.setAttribute("href", safeUrl(value));
    });
    $$("[data-bind-src]").forEach((el) => {
      const value = profile[el.dataset.bindSrc];
      if (safeUrl(value)) el.setAttribute("src", safeUrl(value));
    });
    $$("[data-bind-alt]").forEach((el) => {
      const value = profile[el.dataset.bindAlt];
      if (value) el.setAttribute("alt", value);
    });
    document.title = `${profile.name} | Software Engineer Portfolio`;
    // "Rev." is the month this copy of the page was last deployed
    const modified = new Date(document.lastModified);
    if (!Number.isNaN(modified.getTime())) {
      const rev = `${modified.getFullYear()}.${String(modified.getMonth() + 1).padStart(2, "0")}`;
      $$("[data-rev]").forEach((el) => (el.textContent = rev));
    }
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function renderSocials() {
    // Any social with an empty URL (e.g. linkedin: "") is skipped everywhere.
    const links = [
      { label: "GitHub", href: profile.github, svg: BRAND.github, external: true },
      { label: "LinkedIn", href: profile.linkedin, svg: BRAND.linkedin, external: true },
      { label: "Email", href: profile.email ? `mailto:${profile.email}` : "", svg: BRAND.email },
    ].filter((l) => safeUrl(l.href));
    const html = links
      .map(
        (l) => `<li><a class="social" href="${esc(safeUrl(l.href))}" aria-label="${l.label}" title="${l.label}"${
          l.external ? ' target="_blank" rel="noopener noreferrer"' : ""
        }>${l.svg}</a></li>`
      )
      .join("");
    $$("[data-socials]").forEach((ul) => (ul.innerHTML = html));
  }

  /* ---------------- Hero "At a glance" table ---------------- */
  function renderGlance() {
    const el = $("[data-glance]");
    if (!el || !Array.isArray(data.glance)) return;
    const rows = data.glance.map((r) => `<div><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`);
    if (profile.availabilityShort) {
      rows.push(
        `<div><dt>Status</dt><dd class="spec__status"><span class="status-dot" aria-hidden="true"></span>${esc(profile.availabilityShort)}</dd></div>`
      );
    }
    el.innerHTML = rows.join("");
  }

  /* ---------------- Hero stats (count-up) ---------------- */
  function renderStats() {
    const el = $("[data-stats]");
    if (!el) return;
    const stats = Array.isArray(data.stats) ? data.stats : [];
    if (!stats.length) {
      el.hidden = true;
      return;
    }
    el.innerHTML = stats
      .map(
        (s) => `<li><span class="stat__value" data-count="${Number(s.value) || 0}">${
          prefersReducedMotion ? esc(String(s.value)) : "0"
        }${esc(s.suffix || "")}</span><span class="stat__label">${esc(s.label)}</span></li>`
      )
      .join("");
    if (prefersReducedMotion) return;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const run = (node) => {
      const target = Number(node.dataset.count);
      const suffix = node.textContent.replace(/^[\d.,]+/, "");
      const duration = 1400;
      let start;
      const step = (now) => {
        if (!start) start = now;
        const p = Math.min((now - start) / duration, 1);
        node.textContent = Math.round(target * easeOut(p)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    setTimeout(() => $$(".stat__value", el).forEach(run), 500);
  }

  /* ---------------- Section renderers ---------------- */
  function renderInterests() {
    const el = $("[data-interests]");
    if (el) el.innerHTML = data.interests.map((i) => `<li class="tag">${esc(i)}</li>`).join("");
  }

  function skillIcon(item) {
    if (item.icon) {
      return `<img src="${esc(safeUrl(item.icon))}" alt="" width="22" height="22" loading="lazy" decoding="async" class="skill__img${
        item.invert ? " skill__img--invert" : ""
      }" data-fallback="${esc(item.badge || item.name.slice(0, 2))}" />`;
    }
    return `<span class="skill__badge">${esc(item.badge || item.name.slice(0, 2))}</span>`;
  }

  // Swap to a text badge if an icon fails to load (e.g. offline)
  function guardIcons(root) {
    $$(".skill__img", root).forEach((img) =>
      img.addEventListener("error", () => {
        const badge = document.createElement("span");
        badge.className = "skill__badge";
        badge.textContent = img.dataset.fallback;
        img.replaceWith(badge);
      })
    );
  }

  function renderSkills() {
    const el = $("[data-skills]");
    if (!el) return;
    el.innerHTML = data.skills
      .map(
        (group) => `
        <section class="skill-row reveal" aria-label="${esc(group.category)}">
          <header class="skill-row__head">
            <h3>${esc(group.category)}</h3>
            <span class="skill-row__count" aria-hidden="true">${String(group.items.length).padStart(2, "0")}</span>
          </header>
          <ul class="skill-list">
            ${group.items
              .map((item) => `<li class="skill">${skillIcon(item)}<span>${esc(item.name)}</span></li>`)
              .join("")}
          </ul>
        </section>`
      )
      .join("");
    guardIcons(el);
  }


  function renderProjects() {
    const el = $("[data-projects]");
    if (!el) return;
    el.innerHTML = data.projects
      .map((project, i) => {
        const p = {
          ...project,
          github: safeUrl(project.github),
          demo: safeUrl(project.demo),
          download: safeUrl(project.download),
        };
        const link = p.demo || p.github;
        const viewLabel = p.demo ? p.demoLabel || "Open live demo" : "View source";
        const media = `<img src="${esc(safeUrl(p.image))}" alt="Screenshot of ${esc(p.title)}" loading="lazy" decoding="async" width="1280" height="800" />`;
        const specs = [
          ["Type", esc(p.type || "")],
          [
            "Stack",
            `<ul class="chip-list" aria-label="Technologies used">${p.tech.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`,
          ],
          ["Tests", esc(p.tests || "")],
        ].filter(([, value]) => value);
        return `
        <article class="project reveal${p.featured ? " project--featured" : ""}">
          <figure class="figure project__figure">
            ${
              link
                ? `<a class="figure__frame project__media" href="${esc(link)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(viewLabel)}: ${esc(p.title)}" tabindex="-1">${media}</a>`
                : `<div class="figure__frame project__media">${media}</div>`
            }
            <figcaption class="figure__caption"><span>Fig. ${String(i + 1).padStart(2, "0")}</span> ${esc(p.title)}</figcaption>
          </figure>
          <div class="project__body">
            <h3 class="project__title">${esc(p.title)}</h3>
            <p class="project__desc">${esc(p.description)}</p>
            <dl class="project__specs">
              ${specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
            </dl>
            ${
              p.features && p.features.length
                ? `<ul class="project__features">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`
                : ""
            }
            <div class="project__actions">
              ${
                p.demo
                  ? `<a class="btn btn--primary btn--sm" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">${esc(p.demoLabel || "Live demo")} ${icon(p.demoLabel ? "download" : "arrow")}</a>`
                  : ""
              }
              ${
                p.github
                  ? `<a class="btn btn--outline btn--sm" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">${BRAND.github} Source</a>`
                  : ""
              }
              ${
                p.download
                  ? `<a class="btn btn--outline btn--sm" href="${esc(p.download)}" target="_blank" rel="noopener noreferrer">${icon("download")} Download</a>`
                  : ""
              }
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  function renderExperience() {
    const el = $("[data-experience]");
    if (!el) return;
    el.innerHTML = data.experience
      .map(
        (x) => `
        <li class="timeline__item reveal">
          <div class="timeline__meta">
            <p class="timeline__period">${esc(x.period)}</p>
            ${x.type ? `<p class="timeline__type">${esc(x.type)}</p>` : ""}
          </div>
          <article class="timeline__main">
            <h3 class="timeline__role">${esc(x.role)}</h3>
            <p class="timeline__org">${esc(x.org)}</p>
            <ul class="timeline__points">
              ${x.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}
            </ul>
          </article>
        </li>`
      )
      .join("");
  }

  function renderEducation() {
    const el = $("[data-education]");
    if (!el) return;
    el.innerHTML = data.education
      .map(
        (e) => `
        <article class="edu reveal">
          <div class="edu__main">
            <p class="edu__degree">${esc(e.degree)}</p>
            <h3 class="edu__program">${esc(e.program)}</h3>
            <p class="edu__school">${esc(e.school)}</p>
            <p class="edu__period">${esc(e.period)}</p>
          </div>
          ${
            e.coursework && e.coursework.length
              ? `<div class="edu__courses">
                  <h4>Relevant coursework</h4>
                  <ul class="tag-list">${e.coursework.map((c) => `<li class="tag">${esc(c)}</li>`).join("")}</ul>
                </div>`
              : ""
          }
        </article>`
      )
      .join("");
  }

  function renderCertifications() {
    const el = $("[data-certifications]");
    if (!el) return;
    if (!data.certifications || !data.certifications.length) {
      $("#certifications").hidden = true;
      return;
    }
    el.innerHTML = data.certifications
      .map(
        (c) => `
        <article class="cert reveal">
          <p class="cert__date">${esc(c.date)}</p>
          <h3 class="cert__name">${esc(c.name)}</h3>
          <p class="cert__org">${esc(c.org)}</p>
          ${
            safeUrl(c.url)
              ? `<a class="link-arrow" href="${esc(safeUrl(c.url))}" target="_blank" rel="noopener noreferrer">View Certificate ${icon("external")}</a>`
              : ""
          }
        </article>`
      )
      .join("");
  }

  // Keep the "01 · About" eyebrow numbers sequential when a section is hidden
  function numberSections() {
    let n = 0;
    $$("main > section:not([hidden]) .section__eyebrow").forEach((el) => {
      n += 1;
      el.textContent = el.textContent.replace(/^\d+/, String(n).padStart(2, "0"));
    });
  }

  function renderServices() {
    const el = $("[data-services]");
    if (!el) return;
    el.innerHTML = data.services
      .map(
        (s, i) => `
        <article class="service reveal">
          <span class="service__index" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </article>`
      )
      .join("");
  }

  /* ---------------- GitHub repositories (optional) ---------------- */
  async function loadGitHubRepos() {
    const user = (integrations.githubUsername || "").trim();
    const wrap = $("[data-repos]");
    const grid = $("[data-repos-grid]");
    if (!user || !wrap || !grid) return;

    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=30`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const repos = (await res.json())
        .filter((r) => !r.fork && !r.archived && safeUrl(r.html_url))
        .slice(0, integrations.githubRepoCount || 6);
      if (!repos.length) return;

      grid.innerHTML = repos
        .map(
          (r) => `
          <a class="repo" href="${esc(safeUrl(r.html_url))}" target="_blank" rel="noopener noreferrer">
            <h4 class="repo__name"><span>${esc(r.name)}</span></h4>
            <p class="repo__desc">${esc(r.description || "No description provided.")}</p>
            <p class="repo__meta">
              <span>${esc(r.language || "—")}</span>
              <span>${icon("star")}${count(r.stargazers_count)}</span>
              <span>${icon("fork")}${count(r.forks_count)}</span>
            </p>
          </a>`
        )
        .join("");
      wrap.hidden = false;
    } catch (err) {
      console.warn("Could not load GitHub repositories:", err);
    }
  }

  /* ---------------- Theme toggle ---------------- */
  function initTheme() {
    const btn = $("#themeToggle");
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');
    let fadeTimer;

    const apply = (theme) => {
      root.setAttribute("data-theme", theme);
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      if (meta) meta.setAttribute("content", theme === "dark" ? "#111315" : "#f4f1ea");
    };
    apply(root.getAttribute("data-theme") || "light");

    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (!prefersReducedMotion) {
        root.classList.add("theme-fade");
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => root.classList.remove("theme-fade"), 450);
      }
      apply(next);
      try {
        localStorage.setItem("portfolio.theme", next);
      } catch (e) {
        /* storage unavailable */
      }
    });
  }

  /* ---------------- Navigation ---------------- */
  function initNav() {
    const header = $("#siteHeader");
    const toggle = $("#navToggle");
    const links = $("#navLinks");
    const navLinks = $$(".nav__link");
    const progress = $("#scrollProgress");
    const backToTop = $("#backToTop");
    const desktop = window.matchMedia("(min-width: 961px)");

    const setOpen = (open) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    desktop.addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
      moveIndicator();
    });

    // Sliding active-link indicator (desktop only)
    let active = null;
    const moveIndicator = () => {
      if (!desktop.matches || !active) {
        links.style.setProperty("--o", "0");
        return;
      }
      // Read layout first, then write, to avoid forced reflows
      const x = active.offsetLeft;
      const w = active.offsetWidth;
      links.style.setProperty("--x", `${x}px`);
      links.style.setProperty("--w", `${w}px`);
      links.style.setProperty("--o", "1");
    };
    const setActive = (link) => {
      if (link === active) return;
      active = link;
      moveIndicator();
      navLinks.forEach((a) => {
        a.classList.toggle("is-active", a === link);
        if (a === link) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    window.addEventListener("resize", moveIndicator, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

    // Scroll: header glass, progress bar, back-to-top
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header.classList.toggle("is-scrolled", y > 10);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.setProperty("--p", max > 0 ? Math.min(y / max, 1).toFixed(4) : "0");
        if (backToTop) {
          const show = y > 700;
          backToTop.classList.toggle("is-visible", show);
          backToTop.setAttribute("tabindex", show ? "0" : "-1");
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        const first = $(".nav__logo");
        if (first) first.focus({ preventScroll: true });
      });
    }

    // Highlight the nav link of the section currently in view
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = byId.get(entry.target.id);
          if (link) setActive(link);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main section[id]").forEach((s) => observer.observe(s));
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    // Hero elements animate in via CSS on load; only the rest wait for scroll
    const items = $$(".reveal").filter((el) => {
      if (!el.closest(".hero")) return true;
      el.classList.add("is-visible");
      return false;
    });
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    // Stagger siblings inside grids for a smooth card appearance
    items.forEach((el) => {
      const siblings = el.parentElement ? $$(":scope > .reveal", el.parentElement) : [];
      const index = siblings.indexOf(el);
      if (index > 0) el.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
      observer.observe(el);
    });
  }

  /* ---------------- Contact form ---------------- */
  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const status = $("#formStatus");
    const button = $("#submitBtn");
    const label = $(".btn__label", button);

    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
      subject: (v) => (v.trim().length >= 3 ? "" : "Please enter a subject."),
      message: (v) => (v.trim().length >= 10 ? "" : "Your message should be at least 10 characters."),
    };

    const validateField = (input) => {
      const error = rules[input.name] ? rules[input.name](input.value) : "";
      const field = input.closest(".field");
      field.classList.toggle("has-error", Boolean(error));
      input.setAttribute("aria-invalid", error ? "true" : "false");
      $(".field__error", field).textContent = error;
      return !error;
    };

    const inputs = Object.keys(rules).map((name) => form.elements[name]);
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("has-error")) validateField(input);
      });
    });

    const setStatus = (msg, type) => {
      status.textContent = msg;
      status.className = `form-status${type ? ` form-status--${type}` : ""}`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const valid = inputs.map(validateField).every(Boolean);
      if (!valid) {
        inputs.find((i) => i.getAttribute("aria-invalid") === "true").focus();
        setStatus("Please fix the highlighted fields.", "error");
        return;
      }
      if (form.elements._gotcha.value) return; // bot

      const values = Object.fromEntries(inputs.map((i) => [i.name, i.value.trim()]));
      const rawEndpoint = (integrations.formEndpoint || "").trim();
      const endpoint = /^https:///i.test(rawEndpoint) ? rawEndpoint : ""; // never post a message over plain http

      // No form backend configured: hand off to the visitor's email client
      if (!endpoint) {
        const body = `${values.message}\n\n— ${values.name} (${values.email})`;
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
        setStatus("Opening your email app… If nothing happens, email me directly at " + profile.email, "success");
        return;
      }

      button.disabled = true;
      label.textContent = "Sending…";
      setStatus("", "");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        form.reset();
        setStatus("Thanks! Your message has been sent. I'll get back to you soon.", "success");
      } catch (err) {
        setStatus(`Sorry, something went wrong. Please email me directly at ${profile.email}.`, "error");
      } finally {
        button.disabled = false;
        label.textContent = "Send Message";
      }
    });
  }

  /* ---------------- Init ---------------- */
  bindProfile();
  renderSocials();
  renderGlance();
  renderStats();
  renderInterests();
  renderSkills();
  renderProjects();
  renderExperience();
  renderEducation();
  renderCertifications();
  renderServices();
  numberSections();

  initTheme();
  initNav();
  initReveal();
  initContactForm();
  loadGitHubRepos();

  // Tells js/theme.js that rendering finished (see the .js failsafe there)
  document.documentElement.classList.add("is-ready");
})();
