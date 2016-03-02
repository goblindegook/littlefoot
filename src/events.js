/**
 * Add an event listener.
 *
 * @param {DOMElement} element    Element to bind event to.
 * @param {String}     type       Event type.
 * @param {Function}   listener   Event listener.
 * @param {Boolean}    useCapture Use event capture (false by default).
 */
export function addEventListener(element, type, listener, useCapture = false) {
  if (element.addEventListener) {
    element.addEventListener(type, listener, useCapture)
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, () => listener.call(element))
  }
}

/**
 * Remove an event listener.
 *
 * @param {DOMElement} element    Element to bind event to.
 * @param {String}     type       Event type.
 * @param {Function}   listener   Event handler.
 * @param {Boolean}    useCapture Use event capture (false by default).
 */
export function removeEventListener(element, type, listener, useCapture = false) {
  if (element.removeEventListener) {
    element.removeEventListener(type, listener, useCapture)
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, listener)
  }
}

/**
 * Trigger an event.
 *
 * @param  {DOMElement} element [description]
 * @param  {String}     type    [description]
 */
export function dispatchEvent(element, type) {
  if (document.createEvent) {
    var event = document.createEvent('HTMLEvents')
    event.initEvent(type, true, false)
    element.dispatchEvent(event)
  } else {
    element.fireEvent('on' + type)
  }
}

/**
 * Default export.
 */
export default {
  addEventListener,
  removeEventListener,
  dispatchEvent,
}
