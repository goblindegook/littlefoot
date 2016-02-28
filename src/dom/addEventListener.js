/**
 * Add event listener.
 *
 * @param {DOMElement} element    Element to bind event to.
 * @param {String}     type       Event type.
 * @param {Function}   listener   Event listener.
 * @param {Boolean}    useCapture Use event capture (false by default).
 */
export default function addEventListener(element, type, listener, useCapture = false) {
  if (element.addEventListener) {
    element.addEventListener(type, listener, useCapture)
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, () => listener.call(element))
  }
}
