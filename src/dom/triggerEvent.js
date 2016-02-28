/**
 * Trigger event.
 *
 * @param  {DOMElement} element [description]
 * @param  {String}     type    [description]
 */
export default function triggerEvent(element, type) {
  if (document.createEvent) {
    var event = document.createEvent('HTMLEvents')
    event.initEvent(type, true, false)
    element.dispatchEvent(event)
  } else {
    element.fireEvent('on' + type)
  }
}
