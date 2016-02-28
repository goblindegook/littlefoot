/**
 * Check if the provided DOM element has a class.
 *
 * @param  {DOMElement}  element   DOM element.
 * @param  {String}      className Class name.
 * @return {Boolean}               Whether the DOM element has this class.
 */
export default function hasClass(element, className) {
  if (element.classList) {
    return element.classList.contains(className)
  }

  const pattern = new RegExp('(^| )' + className + '( |$)', 'gi')
  
  return pattern.test(element.className)
}
