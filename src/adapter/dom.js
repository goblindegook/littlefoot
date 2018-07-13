import matches from 'dom-matches'

/**
 * Removes/adds appropriate classes to the footnote content and button after
 * a delay (to allow for transitions) it removes the actual footnote content.
 *
 * @param  {DOMElement} element Element to bind event to.
 * @param  {String}     type    Event type.
 * @param  {Function}   fn      Event handler.
 * @param  {boolean}    capture Capture flag.
 * @return {void}
 */
export function bind (element, type, fn, capture = false) {
  const method = window.addEventListener ? 'addEventListener' : 'attachEvent'
  const prefix = method !== 'addEventListener' ? 'on' : ''
  element[method](prefix + type, fn, capture)
}

/**
 * Fetch children elements.
 *
 * @param  {DOMElement} element  Element to query.
 * @param  {String}     selector Child selector.
 * @return {Array}               Child elements.
 */
export function children (element, selector = null) {
  return [...element.children].filter(
    child => child.nodeType !== 8 && (!selector || matches(child, selector))
  )
}

/**
 * Fetches an element's computed styles object.
 *
 * @param  {DOMElement} element  Element to get computed styles from.
 * @param  {String}     property Property name.
 * @return {String}              Computed style property.
 */
export function getStyle (element, property) {
  const view = element.ownerDocument.defaultView || window
  const style = view.getComputedStyle ? view.getComputedStyle(element) : element.currentStyle

  return style.getPropertyValue(property) || style[property] || ''
}

/**
 * Get the computed maximum pixel height (as a regular integer) for an element.
 *
 * @param  {DOMElement} element  Element that is being measured.
 * @return {Number}              Maximum element height in pixels.
 */
export function getMaxHeight (element) {
  const value = getStyle(element, 'maxHeight')
  const size = parseFloat(value)

  if (value == null || value === 'none') {
    return element.clientHeight
  }

  if (/%/.test(value)) {
    return Math.round(size / 100 * document.body.clientHeight)
  }

  return Math.round(size)
}

/**
 * Calculate the room available around a button element.
 *
 * @param  {DOMElement} element Button element.
 * @return {Object}             Available room.
 */
export function getAvailableRoom (element) {
  const marginLeft = parseFloat(getStyle(element, 'marginLeft'))
  const width = parseFloat(element.offsetWidth) - marginLeft
  const height = parseFloat(element.offsetHeight)
  const rect = element.getBoundingClientRect()
  const left = rect.left + width / 2
  const top = rect.top + height / 2

  return {
    top,
    bottom: window.innerHeight - top,
    leftRelative: left / window.innerWidth
  }
}
