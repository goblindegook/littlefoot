import siblings from 'dom-siblings'
import addClass from './dom/addClass'
import removeClass from './dom/removeClass'
import calculateAvailableRoom from './calculateAvailableRoom'
import positionTooltip from './positionTooltip'

/**
 * Positions each footnote relative to its button.
 *
 * @param {DOMElement} footnote The footnote element.
 * @param {Event}      event    The type of event that prompted the reposition function.
 */
export default function repositionPopover(footnote, event) {
  const type            = event ? event.type : 'resize'
  const identifier      = footnote.getAttribute('data-footnote-id')
  const button          = siblings(footnote, '.littlefoot-footnote__button')[0]
  const buttonStyle     = button.currentStyle || window.getComputedStyle(button)
  const footnoteStyle   = footnote.currentStyle || window.getComputedStyle(footnote)
  const roomLeft        = calculateAvailableRoom(button)
  const marginSize      = parseFloat(footnoteStyle.marginTop)
  const maxHeightInCSS  = parseFloat(footnote.getAttribute('data-littlefoot-max-height'))
  const totalHeight     = 2 * marginSize + footnote.offsetHeight
  const positionOnTop   = roomLeft.bottomRoom < totalHeight && roomLeft.topRoom > roomLeft.bottomRoom
  const state           = footnote.getAttribute('data-littlefoot-state')

  let maxHeightOnScreen = 10000

  if (positionOnTop) {
    if (state !== 'top') {
      footnote.setAttribute('data-littlefoot-state', 'top')
      addClass(footnote, 'is-positioned-top')
      removeClass(footnote, 'is-positioned-bottom')
      footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 100%'
    }

    maxHeightOnScreen = roomLeft.topRoom - marginSize - 15

  } else {
    if (state !== 'bottom' || state === 'init') {
      footnote.setAttribute('data-littlefoot-state', 'bottom')
      addClass(footnote, 'is-positioned-bottom')
      removeClass(footnote, 'is-positioned-top')
      footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 0'
    }

    maxHeightOnScreen = roomLeft.bottomRoom - marginSize - 15
  }

  footnote.querySelector('.littlefoot-footnote__content').style.maxHeight = Math.min(maxHeightOnScreen, maxHeightInCSS) + 'px'

  if (type === 'resize') {
    const maxWidthInCSS   = parseFloat(footnote.getAttribute('data-littlefoot-max-width'))
    const footnoteWrapper = footnote.querySelector('.littlefoot-footnote__wrapper')
    const footnoteContent = footnote.querySelector('.littlefoot-footnote__content')
    let maxWidth          = maxWidthInCSS

    if (maxWidthInCSS <= 1) {
      maxWidth = Math.min(window.innerWidth, 10000) * maxWidthInCSS
    }

    maxWidth = Math.min(maxWidth, footnoteContent.offsetWidth + 1)

    const left = -roomLeft.leftRelative * maxWidth + parseFloat(buttonStyle.marginLeft) + button.offsetWidth / 2

    footnoteWrapper.style.maxWidth = maxWidth + 'px'
    footnote.style.left            = left + 'px'

    positionTooltip(footnote, roomLeft.leftRelative)
  }

  if (parseInt(footnote.offsetHeight) < footnote.querySelector('.littlefoot-footnote__content').scrollHeight) {
    addClass(footnote, 'is-scrollable')
  }
}
