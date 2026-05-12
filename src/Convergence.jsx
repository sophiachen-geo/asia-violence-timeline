// ============================================================
// Convergence — alternate view of the Asia Violence catalogue
//
// Side-by-side with the After Empire essay. Routed via ?view=convergence.
// Three coordinated views over the same EVENTS data:
//   1. Dashboard  — filters, dual-handle period, twin stat columns
//   2. Map        — Asia, with each event positioned at country centroid,
//                   encoded with shape (category) + size (deaths) + halo (displaced)
//   3. Grid       — countries × years calendar of when violence was active
//
// Inline citations in the detail card render via the existing <Cite>
// component, which scrolls to the references list at the bottom of the
// page (mirrored here so navigation works without leaving the view).
//
// Adapted from the design handoff at design_handoff_convergence/.
// ============================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  EVENTS as RAW_EVENTS,
  COUNTRY_REGION,
  Cite,
  fmtFigure,
  DATA_AS_OF,
} from './asia_violence_timeline.jsx';
import { COUNTRY_COORDS } from './data/country_coords.js';
import { ASIA_MAINLAND, ASIA_ISLANDS } from './data/asia_outline.js';
import { useTheme } from './useTheme.js';

// ============================================================
// Helpers
// ============================================================

// Parse a casualty / displacement string from the source catalogue
// (e.g. "2 to 6 M", "~80k", "minimal", "30 to 45 M") into a numeric
// mid-range estimate. Used ONLY for symbol layout. The original string
// is always what the reader sees.
function parseEstimate(str) {
  if (!str || typeof str !== 'string') return 0;
  const s = str.toLowerCase().trim();
  if (s === '' || s === 'minimal' || s === 'unknown' || s === 'none' || s === '—') return 0;

  // qualitative buckets
  if (/hundreds of thousands/.test(s)) return 300000;
  if (/tens of thousands/.test(s)) return 30000;
  if (/^millions cumulative/.test(s) || /\bmillions cumulative\b/.test(s)) return 2000000;
  if (/^millions/.test(s) || /\bmillions\b/.test(s) && !/\d/.test(s)) return 2000000;
  if (/^thousands/.test(s)) return 3000;
  if (/^hundreds/.test(s) && !/of thousands/.test(s)) return 300;

  const unitFactor = (u) => {
    if (!u) return 1;
    const x = u.toLowerCase();
    if (x === 'm' || x.startsWith('mil')) return 1e6;
    if (x === 'k' || x.startsWith('thou')) return 1e3;
    return 1;
  };

  // range "X to Y unit" or "X-Y unit"
  const range = s.match(/(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)\s*(m|k|million|thousand)?/);
  if (range) {
    const a = parseFloat(range[1]);
    const b = parseFloat(range[2]);
    const unit = unitFactor(range[3]);
    return ((a + b) / 2) * unit;
  }

  // single "X unit"
  const single = s.match(/(\d+(?:\.\d+)?)\s*(m|k|million|thousand)?/);
  if (single) {
    return parseFloat(single[1]) * unitFactor(single[2]);
  }

  return 0;
}

function fmt(v) {
  if (v == null) return '—';
  if (v >= 1e7) return Math.round(v / 1e6) + 'M';
  if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (v >= 1e4) return Math.round(v / 1e3) + 'k';
  if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(Math.round(v));
}

// Blend two hex colors. Used to darken a region color for grid cells
// that have 2+ overlapping events.
function mix(a, b, t) {
  const pa = a.replace('#', '');
  const pb = b.replace('#', '');
  const ar = parseInt(pa.slice(0, 2), 16), ag = parseInt(pa.slice(2, 4), 16), ab = parseInt(pa.slice(4, 6), 16);
  const br = parseInt(pb.slice(0, 2), 16), bg = parseInt(pb.slice(2, 4), 16), bb = parseInt(pb.slice(4, 6), 16);
  const r = Math.round(ar * (1 - t) + br * t);
  const g = Math.round(ag * (1 - t) + bg * t);
  const bl = Math.round(ab * (1 - t) + bb * t);
  return '#' + [r, g, bl].map(v => v.toString(16).padStart(2, '0')).join('');
}

// Compact-format a numeric estimate for dashboard headlines:
// 1234 → "1.2k", 75000 → "75k", 1_900_000 → "1.9M", 37_500_000 → "38M".
const COMPACT_FMT = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
function fmtCompact(n) {
  if (!n || n <= 0) return '—';
  return COMPACT_FMT.format(n);
}

// Simple **bold** markdown → <strong>. Used to render event notes.
function renderBold(text, key) {
  if (!text) return null;
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((p, i) => i % 2 === 1
    ? <strong key={`${key}-${i}`} style={{ color: 'inherit', fontWeight: 600 }}>{p}</strong>
    : <React.Fragment key={`${key}-${i}`}>{p}</React.Fragment>
  );
}

// EVENTS is normalized lazily inside the component (see useMemo below).
// Doing it at module top-level breaks under the circular import that now
// exists between this file and asia_violence_timeline.jsx (which imports
// the Convergence default export). Top-level use of an imported binding
// during a circular load triggers a temporal-dead-zone ReferenceError.

const START_YEAR = 1945;
const END_YEAR = 2026;
const CURRENT_YEAR = new Date().getFullYear();
const REGION_ORDER = ["West Asia", "Central Asia", "South Asia", "Southeast Asia", "East Asia"];

// ASIA_MAINLAND and ASIA_ISLANDS live in ./data/asia_outline.js so the
// coordinate authoring is decoupled from rendering logic. The shapes are
// a denser stylized silhouette of Asia — no internal country borders.

// Countries to label on the silhouette. Subset chosen for legibility:
// they're large enough or politically prominent enough that a label
// helps readers orient. Smaller territories rely on event symbols.
const LABEL_COUNTRIES = [
  'China', 'India', 'Pakistan', 'Iran', 'Saudi Arabia', 'Russia',
  'Indonesia', 'Vietnam', 'Thailand', 'Myanmar', 'Japan',
  'North Korea', 'South Korea', 'Afghanistan', 'Iraq', 'Syria',
  'Bangladesh', 'Philippines', 'Mongolia', 'Kazakhstan',
];

// Approximate label anchors. We use these instead of COUNTRY_COORDS for
// countries that are not in the catalogue (e.g. Russia, Saudi Arabia,
// Kazakhstan) so the map still reads as Asia.
const LABEL_COORDS = {
  'Russia':       { lon: 90,  lat: 60   },
  'Saudi Arabia': { lon: 45,  lat: 24   },
  'Iran':         { lon: 53,  lat: 32   },
  'Iraq':         { lon: 44,  lat: 33   },
  'Syria':        { lon: 38,  lat: 35   },
  'Kazakhstan':   { lon: 67,  lat: 48   },
  'Mongolia':     { lon: 103, lat: 47   },
};

// ============================================================
// Main component
// ============================================================

