/**
 * Add class to an element.
 *
 * @param {DOMElement} element   Element.
 * @param {String}     className Class name.
 */
export default function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className)
  } else {
    element.className += ' ' + className
  }
}
