export const liveSources = {
  river: [
    {
      key: 'scott',
      name: 'Scott Monitor My Watershed',
      siteUrl: 'https://monitormywatershed.org/sites/Scott/',
      candidateApiUrls: [
        'https://monitormywatershed.org/api/v1/sites/?search=Scott',
        'https://monitormywatershed.org/sites/Scott/?format=json'
      ]
    },
    {
      key: 'bearTrack',
      name: 'Bear Track Monitor My Watershed',
      siteUrl: 'https://monitormywatershed.org/sites/Bear%20Track/',
      candidateApiUrls: [
        'https://monitormywatershed.org/api/v1/sites/?search=Bear%20Track',
        'https://monitormywatershed.org/sites/Bear%20Track/?format=json'
      ]
    }
  ],
  fishing: {
    name: 'Orvis Fishing Report - Little Manistee River',
    url: 'https://fishingreports.orvis.com/midwest/michigan/little-manistee-river'
  }
};
