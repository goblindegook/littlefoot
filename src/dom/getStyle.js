/**
 * Fetches an element's computed styles object.
 *
 * @param  {DOMElement} element  Element to get computed styles from.
 * @param  {String}     property Property name.
 * @return {String}              Computed style property.
 */
export default function getStyle(element, property) {
  // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.
  element.document;

  const style = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle

  return style ? style[property] : null
}
