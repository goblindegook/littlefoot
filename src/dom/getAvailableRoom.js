import getStyle from './getStyle'

/**
 * Calculate the room available around a button element.
 *
 * @param  {DOMElement} element Button element.
 * @return {Object}             Available room.
 */
export default function getAvailableRoom(element) {
  const leftMargin = parseFloat(getStyle(element, 'marginLeft'))
  const width      = parseFloat(element.offsetWidth) - leftMargin
  const height     = parseFloat(element.offsetHeight)
  const rect       = element.getBoundingClientRect()
  const topRoom    = rect.top + height / 2
  const leftRoom   = rect.left + width / 2

  return {
    topRoom,
    leftRoom,
    bottomRoom:   window.innerHeight - topRoom,
    rightRoom:    window.innerWidth - leftRoom,
    topRelative:  topRoom / window.innerHeight,
    leftRelative: leftRoom / window.innerWidth,
  }
}
