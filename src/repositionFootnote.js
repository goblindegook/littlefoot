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
 * Positions each footnote relative to its button.
 *
 * @param {DOMElement} footnote The footnote element.
 * @param {Event}      event    The type of event that prompted the reposition function.
 */
export default function repositionFootnote(footnote, event) {
  const type           = event ? event.type : 'resize'
  const button         = siblings(footnote, '.littlefoot-footnote__button')[0]
  const roomLeft       = getAvailableRoom(button)
  const footnoteStyle  = getStyle(footnote)
  const marginSize     = parseFloat(footnoteStyle.marginTop)
  const totalHeight    = 2 * marginSize + footnote.offsetHeight
  const isAbove        = roomLeft.bottomRoom < totalHeight && roomLeft.topRoom > roomLeft.bottomRoom
  const maxHeight      = roomLeft[isAbove ? 'topRoom' : 'bottomRoom'] - marginSize - 15
  const styleMaxHeight = parseInt(footnote.getAttribute('data-littlefoot-max-height'), 10)
  const state          = footnote.getAttribute('data-littlefoot-state')

  if (isAbove && state !== 'top') {
    footnote.setAttribute('data-littlefoot-state', 'top')
    classList(footnote).add('is-positioned-top')
    classList(footnote).remove('is-positioned-bottom')
    footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 100%'
  }

  if (!isAbove && (state !== 'bottom' || state === 'init')) {
    footnote.setAttribute('data-littlefoot-state', 'bottom')
    classList(footnote).add('is-positioned-bottom')
    classList(footnote).remove('is-positioned-top')
    footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 0'
  }

  footnote.querySelector('.littlefoot-footnote__content').style.maxHeight = Math.min(maxHeight, styleMaxHeight) + 'px'

  if (type === 'resize') {
    const buttonStyle   = getStyle(button)
    const styleMaxWidth = parseFloat(footnote.getAttribute('data-littlefoot-max-width'))
    const wrapper       = footnote.querySelector('.littlefoot-footnote__wrapper')
    const content       = footnote.querySelector('.littlefoot-footnote__content')

    let maxWidth = styleMaxWidth

    if (styleMaxWidth <= 1) {
      maxWidth = Math.min(window.innerWidth, 10000) * styleMaxWidth
    }

    maxWidth = Math.min(maxWidth, content.offsetWidth + 1)

    const left = -roomLeft.leftRelative * maxWidth + parseFloat(buttonStyle.marginLeft) + button.offsetWidth / 2

    footnote.style.left    = left + 'px'
    wrapper.style.maxWidth = maxWidth + 'px'

    positionTooltip(footnote, roomLeft.leftRelative)
  }

  if (parseInt(footnote.offsetHeight) < footnote.querySelector('.littlefoot-footnote__content').scrollHeight) {
    classList(footnote).add('is-scrollable')
  }
}
