# After Empire · Asia, 1945 to 2026

An independent personal research and memory project. A versioned, interpretive catalogue of armed conflict and one-sided violence across Asia since the Second World War, paired with analytical essays.

This repository is not affiliated with, endorsed by, reviewed by, or representative of any employer, humanitarian organization, government, or academic institution.

## Stack

Vite 6 · React 18 · Tailwind 3 · TypeScript 5. Self-contained, no API keys.

## Develop

```bash
npm install
npm run dev
```

Site at `http://localhost:5173/asia-violence-timeline/`.

## Branches

- `main` — public placeholder ("A quiet pause") served at the Pages URL.
- `icrc-alignment` — full project source, not auto-deployed.

## Build

```bash
npm run build
```

The deploy workflow (`.github/workflows/deploy.yml`) runs on push to `main` only.

## Project layout

```
src/
  main.tsx                       React entry
  App.tsx                        thin wrapper
  asia_violence_timeline.jsx     essay + catalogue
  Convergence.jsx                map / histogram / dashboard view
  data/
    asia_outline.js              stylised Asia silhouette (lon/lat)
    country_coords.js            label / event-marker centroids
  useTheme.js                    light/dark toggle
index.html
vite.config.ts                   base path for GH Pages
```

The catalogue is downloadable from the Methodology section as a coded CSV with one row per event.
