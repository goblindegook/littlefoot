/**
 * Returns an event handler that executes a function on pressing
 * Escape.
 *
 * @param  {Function} fn Function to call.
 * @return {Function}    Event handler.
 */
export function onEscapeKeypress (fn) {
  return event => event.keyCode === 27 && fn()
}
