export const dashboardData = {
  lastUpdated: '2026-04-16T12:30:00Z',
  river: {
    stationName: 'Luther River Corridor (proxy gauge)',
    units: 'ft',
    currentLevel: 8.4,
    historyHours: 12,
    recentLevels: [6.4, 6.5, 6.7, 7.0, 7.1, 7.3, 7.5, 7.8, 8.0, 8.2, 8.3, 8.4]
  },
  weather: {
    location: 'Luther, MI',
    temperatureF: 43,
    precipitationChance: 65,
    windMph: 16,
    summary: 'Cool with steady rain bands moving through this afternoon.'
  },
  cameras: [
    {
      id: 'cam-1',
      name: 'River Bend Cam',
      location: 'South bank bend',
      timestamp: '2026-04-16T12:08:00Z',
      imageUrl: './assets/cameras/cam-river-bend.svg'
    },
    {
      id: 'cam-2',
      name: 'Pine Trail Cam',
      location: 'East trail crossing',
      timestamp: '2026-04-16T11:57:00Z',
      imageUrl: './assets/cameras/cam-pine-trail.svg'
    },
    {
      id: 'cam-3',
      name: 'North Field Cam',
      location: 'North edge food plot',
      timestamp: '2026-04-16T11:42:00Z',
      imageUrl: './assets/cameras/cam-north-field.svg'
    }
  ],
  notes: [
    'Future module: snowpack + thaw tracker',
    'Future module: driveway access risk indicator',
    'Future module: custom alert routing (SMS/email/push)'
  ],
  // Placeholder for future AI model output.
  ai: {
    model: null,
    summary: null,
    riskScore: null,
    anomalies: []
  }
};
