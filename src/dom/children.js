import matches from 'dom-matches'

/**
 * Fetch children elements.
 *
 * @param  {DOMElement} element  Element to query.
 * @param  {String}     selector Child selector.
 * @return {Array}               Child elements.
 */
function children (element, selector = null) {
  return [...element.children].filter(
    (child) => child.nodeType !== 8 && (!selector || matches(child, selector))
  )
}

export default children
