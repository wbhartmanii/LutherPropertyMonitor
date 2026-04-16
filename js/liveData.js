import { liveSources } from '../data/liveSources.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const RIVER_CACHE_KEY = 'lpm:riverLiveStats:v1';

async function fetchJson(url) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function parseTimeValuePoints(payload) {
  const fromResults = Array.isArray(payload?.results) ? payload.results : [];
  const fromTimeseries = Array.isArray(payload?.timeseries) ? payload.timeseries : [];
  const fromValues = Array.isArray(payload?.values) ? payload.values : [];

  const candidates = [...fromResults, ...fromTimeseries, ...fromValues]
    .map((row) => {
      const timestamp = row?.timestamp || row?.date_time || row?.datetime || row?.time || row?.DateTime;
      const value = Number(row?.value ?? row?.data_value ?? row?.Value ?? row?.result);
      const flow = Number(row?.flow ?? row?.discharge ?? row?.Flow ?? NaN);

      if (!timestamp || !Number.isFinite(value)) return null;
      return {
        timestamp,
        value,
        flow: Number.isFinite(flow) ? flow : null
      };
    })
    .filter(Boolean);

  return candidates;
}

function parseSiteFromApi(payload) {
  const points = parseTimeValuePoints(payload);
  if (!points.length) return null;

  return {
    points,
    sourceLabel: payload?.site_name || payload?.name || payload?.site || 'Monitor My Watershed API'
  };
}

function parseSiteFromHtml(html) {
  // Fallback parser for page JSON blobs if direct API routes are blocked.
  const jsonCandidates = html.match(/\{[\s\S]{200,}\}/g) || [];
  for (const candidate of jsonCandidates) {
    try {
      const parsed = JSON.parse(candidate);
      const interpreted = parseSiteFromApi(parsed);
      if (interpreted?.points?.length) return interpreted;
    } catch {
      // ignore non-json snippets
    }
  }
  return null;
}

function average(values) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function toDate(input) {
  const dt = new Date(input);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function deriveRiverStats(points) {
  const sorted = [...points]
    .map((point) => ({ ...point, dt: toDate(point.timestamp) }))
    .filter((point) => point.dt)
    .sort((a, b) => a.dt - b.dt);

  if (!sorted.length) {
    return null;
  }

  const now = sorted[sorted.length - 1].dt;
  const recentCutoff = now.getTime() - 24 * 60 * 60 * 1000;
  const recentSeries = sorted.filter((point) => point.dt.getTime() >= recentCutoff);
  const recentLevels = recentSeries.map((point) => Number(point.value.toFixed(2)));

  const julSep = sorted.filter((point) => {
    const month = point.dt.getUTCMonth() + 1;
    return month >= 7 && month <= 9;
  });

  const baselineLevel = average(julSep.map((point) => point.value));
  const baselineFlow = average(julSep.map((point) => point.flow).filter((value) => value !== null));

  return {
    currentLevel: sorted[sorted.length - 1].value,
    currentFlow: sorted[sorted.length - 1].flow,
    recentLevels: recentLevels.length ? recentLevels : sorted.slice(-12).map((point) => point.value),
    baselineLevel,
    baselineFlow,
    baselineSampleCount: julSep.length,
    totalSamples: sorted.length,
    periodDays: Math.max(1, Math.round((now - sorted[0].dt) / MS_PER_DAY))
  };
}

/**
 * Best-effort pull against Monitor My Watershed candidates.
 * Tries candidate API URLs first, then raw site page parsing fallback.
 */
export async function tryFetchRiverStatsFromSources() {
  const successfulReads = [];

  for (const source of liveSources.river) {
    for (const apiUrl of source.candidateApiUrls) {
      try {
        const payload = await fetchJson(apiUrl);
        const parsed = parseSiteFromApi(payload);
        if (parsed?.points?.length) {
          const stats = deriveRiverStats(parsed.points);
          if (stats) {
            successfulReads.push({
              source: source.name,
              sourceUrl: source.siteUrl,
              stats
            });
          }
        }
      } catch {
        // continue to next candidate URL
      }
    }

    try {
      const html = await fetchText(source.siteUrl);
      const parsed = parseSiteFromHtml(html);
      if (parsed?.points?.length) {
        const stats = deriveRiverStats(parsed.points);
        if (stats) {
          successfulReads.push({
            source: source.name,
            sourceUrl: source.siteUrl,
            stats
          });
        }
      }
    } catch {
      // try next source
    }
  }

  if (successfulReads.length) {
    const best = successfulReads.sort((a, b) => b.stats.currentLevel - a.stats.currentLevel)[0];

    try {
      localStorage.setItem(
        RIVER_CACHE_KEY,
        JSON.stringify({
          cachedAt: new Date().toISOString(),
          ...best
        })
      );
    } catch {
      // ignore storage write errors
    }

    return {
      ok: true,
      source: best.source,
      sourceUrl: best.sourceUrl,
      stats: best.stats,
      detail: `Live data pulled from ${best.source} (${successfulReads.length} source read${successfulReads.length > 1 ? 's' : ''}).`
    };
  }

  try {
    const cached = JSON.parse(localStorage.getItem(RIVER_CACHE_KEY) || 'null');
    if (cached?.stats) {
      return {
        ok: true,
        source: cached.source,
        sourceUrl: cached.sourceUrl,
        stats: cached.stats,
        detail: `Live pull blocked; using cached river data from ${new Date(cached.cachedAt).toLocaleString()}.`
      };
    }
  } catch {
    // ignore corrupted cache
  }

  return {
    ok: false,
    detail:
      'Live river pull blocked or unparseable. No cached live data found, so mock mode is active.'
  };
}

export async function tryFetchFishingReportSnippet() {
  try {
    const html = await fetchText(liveSources.fishing.url);
    const hasMichigan = /Little Manistee|Michigan/i.test(html);
    return {
      ok: hasMichigan,
      detail: hasMichigan
        ? 'Live fishing report reachable. Still using mock tips until parser is finalized.'
        : 'Fishing report reached but parsing needs tuning. Using mock tips.'
    };
  } catch {
    return {
      ok: false,
      detail: 'Live fishing pull blocked (CORS/bot protection). Showing mock tips.'
    };
  }
}
