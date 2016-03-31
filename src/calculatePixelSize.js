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
export default function calculatePixelSize(element, property, fontSize = null) {
  // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.
  element.document;

  const style = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle
  const value = style[property] != null ? style[property] : 'none'
  const size  = parseFloat(value)
  const unit  = value.replace(/[\d\.]+(%|cm|em|in|mm|pc|pt|px|rem|)/, '$1') || ''

  if (value === 'none') {
    return 10000
  }

  fontSize = !fontSize ? fontSize : /%|em/.test(unit) && element.parentElement ? calculatePixelSize(element.parentElement, 'font-size') : 16

  switch (unit) {
    case '%':
      const rootSize = property === 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight
      return size / 100 * rootSize

    case 'rem':
      return size * baseFontSize()

    case 'em':
      return size * fontSize

    case 'cm':
      return size * 0.3937 * 96

    case 'in':
      return size * 96

    case 'mm':
      return size * 0.3937 * 96 / 10

    case 'pc':
      return size * 12 * 96 / 72

    case 'pt':
      return size * 96 / 72

    default:
      return size
  }
}
