/**
 * Calculates the base font size for `em`- and `rem`-based sizing.
 *
 * @return {Number} The base font size in pixels.
 */
export function baseFontSize() {
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
 * @param  {DOMElement} element      Element that is being measured.
 * @param  {String}     propertyName CSS property to be evaluated.
 * @return {Number}                  The string representation of the actual size.
 */
export default function calculatePixelSize(element, propertyName) {
  const style    = element.currentStyle || window.getComputedStyle(element)
  const property = style[propertyName]
  const size     = parseFloat(property)

  if (property === 'none') {
    return 10000
  }

  if (property.indexOf('rem') >= 0) {
    return size * baseFontSize()
  }

  if (property.indexOf('em') >= 0) {
    return size * parseFloat(style['font-size'])
  }

  if (property.indexOf('px') >= 0) {
    const parentStyle = element.parentNode.currentStyle || window.getComputedStyle(element.parentNode)
    return size <= 60 ? size / parseFloat(parentStyle.width) : size
  }

  if (property.indexOf('%') >= 0) {
    return size / 100
  }

  return property
}
