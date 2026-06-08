# Global Conflict & Flight Tracker

An OSINT-style tactical dashboard for tracking global war events, flight path disruptions, and conflict zones in real time.

## Features

- **Interactive Leaflet Map** — dark military-style tiles with pulsing animated markers
- **17 Real-World Conflict Events** — Ukraine/Russia, Gaza/Lebanon, Red Sea/Yemen, Taiwan Strait, Sudan, Myanmar, Sahel
- **10 Tracked Flight Paths** — rerouted commercial routes (SQ308, LH758, BA33, JL068), humanitarian flights (WFP, ICRC, MSF)
- **No-Fly Zone Polygons** — Ukrainian airspace, Red Sea High Risk Zone, Taiwan Strait exercise corridor, Gaza
- **Left Panel** — filterable event list by type, severity, region with expandable detail
- **Right Panel** — flight path list with status tabs
- **Stats Bar** — live event counts, region tally, rerouted/humanitarian flight summary
- **Header** — live UTC clock, blinking critical event counter, LIVE indicator

## Tech Stack

- React 18 + Vite
- Leaflet.js for mapping
- Tailwind CSS (dark military theme)
- lucide-react icons
- date-fns

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Disclaimer

> Data is for informational/educational purposes only.  
> Sources: ICAO, EUROCONTROL, UN OCHA, ACLED, OSINT aggregators
