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
 * Positions each footnote relative to its button.
 *
 * @param {DOMElement} footnote The footnote element.
 * @param {Event}      event    The type of event that prompted the reposition function.
 */
export default function repositionFootnote(footnote, event) {
  const type           = event ? event.type : 'resize'
  const button         = siblings(footnote, '.littlefoot-footnote__button')[0]
  const roomLeft       = getAvailableRoom(button)
  const marginSize     = parseFloat(getStyle(footnote, 'margin-top'))
  const totalHeight    = 2 * marginSize + footnote.offsetHeight
  const isTop          = roomLeft.bottomRoom < totalHeight && roomLeft.topRoom > roomLeft.bottomRoom
  const maxHeight      = roomLeft[isTop ? 'topRoom' : 'bottomRoom'] - marginSize - 15
  const styleMaxHeight = parseInt(footnote.getAttribute('data-littlefoot-max-height'), 10)
  const state          = footnote.getAttribute('data-littlefoot-state')

  if (isTop && state !== 'top') {
    setFootnoteState(footnote, 'top')
    footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 100%'
  }

  if (!isTop && state !== 'bottom') {
    setFootnoteState(footnote, 'bottom')
    footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 0'
  }

  footnote.querySelector('.littlefoot-footnote__content').style.maxHeight = Math.min(maxHeight, styleMaxHeight) + 'px'

  if (type === 'resize') {
    const styleMaxWidth = parseFloat(footnote.getAttribute('data-littlefoot-max-width'))
    const wrapper       = footnote.querySelector('.littlefoot-footnote__wrapper')
    const content       = footnote.querySelector('.littlefoot-footnote__content')
    const maxWidth      = Math.min(styleMaxWidth, content.offsetWidth + 1)
    const left          = -roomLeft.leftRelative * maxWidth + parseFloat(getStyle(button, 'marginLeft')) + button.offsetWidth / 2

    footnote.style.left    = left + 'px'
    wrapper.style.maxWidth = maxWidth + 'px'

    positionTooltip(footnote, roomLeft.leftRelative)
  }

  if (parseInt(footnote.offsetHeight) < footnote.querySelector('.littlefoot-footnote__content').scrollHeight) {
    classList(footnote).add('is-scrollable')
  }
}
