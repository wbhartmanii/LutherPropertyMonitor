import { dashboardData } from '../data/mockData.js';
import { riverThresholds, riverDataSourceMeta } from '../data/thresholds.js';

const ui = {
  lastUpdated: document.querySelector('[data-last-updated]'),
  alertBadge: document.querySelector('[data-alert-badge]'),
  riverStatusLabel: document.querySelector('[data-river-status]'),
  riverCurrentLevel: document.querySelector('[data-river-level]'),
  riverTrend: document.querySelector('[data-river-trend]'),
  riverSource: document.querySelector('[data-river-source]'),
  riverDisclaimer: document.querySelector('[data-river-disclaimer]'),
  riverSparkline: document.querySelector('[data-river-sparkline]'),
  weatherTemp: document.querySelector('[data-weather-temp]'),
  weatherPrecip: document.querySelector('[data-weather-precip]'),
  weatherWind: document.querySelector('[data-weather-wind]'),
  weatherSummary: document.querySelector('[data-weather-summary]'),
  fishingSource: document.querySelector('[data-fishing-source]'),
  fishingTips: document.querySelector('[data-fishing-tips]'),
  trailNotes: document.querySelector('[data-trail-notes]'),
  cameraGrid: document.querySelector('[data-camera-grid]'),
  wildlifeLog: document.querySelector('[data-wildlife-log]'),
  eventsList: document.querySelector('[data-events-list]'),
  trendSummary: document.querySelector('[data-trend-summary]'),
  notesList: document.querySelector('[data-notes-list]'),
  viewButtons: document.querySelectorAll('[data-view-toggle]'),
  rawRows: document.querySelectorAll('[data-visible-in="raw"]'),
  interpretedRows: document.querySelectorAll('[data-visible-in="interpreted"]')
};

function getRiverStatus(levelFt) {
  return (
    riverThresholds.find((threshold) => levelFt >= threshold.min && levelFt < threshold.max) ||
    riverThresholds[riverThresholds.length - 1]
  );
}

function getTrend(levelSeries) {
  if (levelSeries.length < 2) {
    return { direction: 'steady', delta: 0 };
  }

  const delta = Number((levelSeries[levelSeries.length - 1] - levelSeries[0]).toFixed(2));
  const direction = delta > 0.1 ? 'rising' : delta < -0.1 ? 'falling' : 'steady';
  return { direction, delta };
}

function buildRulesSummary(data, status, trend) {
  const precip = data.weather.precipitationChance;
  const trendClause =
    trend.direction === 'rising'
      ? `River levels have risen ${Math.abs(trend.delta).toFixed(1)} ft in the last ${data.river.historyHours} hours.`
      : trend.direction === 'falling'
        ? `River levels have fallen ${Math.abs(trend.delta).toFixed(1)} ft in the last ${data.river.historyHours} hours.`
        : `River levels are mostly steady over the last ${data.river.historyHours} hours.`;

  const statusClause =
    status.severity >= 3
      ? `Conditions are in ${status.label.toLowerCase()} range and warrant active property checks.`
      : status.severity === 2
        ? `Conditions are approaching caution range near the riverbanks.`
        : `Current river status remains ${status.label.toLowerCase()} for this property estimate.`;

  const weatherClause =
    precip >= 60
      ? `Rain probability is elevated (${precip}%), which could sustain or accelerate the trend.`
      : `Near-term precipitation risk is moderate (${precip}%).`;

  return `${trendClause} ${statusClause} ${weatherClause}`;
}

