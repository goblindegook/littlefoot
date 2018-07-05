import siblings from 'dom-siblings'
import classList from 'dom-classlist'
import { getAvailableRoom } from './dom/getAvailableRoom'
import { getStyle } from './dom/getStyle'

/**
 * Positions the tooltip at the same relative horizontal position as the button.
 *
 * @param  {DOMElement} popover      Popover element.
 * @param  {Number}     leftRelative Relative positioning to the left.
 * @return {void}
 */
function positionTooltip (popover, leftRelative = 0.5) {
  const tooltip = popover.querySelector('.littlefoot-footnote__tooltip')

  if (tooltip) {
    tooltip.style.left = (leftRelative * 100) + '%'
  }
}

/**
 * Checks whether there is enough available room to position the footnote
 * on top of the button.
 *
 * @param  {DOMElement}  footnote Footnote element.
 * @param  {Object}      room     Available room object.
 * @return {Boolean}              Is footnote allowed on top.
 */
function isFootnoteOnTop (footnote, room) {
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const totalHeight = 2 * marginSize + footnote.offsetHeight

  return room.bottom < totalHeight && room.bottom < room.top
}

/**
 * Set footnote state attributes.
 *
 * @param  {DOMElement} footnote Footnote DOM element.
 * @param  {String}     state    State to set, one of 'top' or 'bottom'.
 * @return {void}
 */
function setFootnoteState (footnote, state) {
  const alternative = state === 'top' ? 'bottom' : 'top'
  footnote.setAttribute('data-footnote-state', state)
  classList(footnote).add('is-positioned-' + state)
  classList(footnote).remove('is-positioned-' + alternative)
}

/**
 * Update footnote state according to available room.
 *
 * @param  {DOMElement} footnote Footnote element.
 * @param  {Object}     room     Available room object.
 * @return {void}
 */
function updateFootnoteState (footnote, room) {
  const isTop = isFootnoteOnTop(footnote, room)
  const state = footnote.getAttribute('data-footnote-state')
  const newState = isTop ? 'top' : 'bottom'

  if (state !== newState) {
    setFootnoteState(footnote, newState)
    footnote.style.transformOrigin = `${room.leftRelative * 100}% ${isTop ? '100%' : '0'}`
  }
}

/**
 * Get a footnote's maximum height in the available space above or below its button.
 *
 * @param  {DOMElement} footnote Footnote element.
 * @param  {Object}     room     Available room object.
 * @return {Number}              Maximum footnote height.
 */
function getFootnoteMaxHeight (footnote, room) {
  const maxHeight = parseInt(footnote.getAttribute('data-footnote-max-height'), 10)
  const isTop = isFootnoteOnTop(footnote, room)
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const availableHeight = room[isTop ? 'top' : 'bottom'] - marginSize - 15

  return Math.min(maxHeight, availableHeight)
}

/**
 * Positions each footnote relative to its button.
 *
 * @param  {DOMElement} footnote  The footnote element.
 * @param  {String}     eventType The type of event that prompted repositioning,
 *                                defaults to 'resize'.
 * @return {void}
 */
export function repositionFootnote (footnote, eventType = 'resize') {
  const button = siblings(footnote, '.littlefoot-footnote__button')[0]
  const room = getAvailableRoom(button)
  const content = footnote.querySelector('.littlefoot-footnote__content')
  const maxHeight = getFootnoteMaxHeight(footnote, room)

  updateFootnoteState(footnote, room)

  content.style.maxHeight = maxHeight + 'px'

  if (eventType === 'resize') {
    const wrapper = footnote.querySelector('.littlefoot-footnote__wrapper')
    const maxWidth = content.offsetWidth
    const buttonMarginLeft = parseInt(getStyle(button, 'marginLeft'), 10)
    const left = -room.leftRelative * maxWidth + buttonMarginLeft + button.offsetWidth / 2

    footnote.style.left = left + 'px'
    wrapper.style.maxWidth = maxWidth + 'px'

    positionTooltip(footnote, room.leftRelative)
  }

  if (parseFloat(footnote.offsetHeight) <= content.scrollHeight) {
    classList(footnote).add('is-scrollable')
  }
}
