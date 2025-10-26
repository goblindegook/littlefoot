// biome-ignore lint/suspicious/noExplicitAny: throttle is generic over argument types.
type Procedure = (...args: any[]) => void

export function throttle<T extends Procedure>(fn: T, delay = 0): T {
  let timer: number | undefined
  let lastCall = 0

  return function throttled(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    const now = Date.now()
    const remaining = Math.max(0, lastCall + delay - now)

    if (remaining === 0) {
      lastCall = now
      fn.apply(this, args)
      return
    }

    if (timer !== undefined) {
      window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      lastCall = Date.now()
      timer = undefined
      fn.apply(this, args)
    }, remaining)
  } as T
}