function formatTimestamp(iso) {
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function renderSparkline(values, status) {
  if (!values.length) return;

  const w = 300;
  const h = 90;
  const padding = 8;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, i) => {
      const x = padding + (i / (values.length - 1 || 1)) * (w - padding * 2);
      const y = h - padding - ((value - min) / range) * (h - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  ui.riverSparkline.setAttribute('viewBox', `0 0 ${w} ${h}`);
  ui.riverSparkline.innerHTML = `
    <polyline fill="none" stroke="${status.color}" stroke-width="4" points="${points}" />
    <line x1="0" y1="${h - padding}" x2="${w}" y2="${h - padding}" class="sparkline-axis" />
  `;
}

function renderCameraGallery(cameras) {
  ui.cameraGrid.innerHTML = cameras
    .map(
      (cam) => `
      <article class="camera-card" data-camera-id="${cam.id}">
        <img src="${cam.imageUrl}" alt="${cam.name} recent frame" loading="lazy" />
        <div class="camera-meta">
          <h4>${cam.name}</h4>
          <p>${cam.location}</p>
          <time>${formatTimestamp(cam.timestamp)}</time>
        </div>
      </article>
    `
    )
    .join('');
}

function renderNotes(notes) {
  ui.notesList.innerHTML = notes.map((note) => `<li>${note}</li>`).join('');
}

function renderFishingTips(fishingData) {
  ui.fishingTips.innerHTML = fishingData.tips
    .map(
      (tip) => `
      <article class="tip-card">
        <h4>${tip.species}</h4>
        <p><strong>Where/when:</strong> ${tip.bite}</p>
        <p><strong>Try:</strong> ${tip.baitOrFly}</p>
        <p class="tip-confidence">${tip.confidence} confidence</p>
      </article>
    `
    )
    .join('');
}

function renderWildlifeLog(entries) {
  ui.wildlifeLog.innerHTML = entries
    .map(
      (entry) => `
      <article class="wildlife-item">
        <h4>${entry.species} <span>×${entry.count}</span></h4>
        <p>${entry.behavior}</p>
        <p class="subtle">Seen at ${entry.camera} · ${formatTimestamp(entry.timestamp)}</p>
      </article>
    `
    )
    .join('');
}

function renderCommunityEvents(events) {
  ui.eventsList.innerHTML = events
    .map(
      (event) => `
      <article class="event-item">
        <h4>${event.name}</h4>
        <p>${formatTimestamp(event.date)} · ${event.location}</p>
        <p class="subtle">${event.notes}</p>
      </article>
    `
    )
    .join('');
}

function setViewMode(viewMode) {
  ui.viewButtons.forEach((button) => {
    const isSelected = button.dataset.viewToggle === viewMode;
    button.setAttribute('aria-pressed', String(isSelected));
  });

  ui.interpretedRows.forEach((node) => node.classList.toggle('hidden', viewMode !== 'interpreted'));
  ui.rawRows.forEach((node) => node.classList.toggle('hidden', viewMode !== 'raw'));
}

function init() {
  const status = getRiverStatus(dashboardData.river.currentLevel);
  const trend = getTrend(dashboardData.river.recentLevels);
  const summary = buildRulesSummary(dashboardData, status, trend);

  ui.lastUpdated.textContent = formatTimestamp(dashboardData.lastUpdated);

  ui.riverStatusLabel.textContent = status.label;
  ui.riverStatusLabel.style.setProperty('--status-color', status.color);
  ui.riverCurrentLevel.textContent = `${dashboardData.river.currentLevel.toFixed(1)} ${dashboardData.river.units}`;
  ui.riverTrend.textContent = `${trend.direction} (${trend.delta > 0 ? '+' : ''}${trend.delta.toFixed(1)} ft / ${dashboardData.river.historyHours}h)`;
  ui.riverSource.textContent = riverDataSourceMeta.sourceName;
  ui.riverDisclaimer.textContent = riverDataSourceMeta.disclaimer;

  if (status.severity >= 2) {
    ui.alertBadge.classList.remove('hidden');
    ui.alertBadge.textContent = status.severity >= 3 ? 'Flood-stage attention' : 'Caution stage';
  }

  renderSparkline(dashboardData.river.recentLevels, status);

  ui.weatherTemp.textContent = `${dashboardData.weather.temperatureF}°F`;
  ui.weatherPrecip.textContent = `${dashboardData.weather.precipitationChance}%`;
  ui.weatherWind.textContent = `${dashboardData.weather.windMph} mph`;
  ui.weatherSummary.textContent = dashboardData.weather.summary;
  ui.fishingSource.textContent = `Source: ${dashboardData.fishing.source}`;
  ui.trailNotes.textContent = dashboardData.trails.notes;

  renderCameraGallery(dashboardData.cameras);
  renderFishingTips(dashboardData.fishing);
  renderWildlifeLog(dashboardData.wildlifeLog);
  renderCommunityEvents(dashboardData.communityEvents);
  ui.trendSummary.textContent = summary;
  renderNotes(dashboardData.notes);

  ui.viewButtons.forEach((button) => {
    button.addEventListener('click', () => setViewMode(button.dataset.viewToggle));
  });

  setViewMode('interpreted');
}

init();
