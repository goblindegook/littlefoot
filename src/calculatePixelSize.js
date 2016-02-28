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
