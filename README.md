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
- `?motion=1` explicitly enables motion.
- `?motion=0` explicitly disables motion.

## Case studies

- Blooms — available at `?project=blooms`
- QANTRA — visual identity case study in development
