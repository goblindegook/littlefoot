/**
 * Fetches an element's computed styles object.
 *
 * @param  {DOMElement} element  Element to get computed styles from.
 * @param  {String}     property Property name.
 * @return {String}              Computed style property.
 */
export default function getStyle(element, property) {
  element.document; // IE sometimes struggles to read element.currentStyle until element.document is accessed.

  const style = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle

  return style ? style[property] : ''
}
