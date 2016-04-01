import getStyle from './getStyle'

/**
 * Calculates the base font size for `rem`-based sizing.
 *
 * @return {Number} The base font size in pixels.
 */
function getBaseFontSize() {
  const element = document.createElement('div')

  element.style.cssText = 'display:inline-block;padding:0;line-height:1;position:absolute;visibility:hidden;font-size:1em;'
  element.appendChild(document.createElement('M'))
  document.body.appendChild(element)

  const size = element.offsetHeight

  document.body.removeChild(element)

  return size
}

/**
 * Get font size for element.
 * @param  {DOMElement} element Element.
 * @param  {String}     unit    Element property size unit.
 * @return {Number}             Font size in pixels.
 */
function getFontSize(element, unit) {
  return /%|em|rem/.test(unit) && element.parentElement
    ? getStylePropertyInPixels(element.parentElement, 'font-size') : 16
}

/**
 * Calculates a pixel size (as a regular integer) based on a string with an unknown unit.
 *
 * Adapted from Jonathan Neal's getComputedStylePixel() polyfill.
 *
 * @param  {DOMElement} element  Element that is being measured.
 * @param  {String}     property CSS property to be evaluated.
 * @return {Number}              The string representation of the actual size.
 */
export default function getStylePropertyInPixels(element, property) {
  const style = getStyle(element)
  const value = style[property] != null ? style[property] : 'none'
  const size  = parseFloat(value)
  const unit  = value.replace(/[\d\.]+(%|cm|em|in|mm|pc|pt|px|rem|)/, '$1') || ''

  if (value === 'none') {
    return 10000
  }

  switch (unit) {
    case '%':
      const widthOrHeight = /width/i.test(property) ? element.clientWidth : element.clientHeight
      const rootSize      = property === 'font-size' ? getFontSize(element, unit) : widthOrHeight
      return Math.round(size / 100 * rootSize)

    case 'rem':
      return Math.round(size * getBaseFontSize())

    case 'em':
      return Math.round(size * getFontSize(element, unit))

    case 'cm':
      return Math.round(size * 0.3937 * 96)

    case 'in':
      return Math.round(size * 96)

    case 'mm':
      return Math.round(size * 0.3937 * 96 / 10)

    case 'pc':
      return Math.round(size * 12 * 96 / 72)

    case 'pt':
      return Math.round(size * 96 / 72)

    default:
      return Math.round(size)
  }
}
