import matches from 'dom-matches'

/**
 * Recursively find the next sibling element, bypassing text nodes.
 * @param  {DOMElement} element DOM element.
 * @return {DOMElement}         Next sibling DOM element.
 */
function nextNonTextSibling(element) {
  if (!element || element.nodeType === 1) {
    return element
  }

  return nextNonTextSibling(element.nextSibling)
}

/**
 * Get the next sibling element, bypassing text nodes.
 * @param  {DOMElement} element  DOM element.
 * @param  {String}     selector Selector to match.
 * @return {DOMElement}          Next sibling DOM element.
 */
export default function nextElementSibling(element, selector = null) {
  const nextSibling = element.nextElementSibling || nextNonTextSibling(element)

  if (!selector || matches(nextSibling, selector)) {
    return nextSibling
  }

  return nextElementSibling(nextSibling, selector)
}
