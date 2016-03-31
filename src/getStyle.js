/**
 * Fetches an element's computed styles object.
 *
 * @param  {DOMElement} element  Element to get computed styles from.
 * @return {Object}              Computed styles object.
 */
export default function getStyle(element) {
  // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.
  element.document;

  return window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle
}
