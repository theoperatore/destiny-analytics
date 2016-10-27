const INITIAL_ROUTE = {
  path: null,
  param: null,
};

export function route(state = INITIAL_ROUTE, action) {
  switch (action.type) {
    case 'changeRoute':
      return {
        ...state,
        path: action.path,
        param: action.param,
      }
    default:
      return state;
  }
}