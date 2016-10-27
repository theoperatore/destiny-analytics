export function changeRoute(path, params) {
  return {
    type: 'changeRoute',
    path,
    params,
  }
}