/**
 * Create keyboard event.
 *
 * @param  {String} type    Event type.
 * @param  {Number} keyCode Event key code.
 * @return {Event}          Keyboard event.
 *
 * FIXME: This fails on Firefox.
 */
export function createKeyboardEvent(type, keyCode) {
  const keyboardEvent = document.createEvent('Event')
  keyboardEvent.keyCode = keyCode
  keyboardEvent.initEvent(type)
  return keyboardEvent
}

/**
 * Create wheel event.
 *
 * @param  {String} type Event type.
 * @param  {Number} deltaX Horizontal scroll amount.
 * @param  {Number} deltaY Vertical scroll amount.
 * @param  {Number} deltaZ Z-axis scroll amount.
 * @return {Event}         Wheel event.
 *
 * FIXME: This fails on Firefox.
 */
export function createWheelEvent(type, deltaX = 0.0, deltaY = 0.0, deltaZ = 0.0) {
  const mouseEvent = document.createEvent('Event')
  mouseEvent.deltaX = deltaX
  mouseEvent.deltaY = deltaY
  mouseEvent.deltaZ = deltaZ
  mouseEvent.initEvent(type)
  return mouseEvent
}
