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
  fishing: {
    source: 'Orvis-inspired playbook (mock data)',
    tips: [
      {
        species: 'Steelhead',
        bite: 'Early morning seams with moderate current.',
        baitOrFly: 'Egg patterns, pink worms, and chartreuse beads',
        confidence: 'Medium'
      },
      {
        species: 'Brown trout',
        bite: 'Overcast windows and slower tailouts.',
        baitOrFly: 'Woolly buggers, black stonefly nymphs',
        confidence: 'Medium-high'
      },
      {
        species: 'Smallmouth bass',
        bite: 'Warmer afternoon pockets near woody structure.',
        baitOrFly: 'Ned rigs, olive streamers, tube jigs',
        confidence: 'Medium'
      }
    ]
  },
  trails: {
    totalMiles: 1.0,
    notes: 'Primary ORV loop is rideable now; low section near the river bend may soften after prolonged rain.'
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
  wildlifeLog: [
    {
      species: 'White-tailed deer',
      count: 3,
      camera: 'North Field Cam',
      timestamp: '2026-04-15T19:18:00Z',
      behavior: 'Feeding along food plot edge'
    },
    {
      species: 'Wild turkey',
      count: 5,
      camera: 'Pine Trail Cam',
      timestamp: '2026-04-14T06:41:00Z',
      behavior: 'Moving east across trail crossing'
    },
    {
      species: 'Raccoon',
      count: 1,
      camera: 'River Bend Cam',
      timestamp: '2026-04-13T22:12:00Z',
      behavior: 'Foraging near downed timber'
    }
  ],
  communityEvents: [
    {
      name: 'Luther Spring ORV Trail Cleanup',
      date: '2026-04-25T13:00:00Z',
      location: 'Luther Trailhead Lot',
      notes: 'Volunteer workday and route condition update'
    },
    {
      name: 'Pere Marquette River Angler Meetup',
      date: '2026-05-02T14:30:00Z',
      location: 'Scottville Municipal Launch',
      notes: 'Local hatch discussion and tackle swap'
    },
    {
      name: 'Lake County Wildlife Habitat Talk',
      date: '2026-05-09T15:00:00Z',
      location: 'Baldwin Community Center',
      notes: 'Land stewardship practices for private property owners'
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
