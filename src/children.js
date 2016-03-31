import matches from 'dom-matches'

/**
 * Fetch children elements.
 *
 * @param  {DOMElement} element  [description]
 * @param  {String}     selector Sibling selector.
 * @return {Array}               Sibling elements.
 */
export default function children(element, selector = null) {
  return Array.prototype.filter.call(
    element.children,
    (child) => child.nodeType !== 8 && (!selector || matches(child, selector))
  )
}
