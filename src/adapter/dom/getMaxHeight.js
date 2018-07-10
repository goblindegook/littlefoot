import { getStyle } from './getStyle'

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
