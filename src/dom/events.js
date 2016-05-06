/**
 * Add an event listener.
 *
 * @param  {DOMElement} element    Element to bind event to.
 * @param  {String}     type       Event type.
 * @param  {Function}   listener   Event listener.
 * @param  {Boolean}    useCapture Use event capture (false by default).
 * @return {void}
 */
export function addEventListener(element, type, listener, useCapture = false) {
  if (element.addEventListener) {
    element.addEventListener(type, listener, useCapture);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, () => listener.call(element));
  }
}

/**
 * Trigger an event.
 *
 * @param  {DOMElement} element Element the event is bound to.
 * @param  {String}     type    Event type.
 * @return {void}
 */
export function dispatchEvent(element, type) {
  if (document.createEvent) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent(type, true, false);
    element.dispatchEvent(event);
  } else {
    element.fireEvent('on' + type);
  }
}

export default {
  addEventListener,
  dispatchEvent,
};
