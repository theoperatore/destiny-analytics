export function changeRoute(path, param) {
  return {
    type: 'changeRoute',
    path,
    param,
  }
}