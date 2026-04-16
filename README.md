# Luther Property Intelligence Dashboard (MVP)

A lightweight, static web dashboard for monitoring river-adjacent property conditions near **Luther, Michigan**.

This MVP is intentionally simple and GitHub Pages-ready. It uses mock data today, but is structured for easy future upgrades to live APIs, serverless data pipelines, and AI-generated analysis.

## Project purpose

This dashboard translates raw environmental signals into practical property-focused insights:

- River conditions interpreted into owner-friendly categories
- Weather snapshot relevant to short-term access and risk
- Trail/game camera gallery with metadata
- Trend summary section designed for future AI analysis

> **Important:** River status shown in this MVP is an interpreted estimate for planning, not an official flood warning.

## MVP features

- Dashboard cards for:
  - River status
  - Weather
  - Camera photos
  - Fishing tips (mock Orvis-style guidance)
  - ORV trail map
  - Recently spotted wildlife log
  - Upcoming community events
  - Trend summary
  - Notes/future modules
- Configurable flood/river interpretation thresholds
- Rules-based trend summary (placeholder for future LLM output)
- “Interpreted view” vs “Raw view” toggle
- Alert badge when river state reaches caution/flood levels
- Last updated timestamp
- Best-effort live pulls for river/fishing sources with automatic fallback to mock data
- River graph supports baseline overlay and computes Jul–Sep average baseline when historical data is available

## Tech stack

- Plain HTML, CSS, and JavaScript (ES modules)
- No build step
- No backend
- Minimal dependencies (none)

## File structure

```text
.
├── index.html                # Main dashboard page
├── css/
│   └── main.css              # Visual styling (dark, utility-focused)
├── js/
│   ├── app.js                # UI rendering + interpretation + rules summary logic
│   └── liveData.js           # Best-effort live source pull helpers (with graceful fallback)
├── data/
│   ├── mockData.js           # Mock river/weather/camera/notes data
│   ├── thresholds.js         # Configurable river status thresholds + source metadata
│   └── liveSources.js        # External source URLs (Scott, Bear Track, Orvis)
└── assets/
    ├── cameras/
    │   ├── cam-river-bend.svg
    │   ├── cam-pine-trail.svg
    │   └── cam-north-field.svg
    └── trails/
        └── orv-trail-map.svg
```

## Data model (future-ready)

Current mock model is shaped to support expansion into real integrations:

- `dashboardData.river`
  - current level
  - current flow
  - Jul–Sep baseline level (mock fallback)
  - historical series
  - source/station metadata
- `dashboardData.weather`
  - temperature
  - precipitation chance
  - wind
  - summary
- `dashboardData.cameras[]`
  - id, name, location
  - timestamp
  - image URL
- `dashboardData.fishing.tips[]`
  - species, bite behavior window
  - bait/fly recommendations
  - confidence score
- `dashboardData.wildlifeLog[]`
  - species and count
  - camera source
  - timestamp and behavior notes
- `dashboardData.communityEvents[]`
  - event title
  - date/time
  - location + notes
- `dashboardData.ai`
  - placeholder fields for model summary, risk score, anomalies
- `dashboardData.notes[]`
  - future module backlog

## Run locally

Because this project uses ES modules, run from a simple static server (not `file://`).

### Option 1 (Python)

```bash
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

### Option 2 (VS Code Live Server)

Open the folder and use **“Open with Live Server”**.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your preferred branch), `/ (root)`
4. Save and wait for Pages deployment.
5. Open your published URL.

No build or action is required for this MVP.

## Where to plug in real APIs later

- **River source:** replace `dashboardData.river` in `data/mockData.js` with fetched gauge data (or inject via a pre-generated JSON file). 
- **Current live-source wiring:** source URLs are in `data/liveSources.js`, and browser fetch attempts + graceful fallback are in `js/liveData.js`.
- **MonitorMW API candidates configured:** `/api/v1/sites/?search=<site>` and `/sites/<site>/?format=json` are attempted first, then page-parsing fallback.
- **Known limitation:** direct browser pulls can fail due CORS or anti-bot protections from third-party sites; the UI reports this and stays in mock mode when blocked.
- **Historical baseline logic:** when historical points are available, `deriveRiverStats()` in `js/liveData.js` computes July–September averages for level/flow to compare against current conditions.
- **Weather source:** replace `dashboardData.weather` with weather API output.
- **Camera source:** replace `dashboardData.cameras` with actual media metadata feed.
- **Fishing tips source:** replace `dashboardData.fishing` with curated fishing feed data (for example, Orvis-supported regional inputs if available/licensed).
- **Trail map source:** replace mock SVG in `assets/trails/` with georeferenced map export or generated tile.
- **Wildlife log source:** convert `dashboardData.wildlifeLog` to append historical camera detections from media metadata.
- **Community events source:** replace `dashboardData.communityEvents` with town/county/community calendar API or import feed.
- **Interpretation thresholds:** edit `data/thresholds.js` for property-specific stage categories.
- **AI summary:** replace `buildRulesSummary()` in `js/app.js` with LLM-generated summary text.

## Suggested next steps

- Add daily history files (JSON) for lightweight trend retention
- Add camera/date filters in the existing gallery layout
- Add small map panel for camera/gauge context
- Add serverless function for consolidated data fetch + AI summary generation
- Add notification routing when threshold severity crosses configured levels
