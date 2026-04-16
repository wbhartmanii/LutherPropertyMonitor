/**
 * Property-specific interpretation thresholds for river stage (ft).
 * Edit these values to match your property's observed conditions.
 */
export const riverThresholds = [
  {
    key: 'normal',
    label: 'Normal',
    min: 0,
    max: 6,
    severity: 0,
    color: 'var(--status-normal)'
  },
  {
    key: 'elevated',
    label: 'Elevated',
    min: 6,
    max: 8,
    severity: 1,
    color: 'var(--status-elevated)'
  },
  {
    key: 'bankfull',
    label: 'Bankfull / caution',
    min: 8,
    max: 9.5,
    severity: 2,
    color: 'var(--status-caution)'
  },
  {
    key: 'minorFlooding',
    label: 'Minor flooding',
    min: 9.5,
    max: 11,
    severity: 3,
    color: 'var(--status-minor-flood)'
  },
  {
    key: 'majorFlooding',
    label: 'Major flooding',
    min: 11,
    max: Infinity,
    severity: 4,
    color: 'var(--status-major-flood)'
  }
];

export const riverDataSourceMeta = {
  sourceName: 'Mock property gauge estimate (MVP)',
  disclaimer:
    'Interpreted property-specific estimate for planning only. Not an official flood warning or emergency alert.'
};
