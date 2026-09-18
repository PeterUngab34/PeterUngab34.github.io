# Developer Portfolio

A fast, responsive, dependency-free personal portfolio for Software Engineer / Web Developer applications.
Built with semantic HTML, modern CSS, and vanilla JavaScript — no build step required.

## Features

- Dark theme by default with a light/dark toggle (remembers the visitor's choice)
- Sticky navigation with active-section highlighting and a mobile hamburger menu
- Hero with animated code editor, resume download, and social links
- Data-driven sections: About, Skills, Projects, GitHub, Experience, Education, Certifications, Services, Contact
- Optional live GitHub repositories (via the public GitHub API)
- Contact form with validation, spam honeypot, and Formspree support (falls back to `mailto:`)
- Scroll-reveal animations that respect `prefers-reduced-motion`
- SEO metadata, Open Graph / Twitter cards, favicon, accessible markup (skip link, ARIA, focus states)

## Folder structure

```
MyPortfolio/
├── index.html                  # Page structure + SEO meta tags
├── css/styles.css              # All styles (design tokens at the top)
├── js/data.js                  # ← YOUR CONTENT: edit this file
├── js/main.js                  # Rendering + interactions
├── assets/
│   ├── favicon.svg
│   ├── resume.pdf              # ← replace with your resume (keep the name)
│   ├── images/
│   │   ├── profile-placeholder.svg   # ← replace with your photo
│   │   └── og-image.png              # social share preview (1200×630)
│   └── projects/               # ← project screenshots
├── robots.txt
└── README.md
```

## Customize it

1. **Your details** – open `js/data.js` and edit `profile` (name, initials, email, GitHub, LinkedIn…).
2. **SEO tags** – in `index.html`, replace `Your Name` and `https://your-domain.com/` in the `<head>`
   (title, description, Open Graph, canonical URL). These are read by search engines and social sites
   before JavaScript runs, so they must be edited in the HTML.
3. **Photo** – add `assets/images/profile.jpg` (portrait, ~600×700) and set `profile.photo` to that path.
4. **Resume** – replace `assets/resume.pdf` with your real resume, keeping the same file name.
5. **Projects** – edit the `projects` array. Add screenshots (16:10, e.g. 1280×800) to `assets/projects/`
   and point `image` to them. Set `github` or `demo` to `""` to hide that button; `featured: true`
   makes a project span the full width.
6. **Skills, experience, education, certifications, services** – edit the matching arrays.
   Setting `certifications: []` hides that section entirely. Skills also feed the scrolling
   technology ticker under the hero.
7. **Hero stats** – edit the `stats` array (value + label). They count up on load and are hidden
   when the array is empty. Leave `profile.linkedin` (or any social) as `""` to hide its icon.
8. **Social preview image** – replace `assets/images/og-image.png` (1200×630) with one showing your name.
9. **Colors & type** – change `--accent`, `--accent-2`, and `--gradient` at the top of `css/styles.css`.
   Headings use Sora, body text Inter, and code JetBrains Mono (loaded from Google Fonts).

### Contact form

By default the form opens the visitor's email app with the message pre-filled.
To receive messages directly in your inbox without that step:

1. Create a free form at [formspree.io](https://formspree.io).
2. Paste your endpoint into `integrations.formEndpoint` in `js/data.js`
   (e.g. `"https://formspree.io/f/abcdwxyz"`).

### GitHub repositories

Set `integrations.githubUsername` in `js/data.js` to show your latest public (non-fork) repositories
under the "Want to see more of my work?" banner.

## Run locally

Open `index.html` directly in a browser, or serve the folder (recommended):

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy (free)

- **GitHub Pages** – push to a repository → Settings → Pages → deploy from the `main` branch.
- **Netlify / Vercel** – drag and drop the folder, or import the repository. No build command needed.

After deploying, update the canonical and Open Graph URLs in `index.html` and the sitemap line in `robots.txt`.