export default function Convergence() {
  const years = useMemo(() => {
    const a = [];
    for (let y = START_YEAR; y <= END_YEAR; y++) a.push(y);
    return a;
  }, []);

  // ── theme (shared with the essay; the toggle lives in the essay header) ──
  const [theme] = useTheme();

  const T = theme === 'dark' ? {
    bg:           '#0e1118',
    panel:        '#161a23',
    panelAlt:     '#1d212c',
    panelBorder:  'rgba(232,226,212,0.10)',
    text:         '#f1ead9',
    mute:         'rgba(232,226,212,0.65)',
    faint:        'rgba(232,226,212,0.4)',
    rule:         'rgba(232,226,212,0.18)',
    accent:       '#b8956a',
    accentInk:    '#0e1118',
    inputBg:      '#0e1118',
    headline:     '#f1ead9',
    hatchInk:     'rgba(255,255,255,0.22)',
    emptyCell:    'rgba(232,226,212,0.04)',
    tooltipBg:    '#1d212c',
    tooltipBorder:'rgba(232,226,212,0.18)',
  } : {
    bg:           '#f5f1e8',
    panel:        '#ffffff',
    panelAlt:     '#faf6ec',
    panelBorder:  'rgba(45,40,30,0.10)',
    text:         '#231d14',
    mute:         'rgba(45,40,30,0.70)',
    faint:        'rgba(45,40,30,0.45)',
    rule:         'rgba(45,40,30,0.16)',
    accent:       '#8b6a3f',
    accentInk:    '#f5f1e8',
    inputBg:      '#f5f1e8',
    headline:     '#1a160f',
    hatchInk:     'rgba(0,0,0,0.20)',
    emptyCell:    'rgba(45,40,30,0.06)',
    tooltipBg:    '#ffffff',
    tooltipBorder:'rgba(45,40,30,0.22)',
  };

  // Region colors are theme-aware and chosen for clear discrimination
  // (East and West Asia were too close in red in the original palette).
  const regions = theme === 'dark' ? {
    "West Asia":      { color: "#d05a3c" }, // terracotta
    "Central Asia":   { color: "#8a6dc4" }, // violet
    "South Asia":     { color: "#e0b341" }, // gold
    "Southeast Asia": { color: "#4ea58d" }, // jade
    "East Asia":      { color: "#3f7fbf" }, // slate blue
  } : {
    "West Asia":      { color: "#a8442a" },
    "Central Asia":   { color: "#5b4690" },
    "South Asia":     { color: "#b78018" },
    "Southeast Asia": { color: "#2c7a63" },
    "East Asia":      { color: "#2c5d96" },
  };

  // ── state ──────────────────────────────────────────────────────
  const [cat, setCat] = useState('Both');
  const [regionSet, setRegionSet] = useState(new Set(REGION_ORDER));
  const [countrySet, setCountrySet] = useState(new Set());
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [yearRange, setYearRange] = useState([START_YEAR, END_YEAR]);
  const [pinnedCountry, setPinnedCountry] = useState(null);
  const [scrubYear, setScrubYear] = useState(Math.min(END_YEAR, Math.max(START_YEAR, CURRENT_YEAR)));
  const [playing, setPlaying] = useState(false);

  const [mapHover, setMapHover] = useState(null);
  const [gridHover, setGridHover] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  // Names of events whose map symbols should briefly blink (triggered
  // by a grid-cell click). The key increments each time so the CSS
  // animation re-runs even when the same set of names is set again.
  const [blinkEvents, setBlinkEvents] = useState(new Set());
  const [blinkKey, setBlinkKey] = useState(0);
  const triggerBlink = (eventNames) => {
    setBlinkEvents(new Set(eventNames));
    setBlinkKey(k => k + 1);
    setTimeout(() => setBlinkEvents(new Set()), 1800);
  };

  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  const isPhone = vw < 700;
  const isTablet = vw >= 700 && vw < 1100;
  const isDesktop = vw >= 1100;

  // Normalize the raw EVENTS into the shape the rest of this view wants.
  // Lazy via useMemo to avoid the circular-import TDZ error described in
  // the file-top comment.
  const EVENTS = useMemo(() => RAW_EVENTS.map(e => ({
    name: e.name,
    region: e.region,
    countries: e.countries,
    cat: e.category === 'One-sided Violence' ? 'OSV' : 'AC',
    start: e.start,
    end: e.end,
    ongoing: !!e.ongoing,
    excludedFromTotal: !!e.excludedFromTotal,
    deaths: e.deaths,
    displaced: e.displaced,
    // Estimates feed the symbol radius regardless of excludedFromTotal,
    // so the reader still sees the event on the map. Cumulative totals
    // below skip excludedFromTotal events explicitly.
    deathsEst: parseEstimate(e.deaths),
    displacedEst: parseEstimate(e.displaced),
    note: e.note,
    cites: e.cites || [],
  })), []);

  // Country list shown in dropdown is tied to active region filter.
  // Country-to-region uses the canonical COUNTRY_REGION map from the
  // source dataset (NOT inferred from each event's region) so that, for
  // example, Vietnam stays in Southeast Asia even when it appears in an
  // East Asia event like the Sino-Vietnamese War.
  const COUNTRY_BY_REGION = useMemo(() => {
    const m = {};
    EVENTS.forEach(e => e.countries.forEach(c => {
      if (!m[c]) m[c] = COUNTRY_REGION[c] || e.region;
    }));
    return m;
  }, []);
  const ALL_COUNTRIES = useMemo(() =>
    Object.keys(COUNTRY_BY_REGION)
      .filter(c => regionSet.has(COUNTRY_BY_REGION[c]))
      .sort((a, b) => {
        const ra = REGION_ORDER.indexOf(COUNTRY_BY_REGION[a]);
        const rb = REGION_ORDER.indexOf(COUNTRY_BY_REGION[b]);
        if (ra !== rb) return ra - rb;
        return a.localeCompare(b);
      }), [COUNTRY_BY_REGION, regionSet]);

  // Drop selected countries that fall outside the visible region set.
  useEffect(() => {
    if (countrySet.size === 0) return;
    const visible = new Set(ALL_COUNTRIES);
    let changed = false;
    const next = new Set();
    countrySet.forEach(c => { if (visible.has(c)) next.add(c); else changed = true; });
    if (changed) setCountrySet(next);
  }, [regionSet]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtered events.
  const events = useMemo(() => EVENTS.filter(e => {
    if (cat === 'AC' && e.cat !== 'AC') return false;
    if (cat === 'OSV' && e.cat !== 'OSV') return false;
    if (!regionSet.has(e.region)) return false;
    if (countrySet.size > 0 && !e.countries.some(c => countrySet.has(c))) return false;
    if (e.end < yearRange[0] || e.start > yearRange[1]) return false;
    return true;
  }), [cat, regionSet, countrySet, yearRange]);

  const countryRegion = useMemo(() => {
    const m = {};
    events.forEach(e => e.countries.forEach(c => {
      if (!m[c]) m[c] = COUNTRY_REGION[c] || e.region;
    }));
    return m;
  }, [events]);
  const countries = useMemo(() =>
    Object.keys(countryRegion).sort((a, b) => {
      const ra = REGION_ORDER.indexOf(countryRegion[a]);
      const rb = REGION_ORDER.indexOf(countryRegion[b]);
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    }), [countryRegion]);

  // Grid presence — which catalogue events cover (country, year).
  const grid = useMemo(() => {
    const g = {};
    countries.forEach(c => {
      g[c] = {};
      years.forEach(y => g[c][y] = { evs: [], hasPV: false, hasAC: false });
    });
    events.forEach(e => {
      e.countries.forEach(c => {
        if (!g[c]) return;
        for (let y = e.start; y <= e.end; y++) {
          g[c][y].evs.push(e);
          if (e.cat === 'OSV') g[c][y].hasPV = true; else g[c][y].hasAC = true;
        }
      });
    });
    return g;
  }, [events, countries, years]);

  const yearTotals = useMemo(() => {
    const t = {};
    years.forEach(y => {
      const s = new Set();
      countries.forEach(c => grid[c][y].evs.forEach(e => s.add(e.name)));
      t[y] = s.size;
    });
    return t;
  }, [grid, countries, years]);

  const periodTotals = useMemo(() => {
    const overlapping = events.filter(e => e.end >= yearRange[0] && e.start <= yearRange[1]);
    // excludedFromTotal events (e.g. Laogai, Falun Gong, Xinjiang,
    // kwalliso) are visualised on the map but skipped here because
    // their mortality figures are not auditable mid-range estimates.
    const totalable = overlapping.filter(e => !e.excludedFromTotal);
    const deathsSum = totalable.reduce((s, e) => s + (e.deathsEst || 0), 0);
    const displacedSum = totalable.reduce((s, e) => s + (e.displacedEst || 0), 0);
    const excludedCount = overlapping.length - totalable.length;
    return { evCount: overlapping.length, events: overlapping, deathsSum, displacedSum, excludedCount };
  }, [events, yearRange]);

  useEffect(() => {
    if (scrubYear < yearRange[0]) setScrubYear(yearRange[0]);
    else if (scrubYear > yearRange[1]) setScrubYear(yearRange[1]);
  }, [yearRange]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setScrubYear(y => y >= yearRange[1] ? yearRange[0] : y + 1);
    }, 600);
    return () => clearInterval(id);
  }, [playing, yearRange]);

  const activeInYear = useMemo(
    () => events.filter(e => e.start <= scrubYear && e.end >= scrubYear),
    [events, scrubYear]
  );

  // ── Symbol sizing ────────────────────────────────────────────
  const MAX_DEATHS = 45_000_000;
  const MAX_DISPLACED = 25_000_000;
  const phoneMul = isPhone ? 0.8 : 1;
  const sqRange = (v, max, minR, maxR) => {
    if (!v || v <= 0) return minR;
    const t = Math.sqrt(v) / Math.sqrt(max);
    return Math.max(minR, Math.min(maxR, minR + t * (maxR - minR)));
  };
  const radiusForDeaths = (d) => sqRange(d, MAX_DEATHS, 3, 28) * phoneMul;
  const radiusForDisplaced = (disp) => sqRange(disp, MAX_DISPLACED, 0, 38) * phoneMul;

  const cellColor = (evCount, region) => {
    if (!evCount || !regions[region]) return 'transparent';
    const c = regions[region].color;
    const alpha = evCount === 1 ? 0.55 : evCount === 2 ? 0.8 : 0.95;
    return `${c}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  };

  // ── Map projection ───────────────────────────────────────────
  // The lon/lat range is intentionally wider than the actual extent of
  // plotted countries so that the largest symbols (e.g. Great Leap
  // Forward at ~28px radius) stay fully inside the viewBox. Without
  // this padding, dots near Japan, Soviet Union, and Mongolia clip at
  // the right and top edges.
  const minLon = 22, maxLon = 152, minLat = -18, maxLat = 64;
  const mapAspect = (maxLon - minLon) / (maxLat - minLat); // ≈ 1.585
  const mapW = isPhone ? Math.min(vw - 48, 480) : isTablet ? Math.min(vw - 80, 540) : 580;
  const mapH = mapW / mapAspect;
  const project = (lon, lat) => [
    ((lon - minLon) / (maxLon - minLon)) * mapW,
    mapH - ((lat - minLat) / (maxLat - minLat)) * mapH,
  ];

  const visibleCountries = pinnedCountry && countries.includes(pinnedCountry)
    ? [pinnedCountry] : countries;
  const cellBase = 12.5;
  const cellH = pinnedCountry ? 35 : (isPhone ? Math.max(9, cellBase - 2) : cellBase);
  const labelFontSize = pinnedCountry ? 18 : (isPhone ? 10 : 11);
  const labelW = isPhone ? 86 : 110;

  const mapRef = useRef(null);
  const trackRef = useRef(null);
  const draggingRef = useRef(null);

  // ── Filter helpers ───────────────────────────────────────────
  const toggleRegion = (r) => {
    const s = new Set(regionSet);
    if (s.has(r)) s.delete(r); else s.add(r);
    if (s.size === 0) s.add(r);
    setRegionSet(s);
  };
  const toggleCountry = (c) => {
    const s = new Set(countrySet);
    if (s.has(c)) {
      s.delete(c);
    } else {
      s.add(c);
      const r = COUNTRY_BY_REGION[c];
      if (r && !regionSet.has(r)) {
        const rs = new Set(regionSet); rs.add(r); setRegionSet(rs);
      }
    }
    setCountrySet(s);
  };
  const resetFilters = () => {
    setCat('Both');
    setRegionSet(new Set(REGION_ORDER));
    setCountrySet(new Set());
    setYearRange([START_YEAR, END_YEAR]);
    setPinnedCountry(null);
    setSelectedEvent(null);
    setSelectedCell(null);
  };

  // ── Dual-handle range slider ─────────────────────────────────
  const yearAtClientX = (clientX) => {
    const t = trackRef.current;
    if (!t) return START_YEAR;
    const r = t.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    return Math.round(START_YEAR + pct * (END_YEAR - START_YEAR));
  };
  useEffect(() => {
    const move = (e) => {
      if (!draggingRef.current) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const y = yearAtClientX(cx);
      if (draggingRef.current === 'min') setYearRange(([a, b]) => [Math.min(y, b - 1), b]);
      else setYearRange(([a, b]) => [a, Math.max(y, a + 1)]);
    };
    const up = () => { draggingRef.current = null; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, []);
  const yrToPct = (y) => ((y - START_YEAR) / (END_YEAR - START_YEAR)) * 100;

  // ── Tooltip move handlers ────────────────────────────────────
  const onSymbolMove = (ev, e, country) => {
    const r = mapRef.current && mapRef.current.getBoundingClientRect();
    if (!r) return;
    setMapHover({ event: e, country, x: ev.clientX - r.left, y: ev.clientY - r.top });
  };
  const onCellMove = (ev, country, year) => {
    setGridHover({ country, year, x: ev.clientX, y: ev.clientY });
  };

  // ── Detail card precedence ───────────────────────────────────
  let detailMode = 'year';
  if (selectedEvent) detailMode = 'event';
  else if (selectedCell) detailMode = 'cell';

  return (
    <div style={{
      background: T.bg, color: T.text,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      transition: 'background-color 180ms ease, color 180ms ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');
        .cv-serif { font-family:'Cormorant Garamond', Georgia, serif; }
        .cv-mono  { font-family:'JetBrains Mono', ui-monospace, monospace; letter-spacing:.04em; }
        .cv-cell  { transition: filter .12s ease; }
        .cv-cell:hover { filter: brightness(1.7) saturate(1.4); outline:1px solid ${T.text}; outline-offset:-1px; }
        .cv-sym   { cursor: pointer; transition: transform .1s ease; transform-origin: center; transform-box: fill-box; }
        .cv-sym:hover { transform: scale(1.12); }
        .cv-chip-x { opacity:.6; } .cv-chip:hover .cv-chip-x { opacity:1; }
        @keyframes cv-blink-ring {
          0%   { transform-origin: center; transform: scale(0.8); opacity: 0.9; }
          100% { transform-origin: center; transform: scale(2.6); opacity: 0; }
        }
        .cv-blink-ring {
          transform-box: fill-box;
          animation: cv-blink-ring 0.9s ease-out 2;
          pointer-events: none;
        }
        @keyframes cv-arc-flow {
          to { stroke-dashoffset: -36; }
        }
        .cv-arc {
          stroke-dashoffset: 0;
          animation: cv-arc-flow 2.4s linear infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .cv-sym, .cv-cell { transition: none !important; }
          .cv-blink-ring, .cv-arc { animation: none !important; }
        }
      `}</style>

      {/* This component is embedded inside the After Empire essay's PART I.
          The page header, theme toggle, intro paragraphs, PART I title and
          encoding key, and the view switch all live in the parent. */}

      {/* DASHBOARD */}
      <div style={{ padding: isPhone ? '0 0 16px' : '0 0 18px' }}>
        <div style={{
          background: T.panel, border: '1px solid ' + T.panelBorder,
          borderRadius: 6, padding: isPhone ? '14px' : '18px 22px',
        }}>

          {/* Filter rows */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-start', marginBottom: 18 }}>
            <FilterGroup label="CATEGORY" T={T}>
              {[['Both', 'BOTH'], ['AC', 'ARMED CONFLICT'], ['OSV', 'ONE-SIDED VIOLENCE']].map(([k, lbl]) => (
                <button key={k} onClick={() => setCat(k)} className="cv-mono"
                        style={pill(cat === k, T.accent, isPhone, theme)}>{lbl}</button>
              ))}
            </FilterGroup>

            <FilterGroup label="REGION" T={T}>
              {REGION_ORDER.map(r => (
                <button key={r} onClick={() => toggleRegion(r)} className="cv-mono"
                        style={pill(regionSet.has(r), regions[r].color, isPhone, theme)}>
                  {isPhone ? r.split(' ')[0].toUpperCase() : r.toUpperCase()}
                </button>
              ))}
            </FilterGroup>

            <FilterGroup label={`COUNTRY${countrySet.size ? ` · ${countrySet.size}` : ''}`} T={T}>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setCountryMenuOpen(o => !o)} className="cv-mono"
                        style={{
                          ...pill(countrySet.size > 0, T.accent, isPhone, theme),
                          background: countrySet.size > 0 ? T.accent : T.inputBg,
                          color: countrySet.size > 0 ? T.accentInk : T.text,
                          border: '1px solid ' + (countrySet.size > 0 ? T.accent : T.rule),
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                  {countrySet.size === 0 ? 'ALL COUNTRIES' : `${countrySet.size} SELECTED`}
                  <span style={{ fontSize: 8 }}>{countryMenuOpen ? '▲' : '▼'}</span>
                </button>
                {countryMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 30,
                    background: T.panelAlt, border: '1px solid ' + T.rule, borderRadius: 4,
                    width: isPhone ? 240 : 280, boxShadow: '0 6px 24px rgba(0,0,0,.3)',
                    display: 'flex', flexDirection: 'column', maxHeight: 340,
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 12px', borderBottom: '1px solid ' + T.rule, flexShrink: 0,
                      gap: 8,
                    }}>
                      <span className="cv-mono" style={{ fontSize: 9, color: T.faint, letterSpacing: '.22em' }}>
                        {ALL_COUNTRIES.length} COUNTRIES
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {countrySet.size > 0 && (
                          <button onClick={() => setCountrySet(new Set())} className="cv-mono" style={{
                            background: 'none', border: 'none', color: T.accent, fontSize: 9,
                            cursor: 'pointer', letterSpacing: '.15em',
                          }}>CLEAR</button>
                        )}
                        <button onClick={() => setCountryMenuOpen(false)}
                          aria-label="Close country picker"
                          className="cv-mono" style={{
                            background: 'none', border: '1px solid ' + T.rule, color: T.mute,
                            fontSize: 11, lineHeight: 1, cursor: 'pointer',
                            width: 20, height: 20, borderRadius: 99,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>✕</button>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: 2,
                      overflowY: 'auto', overflowX: 'hidden',
                      padding: '8px 10px 10px', flex: 1, WebkitOverflowScrolling: 'touch',
                    }}>
                      {REGION_ORDER.filter(r => regionSet.has(r)).map(r => {
                        const inR = ALL_COUNTRIES.filter(c => COUNTRY_BY_REGION[c] === r);
                        if (!inR.length) return null;
                        return (
                          <div key={r}>
                            <div className="cv-mono" style={{
                              fontSize: 8.5, color: regions[r].color,
                              letterSpacing: '.22em', padding: '6px 6px 2px',
                            }}>{r.toUpperCase()}</div>
                            {inR.map(c => (
                              <label key={c} style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '4px 6px', cursor: 'pointer', borderRadius: 3,
                                background: countrySet.has(c) ? T.accent + '22' : 'transparent',
                              }}>
                                <input
                                  type="checkbox"
                                  checked={countrySet.has(c)}
                                  onChange={() => toggleCountry(c)}
                                  style={{ accentColor: T.accent }}
                                />
                                <span style={{ fontSize: 12, color: T.text }} className="cv-serif">{c}</span>
                              </label>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {[...countrySet].slice(0, 6).map(c => (
                <button key={c} onClick={() => toggleCountry(c)} className="cv-mono cv-chip" style={{
                  background: T.accent + '22', color: T.text,
                  border: '1px solid ' + T.accent + '66',
                  padding: '3px 8px', fontSize: 9.5, letterSpacing: '.1em',
                  borderRadius: 99, cursor: 'pointer',
                  display: 'inline-flex', gap: 6, alignItems: 'center',
                }}>
                  {c}<span className="cv-chip-x">✕</span>
                </button>
              ))}
              {countrySet.size > 6 && (
                <span className="cv-mono" style={{ fontSize: 9.5, color: T.mute }}>
                  +{countrySet.size - 6} more
                </span>
              )}
            </FilterGroup>

            <button onClick={resetFilters} className="cv-mono" style={{
              marginLeft: 'auto', alignSelf: 'flex-end',
              background: 'transparent', color: T.mute,
              border: '1px solid ' + T.rule, padding: '5px 12px',
              fontSize: 9.5, letterSpacing: '.2em', borderRadius: 99, cursor: 'pointer',
            }}>
              ↺ RESET ALL
            </button>
          </div>

          {/* WITHIN-PERIOD STATS · full width; stat set adapts to category filter */}
          <StatsColumn
            T={T} isPhone={isPhone}
            heading={`WITHIN PERIOD · ${yearRange[0]} TO ${yearRange[1]}`}
            subheading={
              <>
                Catalogue events overlapping this range. <strong>Estimated total dead</strong>: approximate cumulative deaths, using mid-range estimates where available — not a precise total, not directly comparable across event types, and may include indirect mortality for some events and direct deaths only for others. <strong>Estimated total displaced</strong>: approximate cumulative displacement events — almost certainly double-counts people displaced more than once and excludes events without reliable displacement estimates.{periodTotals.excludedCount > 0 ? ` ${periodTotals.excludedCount} event${periodTotals.excludedCount === 1 ? '' : 's'} excluded from totals (mortality not auditable).` : ''}
              </>
            }
            items={(() => {
              const acCount = periodTotals.events.filter(e => e.cat === 'AC').length;
              const pvCount = periodTotals.events.filter(e => e.cat === 'OSV').length;
              const total = { label: 'Events overlapping range', value: periodTotals.evCount, big: true, color: T.accent };
              const deaths = { label: 'Estimated total dead', value: fmtCompact(periodTotals.deathsSum) };
              const displaced = { label: 'Estimated total displaced', value: fmtCompact(periodTotals.displacedSum) };
              if (cat === 'AC') return [total, { label: 'Armed conflict', value: acCount }, deaths, displaced];
              if (cat === 'OSV') return [total, { label: 'One-sided violence', value: pvCount }, deaths, displaced];
              return [
                total,
                { label: 'Armed conflict', value: acCount },
                { label: 'One-sided violence', value: pvCount },
                deaths,
                displaced,
              ];
            })()}
          />
        </div>
      </div>

      {/* TIME PERIOD + HISTOGRAM (kept together) */}
      <div style={{ padding: '0 0 14px' }}>
        <div style={{
          background: T.panel, border: '1px solid ' + T.panelBorder,
          borderRadius: 6, padding: isPhone ? '12px 14px' : '16px 20px',
        }}>
          {/* TIME PERIOD slider */}
          <div style={{ marginBottom: 18 }}>
            <div className="cv-mono" style={{
              fontSize: 9, letterSpacing: '.22em', color: T.faint, marginBottom: 10,
              display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6,
            }}>
              <span>TIME PERIOD · DRAG HANDLES TO TRIM</span>
              <span style={{ color: T.text, fontVariantNumeric: 'tabular-nums' }}>
                {yearRange[0]} → {yearRange[1]}{' '}
                <span style={{ color: T.faint }}>({yearRange[1] - yearRange[0] + 1} yrs)</span>
              </span>
            </div>
            <div ref={trackRef} style={{ position: 'relative', height: 34, margin: '0 12px' }}>
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 16, height: 2,
                background: T.rule, borderRadius: 2,
              }}/>
              <div style={{
                position: 'absolute',
                left: `${yrToPct(yearRange[0])}%`,
                right: `${100 - yrToPct(yearRange[1])}%`,
                top: 16, height: 2, background: T.accent,
              }}/>
              <div
                onMouseDown={() => draggingRef.current = 'min'}
                onTouchStart={() => draggingRef.current = 'min'}
                role="slider"
                aria-label="Start year"
                aria-valuemin={START_YEAR}
                aria-valuemax={END_YEAR}
                aria-valuenow={yearRange[0]}
                style={{
                  position: 'absolute', left: `${yrToPct(yearRange[0])}%`,
                  top: 7, transform: 'translateX(-50%)',
                  width: 20, height: 20, borderRadius: '50%',
                  background: T.accent, border: `3px solid ${T.panel}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,.3)',
                  cursor: 'grab', touchAction: 'none',
                }}
              />
              <div
                onMouseDown={() => draggingRef.current = 'max'}
                onTouchStart={() => draggingRef.current = 'max'}
                role="slider"
                aria-label="End year"
                aria-valuemin={START_YEAR}
                aria-valuemax={END_YEAR}
                aria-valuenow={yearRange[1]}
                style={{
                  position: 'absolute', left: `${yrToPct(yearRange[1])}%`,
                  top: 7, transform: 'translateX(-50%)',
                  width: 20, height: 20, borderRadius: '50%',
                  background: T.accent, border: `3px solid ${T.panel}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,.3)',
                  cursor: 'grab', touchAction: 'none',
                }}
              />
              {[1945, 1960, 1975, 1990, 2005, 2020].map(y => (
                <div key={y} style={{
                  position: 'absolute', left: `${yrToPct(y)}%`, top: 26,
                  transform: 'translateX(-50%)',
                }} className="cv-mono">
                  <span style={{ fontSize: 9, color: T.faint }}>{y}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HISTOGRAM header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 14, marginBottom: 12, flexWrap: 'wrap',
          }}>
            <div className="cv-mono" style={{ fontSize: 9, letterSpacing: '.22em', color: T.faint }}>
              WHEN IT HAPPENED · CLICK A BAR TO FOCUS A YEAR · PLAY STEPS THROUGH CONCURRENT EVENTS
            </div>
            <button onClick={() => setPlaying(p => !p)} className="cv-mono" style={{
              background: playing ? T.accent : 'transparent',
              color: playing ? T.accentInk : T.accent,
              border: '1px solid ' + T.accent,
              padding: '6px 14px', fontSize: 10, letterSpacing: '.2em',
              borderRadius: 99, cursor: 'pointer', flexShrink: 0,
            }}>
              {playing ? '■ PAUSE' : '▶ PLAY'}
            </button>
          </div>
          <YearHistogram
            T={T}
            years={years}
            yearRange={yearRange}
            yearTotals={yearTotals}
            selectedYear={scrubYear}
            onSelect={(y) => { setScrubYear(y); setPlaying(false); }}
            isPhone={isPhone}
          />

          {/* YEARLY STATS · breakdown for the selected year, sans heading/total
              (year is already shown on the histogram bar; total would repeat it). */}
          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: '1px solid ' + T.rule,
            display: 'flex', gap: isPhone ? 16 : 28, flexWrap: 'wrap', alignItems: 'baseline',
          }}>
            {(() => {
              const acCount = activeInYear.filter(e => e.cat === 'AC').length;
              const pvCount = activeInYear.filter(e => e.cat === 'OSV').length;
              const totalable = activeInYear.filter(e => !e.excludedFromTotal);
              const deathsSum = totalable.reduce((s, e) => s + (e.deathsEst || 0), 0);
              const displacedSum = totalable.reduce((s, e) => s + (e.displacedEst || 0), 0);
              const ac = { label: 'Armed conflict', value: acCount };
              const pv = { label: 'One-sided violence', value: pvCount };
              const dead = { label: 'Estimated total dead', value: fmtCompact(deathsSum) };
              const displaced = { label: 'Estimated total displaced', value: fmtCompact(displacedSum) };
              const items =
                cat === 'AC' ? [ac, dead, displaced] :
                cat === 'OSV' ? [pv, dead, displaced] :
                [ac, pv, dead, displaced];
              return items.map(it => (
                <div key={it.label} style={{ minWidth: 90 }}>
                  <div className="cv-serif" style={{
                    fontSize: isPhone ? 18 : 22, fontWeight: 500, lineHeight: 1,
                    color: T.text, fontVariantNumeric: 'tabular-nums',
                  }}>{it.value}</div>
                  <div className="cv-mono" style={{
                    fontSize: 9, color: T.mute, marginTop: 4, letterSpacing: '.04em',
                  }}>{it.label}</div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* MAP + GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? `minmax(0, ${mapW + 40}px) 1fr` : '1fr',
        gap: isPhone ? 14 : 20,
        padding: '0 0 20px',
        alignItems: 'start',
      }}>

        {/* MAP */}
        <div ref={mapRef} style={{
          background: T.panel, border: '1px solid ' + T.panelBorder,
          borderRadius: 6, padding: isPhone ? 12 : 18, position: 'relative',
        }} onMouseLeave={() => setMapHover(null)}>
          <div className="cv-mono" style={{
            fontSize: 9, letterSpacing: '.25em', color: T.mute, marginBottom: 8,
          }}>
            MAP · {scrubYear} · {activeInYear.length} ACTIVE EVENT{activeInYear.length === 1 ? '' : 'S'}
          </div>
          <svg viewBox={`0 0 ${mapW} ${mapH}`} style={{
            width: '100%', height: 'auto', display: 'block', maxWidth: '100%',
          }}>
            {/* Graticule */}
            {/* Landmass silhouette — coarse hand-traced gesture, not a basemap. */}
            <g>
              <path
                d={ASIA_MAINLAND
                  .map(([lon, lat], i) => {
                    const [x, y] = project(lon, lat);
                    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ') + ' Z'}
                fill={T.text}
                fillOpacity={theme === 'dark' ? 0.05 : 0.07}
                stroke={T.text}
                strokeOpacity={theme === 'dark' ? 0.18 : 0.22}
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
              {ASIA_ISLANDS.map((loop, idx) => (
                <path key={`isl-${idx}`}
                  d={loop
                    .map(([lon, lat], i) => {
                      const [x, y] = project(lon, lat);
                      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(' ') + ' Z'}
                  fill={T.text}
                  fillOpacity={theme === 'dark' ? 0.05 : 0.07}
                  stroke={T.text}
                  strokeOpacity={theme === 'dark' ? 0.18 : 0.22}
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              ))}
            </g>

            {/* Country labels — anchored at centroids, drawn beneath symbols. */}
            {!isPhone && LABEL_COUNTRIES.map(c => {
              const coord = LABEL_COORDS[c] || COUNTRY_COORDS[c];
              if (!coord) return null;
              const [x, y] = project(coord.lon, coord.lat);
              return (
                <text key={`lbl-${c}`} x={x} y={y}
                  fontSize="8.5" fill={T.text} opacity="0.42"
                  fontFamily="'DM Sans', sans-serif"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none' }}>
                  {c}
                </text>
              );
            })}

            {/* Counter-mapping arcs — for hovered/selected events that span
                2+ countries, connect each pair with a curved bezier. Stroke
                pulses (CSS) so the arc feels like an active linkage rather
                than a neutral geographic line. */}
            {(() => {
              const focus = selectedEvent || (mapHover && mapHover.event);
              if (!focus) return null;
              const pts = focus.countries
                .filter(c => COUNTRY_COORDS[c])
                .map(c => ({ c, p: project(COUNTRY_COORDS[c].lon, COUNTRY_COORDS[c].lat) }));
              if (pts.length < 2) return null;
              const col = regions[focus.region].color;
              const arcs = [];
              for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                  const [x1, y1] = pts[i].p;
                  const [x2, y2] = pts[j].p;
                  const mx = (x1 + x2) / 2;
                  const my = (y1 + y2) / 2;
                  const dx = x2 - x1;
                  const dy = y2 - y1;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  // Push the control point perpendicular to the chord so
                  // the arc lifts away from the straight line, harder for
                  // shorter chords (so very-close countries don't get a
                  // flat link).
                  const lift = Math.min(80, 12 + len * 0.28);
                  const cx = mx + (-dy / len) * lift;
                  const cy = my + (dx / len) * lift;
                  arcs.push(
                    <path key={`arc-${pts[i].c}-${pts[j].c}`}
                      d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`}
                      fill="none" stroke={col}
                      strokeWidth="1.4" strokeOpacity="0.85"
                      strokeDasharray="4 5"
                      strokeLinecap="round"
                      className="cv-arc"
                    />
                  );
                }
              }
              return <g>{arcs}</g>;
            })()}

            {/* Symbols for active-in-year events */}
            {activeInYear.flatMap(e => e.countries.map(c => {
              if (!COUNTRY_COORDS[c]) return null;
              const [x, y] = project(COUNTRY_COORDS[c].lon, COUNTRY_COORDS[c].lat);
              const rCore = radiusForDeaths(e.deathsEst);
              const rHalo = radiusForDisplaced(e.displacedEst || 0);
              // Color by COUNTRY's region, not event's, so Vietnam plotted
              // for the Sino-Vietnamese War shows as Southeast Asia jade
              // rather than East Asia blue.
              const cReg = COUNTRY_REGION[c] || e.region;
              const col = regions[cReg].color;
              const isSel = selectedEvent && selectedEvent.name === e.name;
              const dim = (mapHover && mapHover.event.name !== e.name) || (selectedEvent && !isSel);
              const isPV = e.cat === 'OSV';
              const isBlink = blinkEvents.has(e.name);
              const diamond = `${x},${y - rCore} ${x + rCore},${y} ${x},${y + rCore} ${x - rCore},${y}`;
              const haloDiamond = rHalo > rCore
                ? `${x},${y - rHalo} ${x + rHalo},${y} ${x},${y + rHalo} ${x - rHalo},${y}` : null;
              return (
                <g key={`${e.name}-${c}`} className="cv-sym"
                   onMouseMove={(ev) => onSymbolMove(ev, e, c)}
                   onMouseLeave={() => setMapHover(null)}
                   onClick={() => { setSelectedEvent(e); setSelectedCell(null); }}
                   role="button"
                   aria-label={`${e.name}, ${e.start} to ${e.end}, ${fmtFigure(e.deaths, e.ongoing)} killed${e.ongoing ? ', ongoing' : ''}`}
                   tabIndex={0}>
                  {rHalo > rCore && (isPV
                    ? <polygon points={haloDiamond} fill={col} opacity={dim ? 0.08 : 0.18}/>
                    : <circle cx={x} cy={y} r={rHalo} fill={col} opacity={dim ? 0.08 : 0.18}/>
                  )}
                  {isPV
                    ? <polygon points={diamond} fill={col} opacity={dim ? 0.55 : 1}
                        stroke={isSel ? T.text : 'none'} strokeWidth={isSel ? 1.5 : 0}/>
                    : <circle cx={x} cy={y} r={rCore} fill={col} opacity={dim ? 0.55 : 1}
                        stroke={isSel ? T.text : 'none'} strokeWidth={isSel ? 1.5 : 0}/>}
                  {isBlink && (
                    <circle key={blinkKey} cx={x} cy={y} r={rCore + 4}
                      fill="none" stroke={col} strokeWidth={2}
                      className="cv-blink-ring"/>
                  )}
                </g>
              );
            }))}

          </svg>

          {/* Attribution note on what casualty figures represent. Kept tight
              and immediately under the map so it never sits far from the
              symbols whose meaning it qualifies. */}
          <div className="cv-mono" style={{
            fontSize: 9.5, lineHeight: 1.55, color: T.faint, marginTop: 12,
            paddingTop: 10, borderTop: '1px solid ' + T.rule,
            letterSpacing: '.02em',
          }}>
            <span style={{ color: T.accent, letterSpacing: '.22em', marginRight: 6 }}>
              NOTE ·
            </span>
            <span style={{ color: T.mute }}>
              Death and displacement figures shown on each marker are the
              event's full total, drawn from the cited primary sources, and
              are repeated on every country involved &mdash; not a
              per-country share. Where an event spans two or more states,
              the linking arc visible on hover marks the parties named in
              the catalogue. National-level splits would require additional
              sourcing and are not yet implemented in the dataset.
              {' '}A trailing <strong style={{ color: T.text }}>+</strong> on
              a figure indicates an ongoing event; the total is a running
              estimate through {DATA_AS_OF} and will change.
            </span>
          </div>

          {/* MAP TOOLTIP */}
          {mapHover && (() => {
            const popupRegion = mapHover.country
              ? (COUNTRY_REGION[mapHover.country] || mapHover.event.region)
              : mapHover.event.region;
            const popupColor = regions[popupRegion].color;
            return (
            <div style={{
              position: 'absolute',
              left: Math.min(mapHover.x + 14, mapW - 280),
              top: Math.max(40, mapHover.y - 10),
              background: T.tooltipBg, border: '1px solid ' + T.tooltipBorder,
              borderRadius: 4, padding: '10px 12px', pointerEvents: 'none',
              minWidth: 220, maxWidth: 280,
              boxShadow: '0 4px 16px rgba(0,0,0,.25)', zIndex: 10,
              wordBreak: 'break-word', overflowWrap: 'anywhere',
            }}>
              <div className="cv-mono" style={{
                fontSize: 8.5, letterSpacing: '.22em',
                color: popupColor, marginBottom: 4,
                whiteSpace: 'normal',
              }}>
                {mapHover.event.cat === 'OSV' ? 'ONE-SIDED VIOLENCE' : 'ARMED CONFLICT'}{mapHover.country ? ` · ${mapHover.country.toUpperCase()}` : ''}
              </div>
              <div className="cv-serif" style={{
                fontSize: 15, fontWeight: 500, color: T.text,
                lineHeight: 1.25, marginBottom: 6,
                whiteSpace: 'normal', wordBreak: 'break-word',
              }}>{mapHover.event.name}</div>
              <div className="cv-mono" style={{ fontSize: 9.5, color: T.mute, marginBottom: 8 }}>
                {mapHover.event.start === mapHover.event.end
                  ? mapHover.event.start
                  : `${mapHover.event.start} to ${mapHover.event.end}`}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Row T={T} mark="●" label="Killed" value={fmtFigure(mapHover.event.deaths, mapHover.event.ongoing)}/>
                <Row T={T} mark="○" label="Displaced" value={fmtFigure(mapHover.event.displaced, mapHover.event.ongoing)}/>
              </div>
            </div>
            );
          })()}

          {/* MAP LEGEND */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isPhone ? '1fr' : 'minmax(180px, 1fr) minmax(220px, 1fr) minmax(220px, 1fr)',
            gap: isPhone ? 18 : 36,
            marginTop: 16, paddingTop: 16,
            borderTop: '1px solid ' + T.rule,
            alignItems: 'start',
          }}>
            {/* Category encoded by shape */}
            <div>
              <div className="cv-mono" style={{
                fontSize: 9, letterSpacing: '.22em', color: T.text, marginBottom: 4,
              }}>CATEGORY</div>
              <div className="cv-mono" style={{
                fontSize: 8.5, letterSpacing: '.18em', color: T.faint, marginBottom: 14,
              }}>NOMINAL · ENCODED BY SHAPE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="32" height="32" style={{ flexShrink: 0 }}>
                    <circle cx={16} cy={16} r={13} fill={T.accent}/>
                  </svg>
                  <span className="cv-serif" style={{ fontSize: 14, color: T.text }}>
                    Armed Conflict
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="32" height="32" style={{ flexShrink: 0 }}>
                    {(() => {
                      const x = 16, y = 16, r = 13;
                      const pts = `${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`;
                      return <polygon points={pts} fill={T.accent}/>;
                    })()}
                  </svg>
                  <span className="cv-serif" style={{ fontSize: 14, color: T.text }}>
                    One-sided violence
                  </span>
                </div>
              </div>
            </div>

            {/* Fatalities encoded by core radius */}
            <div>
              <div className="cv-mono" style={{
                fontSize: 9, letterSpacing: '.22em', color: T.text, marginBottom: 4,
              }}>FATALITIES</div>
              <div className="cv-mono" style={{
                fontSize: 8.5, letterSpacing: '.18em', color: T.faint, marginBottom: 14,
              }}>QUANTITATIVE · ENCODED BY CORE RADIUS · SQRT-SCALED</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 64 }}>
                {[1e3, 1e5, 1e7, MAX_DEATHS].map(v => {
                  const r = radiusForDeaths(v);
                  return (
                    <div key={v} style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 6, minWidth: r * 2,
                    }}>
                      <div style={{
                        width: r * 2, height: r * 2, borderRadius: '50%',
                        background: T.accent,
                      }}/>
                      <span className="cv-mono" style={{
                        fontSize: 9, color: T.mute, fontVariantNumeric: 'tabular-nums',
                      }}>{fmt(v)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Displacement encoded by halo radius */}
            <div>
              <div className="cv-mono" style={{
                fontSize: 9, letterSpacing: '.22em', color: T.text, marginBottom: 4,
              }}>DISPLACEMENT</div>
              <div className="cv-mono" style={{
                fontSize: 8.5, letterSpacing: '.18em', color: T.faint, marginBottom: 14,
              }}>QUANTITATIVE · ENCODED BY HALO RADIUS · SQRT-SCALED</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 64 }}>
                {[1e5, 1e6, 1e7].map(v => {
                  const r = radiusForDisplaced(v);
                  return (
                    <div key={v} style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 6, minWidth: r * 2,
                    }}>
                      <div style={{
                        width: r * 2, height: r * 2, borderRadius: '50%',
                        position: 'relative',
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0, borderRadius: '50%',
                          background: T.accent, opacity: 0.22,
                        }}/>
                        <div style={{
                          position: 'absolute', top: '50%', left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 6, height: 6, borderRadius: '50%',
                          background: T.accent,
                        }}/>
                      </div>
                      <span className="cv-mono" style={{
                        fontSize: 9, color: T.mute, fontVariantNumeric: 'tabular-nums',
                      }}>{fmt(v)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {pinnedCountry && (
              <button onClick={() => setPinnedCountry(null)} className="cv-mono" style={{
                gridColumn: '1 / -1',
                justifySelf: 'end',
                background: 'transparent', color: T.accent,
                border: '1px solid ' + T.accent, padding: '4px 10px',
                fontSize: 9, letterSpacing: '.2em', borderRadius: 99, cursor: 'pointer',
              }}>
                ✕ UNPIN {pinnedCountry.toUpperCase()}
              </button>
            )}
          </div>
        </div>

        {/* GRID */}
        <div style={{
          background: T.panel, border: '1px solid ' + T.panelBorder,
          borderRadius: 6, padding: isPhone ? '12px' : '14px 16px',
          position: 'relative', overflowX: 'auto',
        }} onMouseLeave={() => setGridHover(null)}>
          <div style={{ marginBottom: 12 }}>
            <div className="cv-mono" style={{
              fontSize: 9, letterSpacing: '.25em', color: T.mute,
              display: 'flex', justifyContent: 'space-between', gap: 8,
            }}>
              <span>WHEN AND WHERE · {pinnedCountry
                ? `${pinnedCountry.toUpperCase()} ONLY`
                : `${countries.length} COUNTRIES × ${years.length} YEARS`}</span>
              <span style={{ color: T.faint }}>CLICK COUNTRY → PIN · CLICK CELL → OPEN</span>
            </div>
            <div style={{
              fontSize: 12, color: T.text, marginTop: 6, maxWidth: 780, lineHeight: 1.5,
            }}>
              For each country, in each year, was a catalogue event under way? Reads as a calendar of where violence was happening at the same time.
            </div>
            <div style={{
              display: 'flex', gap: 18, marginTop: 10, flexWrap: 'wrap', alignItems: 'center',
            }}>
              <LegendSwatch T={T} color={regions['East Asia'].color} label="Region color" mono/>
              <LegendSwatch T={T} color={regions['East Asia'].color} darker label="2+ events overlap" mono/>
              <LegendSwatch T={T} hatch label="One-sided violence only" mono/>
              <LegendSwatch T={T} empty label="No event" mono/>
            </div>
          </div>
          <div style={{
            minWidth: isPhone ? 560 : 'auto',
            display: 'grid', gridTemplateColumns: `${labelW}px 1fr`,
            gap: 8, alignItems: 'stretch',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {visibleCountries.map(c => (
                <div key={c}
                  onClick={() => setPinnedCountry(pinnedCountry === c ? null : c)}
                  style={{
                    height: cellH, display: 'flex', alignItems: 'center',
                    justifyContent: 'flex-end', gap: 6, paddingRight: 4, cursor: 'pointer',
                  }}>
                  <span className="cv-serif" style={{
                    fontSize: labelFontSize,
                    color: pinnedCountry === c ? T.text : T.mute,
                  }}>{c}</span>
                  <span style={{
                    width: 5, height: 5, borderRadius: 99,
                    background: regions[countryRegion[c]].color, flexShrink: 0,
                  }}/>
                </div>
              ))}
              {visibleCountries.length === 0 && (
                <div className="cv-serif" style={{
                  fontStyle: 'italic', color: T.faint, fontSize: 14, padding: '10px 0',
                }}>No countries match filters.</div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${years.length}, 1fr)`,
                gap: 1, alignContent: 'start',
              }}>
                {visibleCountries.map(c =>
                  years.map(y => {
                    const d = grid[c][y];
                    const inRange = y >= yearRange[0] && y <= yearRange[1];
                    const fill = inRange ? cellColor(d.evs.length, countryRegion[c]) : 'transparent';
                    const hasEvent = d.evs.length > 0;
                    return (
                      <div key={c + y} className="cv-cell"
                        onMouseMove={(ev) => hasEvent && inRange && onCellMove(ev, c, y)}
                        onMouseLeave={() => setGridHover(null)}
                        onClick={() => {
                          if (hasEvent && inRange) {
                            const evs = [...new Map(d.evs.map(e => [e.name, e])).values()];
                            if (evs.length === 1) {
                              setSelectedEvent(evs[0]); setSelectedCell(null);
                            } else {
                              setSelectedCell({ country: c, year: y }); setSelectedEvent(null);
                            }
                            setScrubYear(y);
                            // Flash the corresponding map symbol(s) so the eye
                            // can locate the event geographically after a grid
                            // click. Re-fires every click via blinkKey.
                            triggerBlink(evs.map(e => e.name));
                          }
                        }}
                        style={{
                          height: cellH, background: fill,
                          border: !hasEvent || !inRange ? '1px solid ' + T.emptyCell : 'none',
                          cursor: hasEvent && inRange ? 'pointer' : 'default',
                          position: 'relative', opacity: inRange ? 1 : 0.25,
                        }}>
                        {d.hasPV && !d.hasAC && inRange && (
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: `repeating-linear-gradient(45deg, ${T.hatchInk} 0 1.5px, transparent 1.5px 4px)`,
                            pointerEvents: 'none',
                          }}/>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {(() => {
                const pct = (scrubYear - START_YEAR) / (END_YEAR - START_YEAR) * 100;
                return (
                  <div style={{
                    position: 'absolute', top: -6, bottom: -6,
                    left: `${pct}%`, width: 2,
                    background: T.text, boxShadow: `0 0 8px ${T.accent}80`,
                    pointerEvents: 'none',
                  }}/>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* GRID TOOLTIP (viewport-fixed so it escapes overflow clipping) */}
      {gridHover && grid[gridHover.country] && grid[gridHover.country][gridHover.year]
        && grid[gridHover.country][gridHover.year].evs.length > 0 && (() => {
        const cell = grid[gridHover.country][gridHover.year];
        const evs = [...new Map(cell.evs.map(e => [e.name, e])).values()];
        const left = Math.min(gridHover.x + 14,
          (typeof window !== 'undefined' ? window.innerWidth : 1200) - 260);
        const top = Math.min(gridHover.y + 14,
          (typeof window !== 'undefined' ? window.innerHeight : 800) - 180);
        return (
          <div style={{
            position: 'fixed', left, top,
            background: T.tooltipBg, border: '1px solid ' + T.tooltipBorder,
            borderRadius: 4, padding: '10px 12px', pointerEvents: 'none',
            minWidth: 220, maxWidth: 260,
            boxShadow: '0 6px 24px rgba(0,0,0,.35)', zIndex: 9999,
          }}>
            <div className="cv-mono" style={{
              fontSize: 8.5, letterSpacing: '.22em',
              color: regions[countryRegion[gridHover.country]].color, marginBottom: 4,
            }}>
              {gridHover.country.toUpperCase()} · {gridHover.year}
            </div>
            <Row T={T} mark="●" label="Events active" value={evs.length}/>
            <Row T={T} mark="○" label="Categories" value={
              `${cell.hasAC ? 'AC' : ''}${cell.hasAC && cell.hasPV ? ' + ' : ''}${cell.hasPV ? 'OSV' : ''}`
            }/>
            <div className="cv-mono" style={{ fontSize: 9, color: T.mute, marginTop: 6 }}>
              click for original death and displaced figures
            </div>
            <div className="cv-serif" style={{
              fontSize: 12.5, color: T.text, marginTop: 4, lineHeight: 1.3,
            }}>
              {evs.slice(0, 2).map(e => e.name).join(' · ')}
              {evs.length > 2 ? ` +${evs.length - 2}` : ''}
            </div>
          </div>
        );
      })()}

      {/* DETAIL CARD */}
      <div style={{ padding: isPhone ? '0 0 24px' : '0 0 32px' }}>
        <div style={{
          background: T.panel, border: '1px solid ' + T.panelBorder,
          borderRadius: 6, padding: isPhone ? '14px 16px' : '20px 24px', minHeight: 160,
        }}>

          {detailMode === 'event' && (() => {
            const e = selectedEvent;
            const span = e.end - e.start + 1;
            const inScrub = e.start <= scrubYear && e.end >= scrubYear;
            return (
              <div>
                <div className="cv-mono" style={{
                  fontSize: 9, letterSpacing: '.25em',
                  color: regions[e.region].color, marginBottom: 8,
                }}>
                  EVENT · {e.cat === 'OSV' ? 'ONE-SIDED VIOLENCE' : 'ARMED CONFLICT'} · {e.region.toUpperCase()}
                </div>
                <div className="cv-serif" style={{
                  fontSize: isPhone ? 22 : 30, color: T.headline, fontWeight: 500,
                  marginBottom: 4, lineHeight: 1.15,
                }}>{e.name}</div>
                <div className="cv-mono" style={{ fontSize: 10, color: T.mute, marginBottom: 18 }}>
                  {e.start === e.end ? e.start : `${e.start} to ${e.end}`} ({span} year{span > 1 ? 's' : ''}) · {e.countries.join(', ')}
                </div>

                {/* Estimated Total Killed and Estimated Total Displaced
                    side-by-side on the same line, full width above the
                    description / media row. */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isPhone ? '1fr 1fr' : '1fr 1fr',
                  gap: isPhone ? 18 : 48,
                  paddingBottom: 18, marginBottom: 18,
                  borderBottom: '1px solid ' + T.rule,
                }}>
                  <Stat T={T} isPhone={isPhone}
                    label="● ESTIMATED TOTAL KILLED"
                    value={fmtFigure(e.deaths, e.ongoing)}
                    sub={e.excludedFromTotal
                      ? 'not included in cumulative totals'
                      : (e.ongoing ? `running total · ${span} year${span > 1 ? 's' : ''}` : `over ${span} year${span > 1 ? 's' : ''}`)}
                    color={T.accent}/>
                  <Stat T={T} isPhone={isPhone}
                    label="○ ESTIMATED TOTAL DISPLACED"
                    value={fmtFigure(e.displaced, e.ongoing) || '—'}
                    sub={e.displaced
                      ? (e.excludedFromTotal
                          ? 'not included in cumulative totals'
                          : (e.ongoing ? `running total · ${span} year${span > 1 ? 's' : ''}` : `over ${span} year${span > 1 ? 's' : ''}`))
                      : 'no estimate'}/>
                </div>

                {/* Description on the left, media slot on the right —
                    each takes exactly half so they never overlap. */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr',
                  gap: isPhone ? 18 : 28,
                  alignItems: 'start',
                }}>
                  <div className="cv-serif" style={{
                    fontSize: isPhone ? 14.5 : 15.5, lineHeight: 1.6, color: T.text,
                    minWidth: 0,
                  }}>
                    {renderBold(e.note, e.name)}
                    {e.cites && e.cites.length > 0 && <Cite ids={e.cites}/>}
                  </div>
                  <div style={{
                    background: T.panelAlt,
                    border: '1px dashed ' + T.rule,
                    borderRadius: 4,
                    minHeight: isPhone ? 140 : 240,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 16,
                    position: 'sticky', top: 18,
                  }}>
                    <span className="cv-mono" style={{
                      fontSize: 9, letterSpacing: '.22em', color: T.faint,
                      textAlign: 'center', lineHeight: 1.7,
                    }}>
                      MEDIA SLOT<br/>
                      <span style={{ fontSize: 8.5 }}>PHOTO OR ZOOMED MAP</span>
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                  <button onClick={() => setSelectedEvent(null)} className="cv-mono" style={{
                    background: 'transparent', color: T.mute,
                    border: '1px solid ' + T.rule, padding: '5px 12px',
                    fontSize: 9, letterSpacing: '.2em', borderRadius: 99, cursor: 'pointer',
                  }}>✕ CLOSE</button>
                  {!inScrub && (
                    <button onClick={() => setScrubYear(e.start)} className="cv-mono" style={{
                      background: 'transparent', color: T.accent,
                      border: '1px solid ' + T.accent, padding: '5px 12px',
                      fontSize: 9, letterSpacing: '.2em', borderRadius: 99, cursor: 'pointer',
                    }}>JUMP TO {e.start}</button>
                  )}
                </div>
              </div>
            );
          })()}

          {detailMode === 'cell' && (() => {
            const { country, year } = selectedCell;
            const cell = grid[country] && grid[country][year];
            if (!cell || cell.evs.length === 0) { setSelectedCell(null); return null; }
            const evs = [...new Map(cell.evs.map(e => [e.name, e])).values()];
            return (
              <div>
                <div className="cv-mono" style={{
                  fontSize: 9, letterSpacing: '.25em',
                  color: regions[countryRegion[country]].color, marginBottom: 8,
                }}>
                  {country.toUpperCase()} · {year} · {evs.length} EVENT{evs.length === 1 ? '' : 'S'}
                </div>
                <div style={{
                  display: 'flex', gap: isPhone ? 18 : 40, marginBottom: 18, flexWrap: 'wrap',
                }}>
                  <Stat T={T} isPhone={isPhone}
                    label={`EVENTS IN ${year}`}
                    value={evs.length} sub={`covering ${country}`} color={T.accent}/>
                  <Stat T={T} isPhone={isPhone}
                    label="CATEGORIES"
                    value={`${cell.hasAC ? 'AC' : ''}${cell.hasAC && cell.hasPV ? ' + ' : ''}${cell.hasPV ? 'OSV' : ''}`}
                    sub="AC = armed conflict, OSV = one-sided violence"/>
                </div>
                <div className="cv-mono" style={{
                  fontSize: 9, letterSpacing: '.22em', color: T.faint, marginBottom: 10,
                }}>EVENTS ACTIVE · CLICK FOR FULL DESCRIPTION</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 10,
                }}>
                  {evs.map(e => (
                    <button key={e.name}
                      onClick={() => { setSelectedEvent(e); setSelectedCell(null); }}
                      style={{
                        textAlign: 'left', background: T.panelAlt,
                        border: '1px solid ' + T.rule, borderRadius: 4,
                        padding: '10px 12px', cursor: 'pointer',
                        fontFamily: 'inherit', color: 'inherit',
                      }}>
                      <div className="cv-mono" style={{
                        fontSize: 8.5, letterSpacing: '.22em',
                        color: regions[e.region].color, marginBottom: 4,
                      }}>
                        {e.cat === 'OSV' ? 'ONE-SIDED VIOL.' : 'ARMED CONFLICT'}
                      </div>
                      <div className="cv-serif" style={{
                        fontSize: 16, color: T.text, lineHeight: 1.2, marginBottom: 4,
                      }}>{e.name}</div>
                      <div className="cv-mono" style={{ fontSize: 9.5, color: T.mute }}>
                        {e.start === e.end ? e.start : `${e.start} to ${e.end}`} · {fmtFigure(e.deaths, e.ongoing)} killed · {e.displaced ? fmtFigure(e.displaced, e.ongoing) + ' displaced' : 'no displacement data'}
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setSelectedCell(null)} className="cv-mono" style={{
                  marginTop: 14, background: 'transparent', color: T.mute,
                  border: '1px solid ' + T.rule, padding: '5px 12px',
                  fontSize: 9, letterSpacing: '.2em', borderRadius: 99, cursor: 'pointer',
                }}>✕ CLOSE</button>
              </div>
            );
          })()}

          {detailMode === 'year' && (
            <div>
              <div className="cv-mono" style={{
                fontSize: 9, letterSpacing: '.25em', color: T.accent, marginBottom: 8,
              }}>
                CONCURRENT IN {scrubYear} · {activeInYear.length} EVENT{activeInYear.length === 1 ? '' : 'S'} · CLICK ANY TO OPEN
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 10,
              }}>
                {activeInYear.map(e => (
                  <button key={e.name} onClick={() => setSelectedEvent(e)} style={{
                    textAlign: 'left', background: T.panelAlt,
                    border: '1px solid ' + T.rule, borderRadius: 4,
                    padding: '10px 12px', cursor: 'pointer',
                    fontFamily: 'inherit', color: 'inherit',
                  }}>
                    <div className="cv-mono" style={{
                      fontSize: 8.5, letterSpacing: '.22em',
                      color: regions[e.region].color, marginBottom: 4,
                    }}>
                      {e.cat === 'OSV' ? 'ONE-SIDED VIOL.' : 'ARMED CONFLICT'} · {e.region.toUpperCase()}
                    </div>
                    <div className="cv-serif" style={{
                      fontSize: 16, color: T.text, lineHeight: 1.2, marginBottom: 4,
                    }}>{e.name}</div>
                    <div className="cv-mono" style={{ fontSize: 9.5, color: T.mute }}>
                      {e.start === e.end ? e.start : `${e.start} to ${e.end}`} · {fmtFigure(e.deaths, e.ongoing)} killed · {e.countries.join(', ')}
                    </div>
                  </button>
                ))}
                {activeInYear.length === 0 && (
                  <div className="cv-serif" style={{ fontStyle: 'italic', color: T.faint }}>
                    No active events in {scrubYear} with current filters.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}


// ============================================================
// Subcomponents
// ============================================================

function YearHistogram({ T, years, yearRange, yearTotals, selectedYear, onSelect, isPhone }) {
  const [hoverYear, setHoverYear] = useState(null);
  const valFor = (y) => yearTotals[y] || 0;
  const maxV = Math.max(1, ...years.map(valFor));
  const inRange = (y) => y >= yearRange[0] && y <= yearRange[1];
  const heightFor = (v) => v <= 0 ? 0 : (v / maxV) * 100;
  const barH = isPhone ? 90 : 130;
  const showHover = hoverYear != null ? hoverYear : selectedYear;
  const hoverV = valFor(showHover);

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 1,
        height: barH, position: 'relative',
      }}>
        {years.map(y => {
          const v = valFor(y);
          const h = heightFor(v);
          const within = inRange(y);
          const sel = y === selectedYear;
          const hov = y === hoverYear;
          return (
            <button key={y}
              onClick={() => onSelect(y)}
              onMouseEnter={() => setHoverYear(y)}
              onMouseLeave={() => setHoverYear(null)}
              aria-label={`${y}: ${v} events`}
              style={{
                flex: 1, height: '100%',
                background: 'transparent', border: 'none', padding: 0,
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                cursor: v > 0 ? 'pointer' : 'default',
                opacity: within ? 1 : 0.25,
              }}>
              <div style={{
                width: '100%', height: `${h}%`,
                background: sel ? T.text : (hov ? T.accent : T.accent + 'aa'),
                borderTop: sel ? `2px solid ${T.accent}` : 'none',
                transition: 'background .12s ease',
              }}/>
            </button>
          );
        })}
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${((selectedYear - years[0]) / (years.length - 1)) * 100}%`,
          transform: 'translateX(-50%)',
          width: 1, background: T.text, opacity: 0.5, pointerEvents: 'none',
        }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }} className="cv-mono">
        {[1945, 1960, 1975, 1990, 2005, 2020].map(y => (
          <span key={y} style={{
            fontSize: 9,
            color: y === selectedYear ? T.text : T.faint,
            fontVariantNumeric: 'tabular-nums',
          }}>{y}</span>
        ))}
      </div>
      <div style={{
        marginTop: 10, display: 'flex', alignItems: 'baseline',
        gap: 14, flexWrap: 'wrap',
      }}>
        <div className="cv-serif" style={{
          fontSize: isPhone ? 24 : 30, fontWeight: 500, color: T.text,
          fontVariantNumeric: 'tabular-nums', minWidth: 80,
        }}>{showHover}</div>
        <div className="cv-mono" style={{ fontSize: 10, color: T.faint, letterSpacing: '.18em' }}>
          EVENTS ACTIVE
        </div>
        <div className="cv-serif" style={{
          fontSize: isPhone ? 18 : 22, fontWeight: 500, color: T.accent,
          fontVariantNumeric: 'tabular-nums',
        }}>{hoverV}</div>
        {hoverYear != null && hoverYear !== selectedYear && (
          <span className="cv-mono" style={{
            fontSize: 9, color: T.faint, letterSpacing: '.15em',
          }}>· CLICK BAR TO LOCK</span>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, T, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <span className="cv-mono" style={{
        fontSize: 9, letterSpacing: '.22em', color: T.faint,
      }}>{label}</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  );
}

function StatsColumn({ T, isPhone, heading, subheading, items, tone }) {
  const bg = tone === 'alt' ? T.panelAlt : 'transparent';
  return (
    <div style={{
      background: bg, border: '1px solid ' + T.rule, borderRadius: 4,
      padding: isPhone ? '12px 14px' : '14px 18px',
    }}>
      <div className="cv-mono" style={{
        fontSize: 10, letterSpacing: '.22em', color: T.text, marginBottom: 2,
      }}>{heading}</div>
      <div className="cv-mono" style={{
        fontSize: 9, color: T.faint, marginBottom: 14, letterSpacing: '.04em',
      }}>{subheading}</div>
      <div style={{ display: 'flex', gap: isPhone ? 16 : 28, flexWrap: 'wrap', alignItems: 'baseline' }}>
        {items.map(it => (
          <div key={it.label} style={{ minWidth: it.big ? 130 : 80 }}>
            <div className="cv-serif" style={{
              fontSize: it.big ? (isPhone ? 24 : 30) : (isPhone ? 18 : 22),
              fontWeight: 500, lineHeight: 1,
              color: it.color || T.text, fontVariantNumeric: 'tabular-nums',
            }}>{it.value}</div>
            <div className="cv-mono" style={{
              fontSize: 9, color: T.mute, marginTop: 4, letterSpacing: '.04em',
            }}>{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ T, isPhone, label, value, sub, color }) {
  return (
    <div style={{ minWidth: 130 }}>
      <div className="cv-mono" style={{
        fontSize: 9, letterSpacing: '.22em', color: T.faint, marginBottom: 4,
      }}>{label}</div>
      <div className="cv-serif" style={{
        fontSize: isPhone ? 24 : 32, fontWeight: 500, lineHeight: 1,
        color: color || T.text, fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      {sub && <div className="cv-mono" style={{
        fontSize: 9.5, color: T.mute, marginTop: 4,
      }}>{sub}</div>}
    </div>
  );
}

function Row({ T, mark, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
      <span className="cv-mono" style={{ fontSize: 9.5, color: T.mute }}>{mark} {label}</span>
      <span className="cv-mono" style={{
        fontSize: 11, color: T.text, fontVariantNumeric: 'tabular-nums',
      }}>{value}</span>
    </div>
  );
}

function pill(active, color, phone, theme) {
  return {
    background: active ? color : 'transparent',
    color: active ? (theme === 'dark' ? '#0e1118' : '#ffffff') : color,
    border: '1px solid ' + color,
    padding: phone ? '4px 8px' : '4px 10px',
    fontSize: phone ? 9 : 9.5,
    letterSpacing: '.18em',
    cursor: 'pointer',
    borderRadius: 99,
    whiteSpace: 'nowrap',
    fontFamily: "'JetBrains Mono', monospace",
  };
}

function LegendSwatch({ T, color, darker, hatch, empty, label, mono }) {
  const bg = empty ? 'transparent' : (darker && color ? mix(color, '#000', 0.25) : color);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{
        width: 18, height: 14, borderRadius: 2, flexShrink: 0,
        background: bg,
        border: empty ? '1px solid ' + T.emptyCell : 'none',
        position: 'relative', overflow: 'hidden',
      }}>
        {hatch && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `repeating-linear-gradient(45deg, ${T.hatchInk} 0 1.5px, transparent 1.5px 4px)`,
          }}/>
        )}
      </div>
      <span className={mono ? 'cv-mono' : ''} style={{
        fontSize: 10, letterSpacing: mono ? '.15em' : 0, color: T.mute,
      }}>{label}</span>
    </div>
  );
}
