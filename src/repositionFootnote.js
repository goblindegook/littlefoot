import siblings from 'dom-siblings'
import classList from 'dom-classlist'
import getAvailableRoom from './dom/getAvailableRoom'
import getStyle from './dom/getStyle'

/**
 * Positions the tooltip at the same relative horizontal position as the button.
 *
 * @param  {DOMElement} popover      Popover element.
 * @param  {Number}     leftRelative Relative positioning to the left.
 */
function positionTooltip(popover, leftRelative) {
  const tooltip = popover.querySelector('.littlefoot-footnote__tooltip')

  if (tooltip) {
    const tooltipLeft = leftRelative != null ? leftRelative : 0.5
    tooltip.style.left = (tooltipLeft * 100) + '%'
  }
}

/**
 * Set footnote state attributes.
 * @param {DOMElement} footnote Footnote DOM element.
 * @param {String}     state    State to set, one of 'top' or 'bottom'.
 */
function setFootnoteState(footnote, state) {
  const previous = state === 'top' ? 'bottom' : 'top'
  footnote.setAttribute('data-littlefoot-state', state)
  classList(footnote).add('is-positioned-' + state)
  classList(footnote).remove('is-positioned-' + previous)
}

/**
 * Checks whether there is enough available room to position the footnote
 * on top of the button.
 *
 * @param  {DOMElement}  footnote Footnote element.
 * @param  {Object}      room     Available room object.
 * @return {Boolean}              Is footnote allowed on top.
 */
function isFootnoteOnTop(footnote, room) {
  const marginSize  = parseInt(getStyle(footnote, 'marginTop'), 10)
  const totalHeight = 2 * marginSize + footnote.offsetHeight

  return room.bottom < totalHeight && room.bottom < room.top
}

/**
 * Get a footnote's maximum height in the available space above or below its button.
 *
 * @param  {DOMElement} footnote Footnote element.
 * @param  {Object}     room     Available room object.
 * @return {Number}              Maximum footnote height.
 */
function getFootnoteMaxHeight(footnote, room) {
  const maxHeight       = parseInt(footnote.getAttribute('data-littlefoot-max-height'), 10)
  const isTop           = isFootnoteOnTop(footnote, room)
  const marginSize      = parseInt(getStyle(footnote, 'marginTop'), 10)
  const availableHeight = room[isTop ? 'top' : 'bottom'] - marginSize - 15

  return Math.min(maxHeight, availableHeight)
}

/**
 * Get a footnote's maximum width in the allowed space.
 *
 * @param  {DOMElement} footnote Footnote element.
 * @param  {DOMElement} content  Content element.
 * @return {Number}              Maximum footnote width.
 */
function getFootnoteMaxWidth(footnote, content) {
  const maxWidth = parseInt(footnote.getAttribute('data-littlefoot-max-width'), 10)

  return Math.min(maxWidth, content.offsetWidth + 1)
}

/**
 * Positions each footnote relative to its button.
 *
 * @param   {DOMElement} footnote The footnote element.
 * @param   {Event}      event    The type of event that prompted the reposition function.
 * @returns {null}
 */
export default function repositionFootnote(footnote, event) {
  const type      = event ? event.type : 'resize'
  const button    = siblings(footnote, '.littlefoot-footnote__button')[0]
  const room      = getAvailableRoom(button)
  const maxHeight = getFootnoteMaxHeight(footnote, room)
  const isTop     = isFootnoteOnTop(footnote, room)
  const state     = footnote.getAttribute('data-littlefoot-state')
  const content   = footnote.querySelector('.littlefoot-footnote__content')

  if (isTop && state !== 'top') {
    setFootnoteState(footnote, 'top')
    footnote.style.transformOrigin = `${room.leftRelative * 100}% 100%`
  }

  if (!isTop && state !== 'bottom') {
    setFootnoteState(footnote, 'bottom')
    footnote.style.transformOrigin = `${room.leftRelative * 100}% 0`
  }

  content.style.maxHeight = maxHeight + 'px'

  if (type === 'resize') {
    const wrapper  = footnote.querySelector('.littlefoot-footnote__wrapper')
    const maxWidth = getFootnoteMaxWidth(footnote, content)
    const left     = -room.leftRelative * maxWidth + parseInt(getStyle(button, 'marginLeft'), 10) + button.offsetWidth / 2

    footnote.style.left    = left + 'px'
    wrapper.style.maxWidth = maxWidth + 'px'

    positionTooltip(footnote, room.leftRelative)
  }

  if (parseInt(footnote.offsetHeight, 10) < content.scrollHeight) {
    classList(footnote).add('is-scrollable')
  }
}
