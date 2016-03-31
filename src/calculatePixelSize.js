import getStyle from './getStyle'

/**
 * Calculates the base font size for `rem`-based sizing.
 *
 * @return {Number} The base font size in pixels.
 */
function baseFontSize() {
  const element = document.createElement('div')

  element.style.cssText = 'display:inline-block;padding:0;line-height:1;position:absolute;visibility:hidden;font-size:1em;'
  element.appendChild(document.createElement('M'))
  document.body.appendChild(element)

  const size = element.offsetHeight

  document.body.removeChild(element)

  return size
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
export default function calculatePixelSize(element, property) {
  const style = getStyle(element)
  const value = style[property] != null ? style[property] : 'none'

  if (value === 'none') {
    return 10000
  }

  const size     = parseFloat(value)
  const unit     = value.replace(/[\d\.]+(%|cm|em|in|mm|pc|pt|px|rem|)/, '$1') || ''
  const fontSize = /%|em|rem/.test(unit) && element.parentElement ? calculatePixelSize(element.parentElement, 'font-size') : 16

  switch (unit) {
    case '%':
      const widthOrHeight = /width/i.test(property) ? element.clientWidth : element.clientHeight
      const rootSize      = property === 'font-size' ? fontSize : widthOrHeight
      return Math.round(size / 100 * rootSize)

    case 'rem':
      return Math.round(size * baseFontSize())

    case 'em':
      return Math.round(size * fontSize)

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
