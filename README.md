# Hamza Qady — cinematic portfolio

React + Vite + TypeScript + Tailwind CSS portfolio.

## Run

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

The site is deployed to GitHub Pages from `main` through `.github/workflows/pages.yml`.

## Motion and accessibility

The portfolio uses WebGL and motion effects with static/readable fallbacks. By default the site respects the visitor's `prefers-reduced-motion` setting.

For debugging or presentation:
- `?motion=1` explicitly enables motion, including when the system requests reduced motion.
- `?motion=0` explicitly disables motion.

## Case studies

- Blooms — available at `?project=blooms`
- QANTRA — available at `?project=qantra`
- ChromaSnap — available at `?project=chromasnap`, with the live tool at `chromasnap/`

## Homepage project collection

The collection uses two columns on tablet/desktop and one column below 768px.
The non-interactive fourth tile is reserved for the next project; it has no placeholder link.
To publish the fourth project, add its metadata to `projects` in `src/App.tsx`, place its cover in `public/projects/`, and add its case-study route alongside the existing lazy-loaded pages. The reserved tile disappears when four projects are present.

The homepage retains the original Blooms and Qantra logo covers and the ChromaSnap artwork with its interactive color strip. The fourth slot uses the original jellyfish motion study and border glow until its case study is ready.

The intro loader, rotating role, GooeyNav, curtain text reveals, fluid name, Galaxy, and specular contact button are restored. The hero keeps a permanent HTML heading: the fluid canvas replaces its visual rendering only after a successful first frame, and restores the heading if the context is lost. WebGL decorations load after readable content, only on supported desktops. Video failure, unavailable WebGL, and reduced-motion settings keep the portfolio readable. Background and contact effects pause when hidden or outside the viewport.

The visible Enable/Pause motion control updates the URL without reloading. System reduced motion remains the default until a visitor explicitly enables it. Native CSS drives role, curtain, and card reveals so they cannot remain in an animation library's hidden initial state. When WebGL is unavailable (or on mobile), the name uses interactive SVG displacement, the background uses twinkling stars with pointer parallax, and the contact button uses a CSS specular edge.
