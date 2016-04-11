/**
 * Fetches an element's computed styles object.
 *
 * @param  {DOMElement} element  Element to get computed styles from.
 * @param  {String}     property Property name.
 * @return {String}              Computed style property.
 */
export default function getStyle(element, property) {
  const view  = element.ownerDocument.defaultView || window
  const style = view.getComputedStyle ? view.getComputedStyle(element) : element.currentStyle

  return style.getPropertyValue(property) || style[property] || ''
}
