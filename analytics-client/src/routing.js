import pathToRegex from 'path-to-regexp';

const viewToKeys = {
  'playerSummary': [],
  'characterSummary': [],
  'notFound': [],
};

const viewToRoutes = [
  {
    path: 'playerSummary',
    regex: pathToRegex('#/players/:membershipId', viewToKeys.playerSummary),
  },
  {
    path: 'characterSummary',
    regex: pathToRegex('#/players/:membershipId/characters/:characterId', viewToKeys.characterSummary),
  },
  {
    path: 'notFound',
    regex: pathToRegex('*', viewToKeys.notFound),
  },
];

export const routes = {
  playerSummary: 'playerSummary',
  characterSummary: 'characterSummary'
};

export function parseHash(rawPath) {
  const match = viewToRoutes
    .map(route => ({
      results: route.regex.exec(rawPath),
      path: route.path,
    }))
    .filter(possible => possible.results)[0];

  if (!match) {
    return { path: null, params: null }
  }

  return {
    path: match.path,
    params: match
      .results
      .slice(1)
      .map((data, idx) => ({
        [viewToKeys[match.path][idx].name]: data,
      }))
      .reduce((agg, val) => Object.assign(agg, val), {}),
  };
}
