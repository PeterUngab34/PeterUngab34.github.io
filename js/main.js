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
    chevron: '<path d="m9 18 6-6-6-6"/>',
    repo: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  };
  // Pointer-driven effects only make sense with a mouse or trackpad. The card spotlight is a hover
  // effect and stays on; the effects that actually move things also respect prefers-reduced-motion.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pointerMotion = finePointer && !prefersReducedMotion;
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

    // The last name carries the red accent: gradient in the hero, solid in the logo wordmark
    const words = String(profile.name || "").trim().split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      const last = esc(words[words.length - 1]);
      const hero = $("[data-hero-name]");
      if (hero) hero.innerHTML = `${esc(words.slice(0, -1).join(" "))} <span class="text-gradient">${last}</span>`;
      $$("[data-wordmark]").forEach((el) => (el.innerHTML = `${esc(words[0])} <span>${last}</span>`));
    }
    // "Software Engineer | Full-Stack Developer" → two labels split by a red dot
    const role = $("[data-hero-role]");
    if (role && profile.role) {
      role.innerHTML = String(profile.role)
        .split("|")
        .map((part) => `<span>${esc(part.trim())}</span>`)
        .join('<span class="sep" aria-hidden="true"></span>');
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

  /* ---------------- About: "At a glance" card ---------------- */
  function renderGlance() {
    const el = $("[data-glance]");
    if (!el || !Array.isArray(data.glance)) return;
    el.innerHTML = data.glance.map((r) => `<div><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join("");
    // The status pill in the card header is bound to profile.availabilityShort; hide it when that is empty
    const status = $("[data-glance-status]");
    if (status) status.hidden = !profile.availabilityShort;
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
        item.invert ? " skill__img--invert" : item.lighten ? " skill__img--lighten" : ""
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
        <section class="skill-card glass-card glass-card--lift reveal" aria-label="${esc(group.category)}">
          <span class="card-watermark" aria-hidden="true">${icon(group.icon)}</span>
          <header class="skill-card__head">
            <span class="icon-tile" aria-hidden="true">${icon(group.icon)}</span>
            <div>
              <h3>${esc(group.category)}</h3>
              <p class="skill-card__count">${String(group.items.length).padStart(2, "0")} ${group.items.length === 1 ? "skill" : "skills"}</p>
            </div>
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


  // "https://PeterUngab34.github.io/task-manager/" → "peterungab34.github.io/task-manager"
  const urlLabel = (url) => {
    try {
      const u = new URL(url, document.baseURI);
      return (u.host + u.pathname).replace(/\/$/, "");
    } catch (e) {
      return "";
    }
  };

  // Bento rhythm: rows alternate wide+narrow / narrow+wide; an odd last card spans the full row
  function bentoSpan(i, total) {
    if (total % 2 === 1 && i === total - 1) return 12;
    const wideFirst = Math.floor(i / 2) % 2 === 0;
    return (i % 2 === 0) === wideFirst ? 8 : 4;
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
        // Browser-window chrome over the screenshot: three dots, the address of the demo, the test badge
        const media = `<span class="browser-bar" aria-hidden="true">
              <span class="browser-bar__dots"><span></span><span></span><span></span></span>
              ${link ? `<span class="browser-bar__url">${esc(urlLabel(link))}</span>` : ""}
              ${p.tests ? `<span class="pill bento-item__tests">${icon("check")} ${esc(p.tests)}</span>` : ""}
            </span>
            <img src="${esc(safeUrl(p.image))}" alt="Screenshot of ${esc(p.title)}" loading="lazy" decoding="async" width="1280" height="800" />`;
        const index = String(i + 1).padStart(2, "0");
        return `
        <article class="bento-item bento-item--${bentoSpan(i, data.projects.length)} reveal">
          ${
            link
              ? `<a class="bento-item__media" href="${esc(link)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(viewLabel)}: ${esc(p.title)}" tabindex="-1">${media}</a>`
              : `<div class="bento-item__media">${media}</div>`
          }
          <div class="bento-item__body">
            <span class="bento-item__index">${index}${p.type ? ` / ${esc(p.type)}` : ""}</span>
            <h3 class="bento-item__title">${esc(p.title)}</h3>
            <p class="bento-item__desc">${esc(p.description)}</p>
            <ul class="chip-list" aria-label="Technologies used">${p.tech.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            ${
              p.features && p.features.length
                ? `<details class="bento-item__more">
                    <summary>${icon("chevron")} Key features</summary>
                    <ul class="bento-item__features">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
                  </details>`
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
          <article class="timeline__card glass-card">
            <header class="timeline__head">
              <div>
                <h3 class="timeline__role">${esc(x.role)}</h3>
                <p class="timeline__org">${esc(x.org)}</p>
              </div>
              <p class="timeline__meta">
                <span class="pill pill--red">${esc(x.period)}</span>
                ${x.type ? `<span class="pill">${esc(x.type)}</span>` : ""}
              </p>
            </header>
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
        <article class="edu glass-card reveal">
          <div class="edu__main">
            <span class="icon-tile" aria-hidden="true">${icon("cap")}</span>
            <p class="edu__degree">${esc(e.degree)}</p>
            <h3 class="edu__program">${esc(e.program)}</h3>
            <p class="edu__school">${esc(e.school)}</p>
            <p class="pill pill--red edu__period">${esc(e.period)}</p>
          </div>
          ${
            e.coursework && e.coursework.length
              ? `<div class="edu__courses">
                  <h4 class="card-label">Relevant coursework</h4>
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
        <article class="cert glass-card glass-card--lift reveal">
          <span class="icon-tile" aria-hidden="true">${icon("award")}</span>
          <p class="cert__date">${esc(c.date)}</p>
          <h3 class="cert__name">${esc(c.name)}</h3>
          <p class="cert__org">${esc(c.org)}</p>
          ${
            safeUrl(c.url)
              ? `<a class="link-arrow" href="${esc(safeUrl(c.url))}" target="_blank" rel="noopener noreferrer">View certificate ${icon("arrow")}</a>`
              : ""
          }
        </article>`
      )
      .join("");
  }

  // Keep the "01 / About" eyebrow numbers sequential when a section is hidden
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
        (s) => `
        <article class="service glass-card glass-card--lift reveal">
          <span class="card-watermark" aria-hidden="true">${icon(s.icon)}</span>
          <span class="icon-tile" aria-hidden="true">${icon(s.icon)}</span>
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
          <a class="repo glass-card glass-card--lift" href="${esc(safeUrl(r.html_url))}" target="_blank" rel="noopener noreferrer">
            <h4 class="repo__name">${icon("repo")}<span>${esc(r.name)}</span></h4>
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
      initSpotlight(grid);
    } catch (err) {
      console.warn("Could not load GitHub repositories:", err);
    }
  }

  /* ---------------- Navigation ---------------- */
  function initNav() {
    const header = $("#siteHeader");
    const toggle = $("#navToggle");
    const links = $("#navLinks");
    const navLinks = $$(".nav__link");
    const backToTop = $("#backToTop");
    const desktop = window.matchMedia("(min-width: 1101px)");

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
        document.documentElement.style.setProperty("--p", max > 0 ? Math.min(y / max, 1).toFixed(4) : "0");
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
          else if (entry.target.id === "home") setActive(null);
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
          const el = entry.target;
          el.classList.add("is-visible");
          obs.unobserve(el);
          setTimeout(() => (el.style.transitionDelay = ""), 1400);
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

  /* ---------------- Light that follows the pointer (desktop only) ----------------
     Every effect here writes CSS custom properties through the CSSOM, which the
     Content-Security-Policy allows (only inline style attributes are forbidden). */

  // Inside each card: a red glow at the pointer position, faded in/out with --spot
  function initSpotlight(root = document) {
    if (!finePointer) return;
    $$(".glass-card, .bento-item", root).forEach((card) => {
      if (card.dataset.spot) return;
      card.dataset.spot = "1";
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
      card.addEventListener("pointerenter", () => card.style.setProperty("--spot", "1"));
      card.addEventListener("pointerleave", () => card.style.setProperty("--spot", "0"));
    });
  }

  // Buttons lean a few pixels towards the pointer while it is over them
  function initMagnetic() {
    if (!pointerMotion) return;
    $$(".btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.32;
        btn.style.setProperty("--tx", `${x.toFixed(1)}px`);
        btn.style.setProperty("--ty", `${y.toFixed(1)}px`);
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.setProperty("--tx", "0px");
        btn.style.setProperty("--ty", "0px");
      });
    });
  }

  // Backdrop: a large soft glow eases after the pointer
  function initCursorGlow() {
    const glow = $("#cursorGlow");
    if (!glow || !pointerMotion) return;
    let tx = window.innerWidth / 2, ty = window.innerHeight * 0.4, x = tx, y = ty, raf = 0;
    const frame = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(frame) : 0;
    };
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("is-on"));
  }

  /* ---------------- Contact: live local time + copy email ---------------- */
  function initClock() {
    const els = $$("[data-local-time]");
    if (!els.length) return;
    const opts = { hour: "numeric", minute: "2-digit", hour12: true };
    let fmt, offset = "";
    try {
      fmt = new Intl.DateTimeFormat("en-US", { ...opts, timeZone: profile.timeZone });
      const part = new Intl.DateTimeFormat("en-US", { timeZone: profile.timeZone, timeZoneName: "shortOffset" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName");
      offset = part ? part.value : "";
    } catch (e) {
      fmt = new Intl.DateTimeFormat("en-US", opts); // unknown zone: fall back to the visitor's clock
    }
    const zone = $("[data-local-zone]");
    if (zone) zone.textContent = offset;
    const tick = () => els.forEach((el) => (el.textContent = fmt.format(new Date())));
    tick();
    setInterval(tick, 15000);
  }

  function initCopy() {
    $$("[data-copy]").forEach((btn) => {
      let timer;
      btn.addEventListener("click", async () => {
        const value = profile[btn.dataset.copy];
        if (!value || !navigator.clipboard) return;
        try {
          await navigator.clipboard.writeText(value);
          btn.classList.add("is-copied");
          clearTimeout(timer);
          timer = setTimeout(() => btn.classList.remove("is-copied"), 1800);
        } catch (e) {
          /* clipboard blocked: the address is selectable right beside the button */
        }
      });
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
        label.textContent = "Send message";
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

  initNav();
  initReveal();
  initContactForm();
  initSpotlight();
  initMagnetic();
  initCursorGlow();
  initClock();
  initCopy();
  loadGitHubRepos();

  // Tells js/boot.js that rendering finished (see the .js failsafe there)
  document.documentElement.classList.add("is-ready");
})();
