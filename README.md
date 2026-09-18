# Hamza Qady — cinematic portfolio

React + Vite + TypeScript + Tailwind CSS portfolio prototype.

## Run

```bash
npm install
npm run dev
```

## OriginKit Ribbon Glow

The project now includes a self-contained WebGL2 Ribbon Glow implementation in `src/components/RibbonGlow.tsx`, mounted once at the app root so it remains active from the first section to the footer. It follows the published OriginKit Ribbon Glow behavior: layered folded ribbons, half-resolution rendering, pointer-driven swirl/velocity, warm screen-blended light, and a reduced-motion path.

If you have Bun installed and want the official OriginKit CLI package locally as well, run:

```bash
bunx --bun originkit@latest add ribbon-glow
```

Or without Bun:

```bash
npx originkit@latest add ribbon-glow
```

Package scripts are included:

```bash
npm run add:ribbon-glow
npm run add:ribbon-glow:npm
```

## Fixed effects build

This revision fixes the previously invisible effects:

- About headline now uses an actual character-by-character scramble/reveal on first viewport entry.
- The full-page Ribbon Glow is composited above opaque section backgrounds, with pointer-events disabled.
- A CSS glow fallback remains visible if WebGL2 is unavailable.
- The HAMZA QADY hero title uses a fluid SVG displacement field that increases near the pointer.
- Reduced-motion users receive static, readable fallbacks.

OriginKit helper commands are included in package.json, but this build does not depend on the CLI being available at runtime.
