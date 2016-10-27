import { parseHash } from '../../routing';

const INITIAL_ROUTE = parseHash(window.location.hash);

export function route(state = INITIAL_ROUTE, action) {
  switch (action.type) {
    case 'changeRoute':
      return {
        ...state,
        path: action.path,
        params: action.params,
      }
    default:
      return state;
  }
}