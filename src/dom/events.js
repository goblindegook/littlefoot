export function bind (el, type, fn, capture = false) {
  const method = window.addEventListener ? 'addEventListener' : 'attachEvent'
  const prefix = method !== 'addEventListener' ? 'on' : ''
  el[method](prefix + type, fn, capture)
  return fn
}
