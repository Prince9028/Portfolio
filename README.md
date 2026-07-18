# Prince Patel — Portfolio

A single-page personal portfolio built with pure **HTML, CSS, and vanilla JavaScript** — no frameworks, no build step. Just push to GitHub and it's live.

**Live URL (after deploy):** `https://imantrajoshi.github.io/portfolio/`

---

## 📁 File Structure

```
portfolio/
├── index.html      ← all HTML structure
├── style.css       ← all styles, theme variables, responsive rules
├── script.js       ← typewriter, scroll animations, WhatsApp submit, mobile drawer
└── README.md       ← you are here
```

That's it. No `node_modules`, no bundlers, no config files. The site works by opening `index.html` in any browser.

---

## ⚡ Quick Start (local preview)

Just double-click `index.html`, or run a tiny local server (recommended so Google Fonts load over `http://`):

```bash
# from inside the portfolio folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

---

## ✏️ Step 1 — Set your WhatsApp number

Open `script.js`, find this line near the top, and replace it with your own number if needed:

```js
// digits only — country code first, no '+' and no spaces
const WHATSAPP_NUMBER = '919601019028';
```

Currently set to **+91 96010 19028** (Mantra). The contact form builds a `https://wa.me/<number>?text=<message>` link from this value.

> Tip: The same number is also used in the WhatsApp social icon link in `index.html` (search for `wa.me/919601019028`). Update both if you change it.

---

## 🚀 Step 2 — Push to GitHub

1. Create a new **public** repository on GitHub, e.g. `portfolio`.
2. From inside this folder, run:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/imantrajoshi/portfolio.git
   git push -u origin main
   ```

---

## 🌐 Step 3 — Enable GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages** (left sidebar).
2. Under **Source**, choose **Deploy from a branch**.
3. Set **Branch** to `main` and folder to `/ (root)`.
4. Click **Save**.

After ~1 minute, your site goes live at:

```
https://imantrajoshi.github.io/portfolio/
```

(Replace `portfolio` with whatever you named the repo. If you name the repo `imantrajoshi.github.io`, the URL becomes `https://imantrajoshi.github.io/` with no subpath.)

---

## 🎨 Customising the Theme

All colours and fonts live in CSS variables at the top of `style.css`:

```css
:root {
  --color-accent: #6c3fc5;        /* primary purple */
  --color-accent-2: #4f46e5;      /* indigo */
  --font-head: 'Sora', ...;
  --font-body: 'Inter', ...;
}
```

Change one value, everything rethemes consistently.

---

## ♿ Accessibility & UX

- Semantic HTML5 (`<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`)
- `aria-label` on every icon-only button
- Visible focus rings on all interactive elements
- `prefers-reduced-motion` respected — typewriter freezes on first role, blobs hide, transitions disable
- Fully responsive down to 375 px (iPhone SE width)

---

## 🛠 Sections

1. **Hero** — name, animated typewriter cycling QA Engineer / Project Manager / Developer / LinkedIn Content Creator, two CTAs
2. **About** — bio + 4 highlight stat cards
3. **Experience & Skills** — timeline of 5 freelance projects (Imperial Tissues marked "Current") + skills grouped by category
4. **Contact** — form that opens WhatsApp pre-filled with the user's message + social links (LinkedIn, GitHub, WhatsApp, Instagram, Email)

---

© 2025 Mantra Joshi · Built with ❤️ in Gujarat
