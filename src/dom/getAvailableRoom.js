import getStyle from './getStyle'

/**
 * Calculate the room available around a button element.
 *
 * @param  {DOMElement} element Button element.
 * @return {Object}             Available room.
 */
function getAvailableRoom (element) {
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

export default getAvailableRoom
