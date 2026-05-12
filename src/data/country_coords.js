// ============================================================
// Country centroid coordinates (approximate, lon / lat in degrees)
//
// Used by the Convergence map to position event symbols. These are
// rough population-weighted centroids, not strict geographic centroids,
// so the symbols sit roughly where most readers expect each country
// to "be" on a stylized Asia map. Adjust freely.
//
// Soviet Union is plotted near its post-Stalin demographic centroid
// (western Russia) for the Sino-Soviet Border Conflict and the
// Soviet-Afghan War; the actual landmass extended much further north
// and east, but a single dot has to land somewhere.
// ============================================================

export const COUNTRY_COORDS = {
  // East Asia
  "China":        { lon: 104,   lat: 36   },
  "Taiwan":       { lon: 121,   lat: 23.5 },
  "North Korea":  { lon: 127,   lat: 40   },
  "South Korea":  { lon: 128,   lat: 36.5 },
  "Japan":        { lon: 138,   lat: 36   },
  "Mongolia":     { lon: 103,   lat: 47   },
  "Soviet Union": { lon: 60,    lat: 55   },

  // Southeast Asia
  "Indonesia":    { lon: 118,   lat: -2   },
  "Vietnam":      { lon: 108,   lat: 16   },
  "Philippines":  { lon: 122,   lat: 13   },
  "Malaysia":     { lon: 109,   lat: 4    },
  "Myanmar":      { lon: 96,    lat: 21   },
  "Laos":         { lon: 103,   lat: 18   },
  "Cambodia":     { lon: 105,   lat: 12.5 },
  "Thailand":     { lon: 101,   lat: 15   },
  "Timor-Leste":  { lon: 125.5, lat: -8.8 },
  "Brunei":       { lon: 114.7, lat: 4.5  },
  "Singapore":    { lon: 103.8, lat: 1.4  },

  // South Asia
  "India":        { lon: 78,    lat: 22   },
  "Pakistan":     { lon: 70,    lat: 30   },
  "Bangladesh":   { lon: 90,    lat: 24   },
  "Bhutan":       { lon: 90.4,  lat: 27.5 },
  "Nepal":        { lon: 84,    lat: 28   },
  "Sri Lanka":    { lon: 80.7,  lat: 7.9  },
  "Maldives":     { lon: 73,    lat: 4    },
  "Afghanistan":  { lon: 67,    lat: 33   },

  // Central Asia
  "Tajikistan":   { lon: 71,    lat: 38.5 },
  "Kyrgyzstan":   { lon: 75,    lat: 41   },
  "Uzbekistan":   { lon: 64,    lat: 41.4 },
  "Kazakhstan":   { lon: 67,    lat: 48   },
  "Turkmenistan": { lon: 59,    lat: 39   },

  // West Asia
  "Israel":       { lon: 35,    lat: 31   },
  "Palestine":    { lon: 35.2,  lat: 32   },
  "Egypt":        { lon: 30,    lat: 27   },
  "Lebanon":      { lon: 36,    lat: 34   },
  "Iraq":         { lon: 44,    lat: 33   },
  "Syria":        { lon: 38,    lat: 35   },
  "Iran":         { lon: 53,    lat: 32   },
  "Turkey":       { lon: 35,    lat: 39   },
  "Yemen":        { lon: 47,    lat: 15   },
  "Jordan":       { lon: 36.5,  lat: 31   },
  "Saudi Arabia": { lon: 45,    lat: 24   },
  "Kuwait":       { lon: 47.5,  lat: 29.3 },
  "Oman":         { lon: 56,    lat: 21   },
  "Armenia":      { lon: 45,    lat: 40.2 },
  "Azerbaijan":   { lon: 47.5,  lat: 40.4 },
};
