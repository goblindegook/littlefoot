export function maybeCall (context, fn, ...args) {
  return typeof fn === 'function' && fn.call(context, ...args)
}
