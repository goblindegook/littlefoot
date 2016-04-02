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
 * Calculates a pixel size (as a regular integer) based on a string with an unknown unit.
 *
 * Adapted from Jonathan Neal's getComputedStylePixel() polyfill.
 *
 * @param  {DOMElement} element  Element that is being measured.
 * @param  {String}     property CSS property to be evaluated.
 * @return {Number}              The string representation of the actual size.
 */
export default function getStylePropertyInPixels(element, property) {
  const value = getStyle(element, property)
  const size  = parseFloat(value)
  const unit  = value.replace(/[\d\.]+(%|cm|em|in|mm|pc|pt|px|rem|)/, '$1') || ''

  if (value == null || value === 'none') {
    return 10000
  }

  const fontSize = element.parentElement && /%|em/.test(unit)
    ? getStylePropertyInPixels(element.parentElement, 'fontSize') : 16

  const baseFontSize = unit === 'rem' ? getBaseFontSize() : 16

  const sizes = {
    fontSize,
    height:    element.clientHeight,
    maxHeight: document.body.clientHeight,
    maxWidth:  document.body.clientWidth,
    minHeight: document.body.clientHeight,
    minWidth:  document.body.clientWidth,
    width:     element.clientWidth,
  }

  const pixelSizes = {
    '%': size / 100 * (sizes[property] || 1),
    cm:  size * 0.3937 * 96,
    em:  size * fontSize,
    in:  size * 96,
    mm:  size * 0.3937 * 96 / 10,
    pc:  size * 12 * 96 / 72,
    pt:  size * 96 / 72,
    px:  size,
    rem: size * baseFontSize,
  }

  return Math.round(pixelSizes.hasOwnProperty(unit) ? pixelSizes[unit] : size)
}
