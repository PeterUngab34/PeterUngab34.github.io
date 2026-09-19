# Developer Portfolio

A fast, responsive, dependency-free personal portfolio, designed as an **engineering datasheet**:
title block, spec tables, numbered figures. Built with semantic HTML, modern CSS, and vanilla
JavaScript — no frameworks, no build step, no third-party requests.

## Design

The site deliberately avoids the usual developer-portfolio kit (gradients, glow, fake code windows,
floating cards). Instead it borrows the structure of a component datasheet:

- **Surfaces** – warm drafting paper (light) and graphite (dark); the theme follows the visitor's
  system setting until they choose one.
- **Ink and rules** – hairline borders instead of shadows, square corners, one signal-orange accent.
- **Type** – IBM Plex Sans (condensed for headings) and IBM Plex Mono for labels and data.
- **Structure** – an "At a glance" spec table in the hero, skills as a pin table, projects as numbered
  figure sheets with Type / Stack / Tests rows, experience and repositories as ruled tables, and a
  drawing-style title block as the footer. "Rev." shows the month the page was last deployed.
- **Print** – `Ctrl+P` produces a clean paper document.

All colors pass WCAG AA (4.5:1) in both themes.

## Features

- Paper and graphite themes: follows the system setting, with a toggle that remembers the visitor's choice
- Sticky navigation with active-section highlighting and a mobile hamburger menu
- Hero with an "At a glance" spec table, key figures, resume download, and social links
- Data-driven sections: About, Skills, Projects, GitHub, Experience, Education, Certifications, Services, Contact
- Optional live GitHub repositories (via the public GitHub API)
- Contact form with validation, spam honeypot, and Formspree support (falls back to `mailto:`)
- Scroll-reveal animations that respect `prefers-reduced-motion`
- SEO metadata, Open Graph / Twitter cards, favicon, accessible markup (skip link, ARIA, focus states)
- Hardened for static hosting: strict Content-Security-Policy, zero third-party requests (fonts and
  icons are self-hosted), URL allow-listing, clickjacking guard, and a readable no-JavaScript fallback

## Folder structure

```
MyPortfolio/
├── index.html                  # Page structure + SEO meta tags
├── 404.html                    # Branded "page not found" (served by GitHub Pages for bad URLs)
├── css/styles.css              # All styles (design tokens at the top)
├── js/data.js                  # ← YOUR CONTENT: edit this file
├── js/main.js                  # Rendering + interactions
├── js/theme.js                 # Runs before paint: saved theme, clickjacking guard, no-JS failsafe
├── resume/                     # Resume source (resume.html) + PDF build script
├── assets/
│   ├── favicon.svg
│   ├── fonts/                  # self-hosted IBM Plex Sans + IBM Plex Mono (WOFF2, SIL OFL)
│   ├── icons/                  # self-hosted skill icons (Devicon, MIT)
│   ├── apple-touch-icon.png    # 180×180 home-screen icon
│   ├── resume.pdf              # built from resume/ with `node resume/build-resume.mjs`
│   ├── images/
│   │   ├── profile-placeholder.svg   # ← replace with your photo
│   │   └── og-image.png              # social share preview (1200×630)
│   └── projects/               # ← project screenshots
├── .well-known/security.txt    # how to report a security issue (RFC 9116)
├── .nojekyll                   # serve files as-is (needed for .well-known/)
├── robots.txt
├── sitemap.xml
└── README.md
```

## Customize it

1. **Your details** – open `js/data.js` and edit `profile` (name, initials, email, GitHub, LinkedIn…)
   and the `glance` rows shown in the hero's "At a glance" table.
2. **SEO tags** – in `index.html`, replace `Your Name` and `https://your-domain.com/` in the `<head>`
   (title, description, Open Graph, canonical URL). These are read by search engines and social sites
   before JavaScript runs, so they must be edited in the HTML.
3. **Photo** – add `assets/images/profile.jpg` (portrait, ~600×700) and set `profile.photo` to that path.
4. **Resume** – replace `assets/resume.pdf` with your real resume, keeping the same file name.
5. **Projects** – edit the `projects` array. Add screenshots (16:10, e.g. 1280×800) to `assets/projects/`
   and point `image` to them (PNG for flat UI, WebP for photo- or gradient-heavy shots — whichever
   is smaller). Set `github` or `demo` to `""` to hide that button; add `download` for an extra
   "Download" button; `type` and `tests` fill the project's spec rows; `featured: true` makes a
   project span the full width.
6. **Skills, experience, education, certifications, services** – edit the matching arrays.
   Setting `certifications: []` hides that section entirely. Skills also feed the scrolling
   technology ticker under the hero.
7. **Hero stats** – edit the `stats` array (value + label). They count up on load and are hidden
   when the array is empty. Leave `profile.linkedin` (or any social) as `""` to hide its icon.
8. **Social preview image** – replace `assets/images/og-image.png` (1200×630) with one showing your name.
9. **Colors & type** – edit the tokens at the top of `css/styles.css` (`--bg`, `--text`, `--accent`… for
   paper, and the `[data-theme="dark"]` block for graphite). Fonts are self-hosted in `assets/fonts/`.
10. **Skill icons** – drop an SVG into `assets/icons/` and point the skill's `icon` at it
    (`${ICONS}/name.svg`). Icons from other websites are blocked by the security policy.

### Contact form

By default the form opens the visitor's email app with the message pre-filled.
To receive messages directly in your inbox without that step:

1. Create a free form at [formspree.io](https://formspree.io).
2. Paste your endpoint into `integrations.formEndpoint` in `js/data.js`
   (e.g. `"https://formspree.io/f/abcdwxyz"`).

### GitHub repositories

Set `integrations.githubUsername` in `js/data.js` to show your latest public (non-fork) repositories
under the "Want to see more of my work?" banner.

## Security

GitHub Pages cannot send custom HTTP headers, so the policy lives in a `<meta>` tag at the top of
`index.html` and `404.html`:

- **Content-Security-Policy** – `default-src 'none'`; scripts, styles, images and fonts only from this
  site; no inline scripts or styles; `fetch` only to `api.github.com` and `formspree.io`;
  `form-action 'none'` and `base-uri 'none'`. An injected script cannot run or send data anywhere.
- **No third parties** – nothing is loaded from a CDN, so there is no supply-chain or tracking exposure.
- **URL allow-list** – `safeUrl()` in `js/main.js` only lets `http(s)`, `mailto` and relative URLs
  become links or image sources, including data returned by the GitHub API. All text is HTML-escaped.
- **Clickjacking** – `js/theme.js` refuses to render inside another site's frame.
- **Transport** – HTTPS is enforced by GitHub Pages with HSTS; the contact form refuses non-HTTPS endpoints.

Keep it working: do not add inline `<script>`, `<style>`, `style=""` or `onclick=""` — put code in
`js/` and `css/`. If you switch contact-form provider, add its origin to `connect-src`. Renew the
`Expires` date in `.well-known/security.txt` once a year.

## Run locally

Serve the folder (recommended — this matches how the live site behaves):

```bash
npx serve .
# or
python -m http.server 8000
```

Opening `index.html` straight from disk also works; the browser just logs a harmless font-preload warning.

## Deploy (free)

- **GitHub Pages** – push to a repository → Settings → Pages → deploy from the `main` branch.
- **Netlify / Vercel** – drag and drop the folder, or import the repository. No build command needed.

After deploying, update the canonical and Open Graph URLs in `index.html` and the sitemap line in `robots.txt`.
