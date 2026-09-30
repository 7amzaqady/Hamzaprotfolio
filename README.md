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
- `?motion=1` enables motion only when the visitor has not requested reduced motion.
- `?motion=0` explicitly disables motion.

## Case studies

- Blooms — available at `?project=blooms`
- QANTRA — available at `?project=qantra`
- ChromaSnap — available at `?project=chromasnap`, with the live tool at `chromasnap/`

## Homepage project collection

The collection uses two columns on tablet/desktop and one column below 768px.
The non-interactive fourth tile is reserved for the next project; it has no placeholder link.
To publish the fourth project, add its metadata to `projects` in `src/App.tsx`, place its cover in `public/projects/`, and add its case-study route alongside the existing lazy-loaded pages. The reserved tile disappears when four projects are present.

The hero uses a permanent HTML heading and a local poster image. WebGL decorations load after the readable content, only on supported desktops. Video failure, unavailable WebGL, and reduced-motion settings keep the portfolio readable.
