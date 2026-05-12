# Asia, 1945 to 2026 · Conflict and State Violence

Interactive timeline of 136 events across 40 Asian countries since the Second World War. Combined record of armed conflict and political mass violence with reactive statistics, country filters, year-range slider, and analytical essays.

## Stack

Vite 6 · React 18 · Tailwind 3 · TypeScript 5. Self-contained, no API keys.

## Develop

```bash
npm install
npm run dev
```

Site at `http://localhost:5173/asia-violence-timeline/`.

## Deploy

Push to `main`. GitHub Action builds and deploys to Pages.

Before first push:
1. Set the `BASE` constant in `vite.config.ts` to match your repo path.
2. In repo Settings → Pages, set Source to **GitHub Actions** (not "Deploy from branch").

## Project layout

```
src/
  main.tsx                       React entry
  App.tsx                        thin wrapper
  asia_violence_timeline.jsx     single-file component, ~210 KB
  index.css                      Tailwind directives
index.html                       Google Fonts preconnect, SEO meta
vite.config.ts                   base path for GH Pages
```

The timeline ships as one large `.jsx` file containing the event catalogue inline. Refactor into separate `data/events.ts` and `components/*.tsx` files when convenient; Claude Code handles the split well.
