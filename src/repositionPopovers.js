import siblings from 'dom-siblings'
import classList from 'dom-classlist'
import { getAvailableRoom } from './dom/getAvailableRoom'
import { getStyle } from './dom/getStyle'
import {
  CLASS_SCROLLABLE,
  CLASS_BUTTON,
  CLASS_CONTENT,
  CLASS_TOOLTIP,
  CLASS_WRAPPER,
  FOOTNOTE_MAX_HEIGHT,
  FOOTNOTE_STATE
} from './constants'

const CLASS_POSITION_PREFIX = 'is-positioned-'
const BOTTOM = 'bottom'
const TOP = 'top'

function positionTooltip (popover, leftRelative = 0.5) {
  const tooltip = popover.querySelector(`.${CLASS_TOOLTIP}`)

  if (tooltip) {
    tooltip.style.left = (leftRelative * 100) + '%'
  }
}

function isFootnoteOnTop (footnote, room) {
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const totalHeight = 2 * marginSize + footnote.offsetHeight

  return room.bottom < totalHeight && room.bottom < room.top
}

function setFootnoteState (footnote, state) {
  const alternative = state === TOP ? BOTTOM : TOP
  footnote.setAttribute(FOOTNOTE_STATE, state)
  classList(footnote).add(CLASS_POSITION_PREFIX + state)
  classList(footnote).remove(CLASS_POSITION_PREFIX + alternative)
}

function updateFootnoteState (footnote, room) {
  const isTop = isFootnoteOnTop(footnote, room)
  const state = footnote.getAttribute(FOOTNOTE_STATE)
  const newState = isTop ? TOP : BOTTOM

  if (state !== newState) {
    setFootnoteState(footnote, newState)
    footnote.style.transformOrigin = `${room.leftRelative * 100}% ${isTop ? '100%' : '0'}`
  }
}

function getFootnoteMaxHeight (footnote, room) {
  const maxHeight = parseInt(footnote.getAttribute(FOOTNOTE_MAX_HEIGHT), 10)
  const isTop = isFootnoteOnTop(footnote, room)
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const availableHeight = room[isTop ? TOP : BOTTOM] - marginSize - 15

  return Math.min(maxHeight, availableHeight)
}

/**
 * Returns a function that positions each footnote relative to its button.
 *
 * @param  {String} eventType The type of event that prompted repositioning,
 *                            defaults to 'resize'.
 * @return {void}
 */
export function repositionPopover (eventType = 'resize') {
  return footnote => {
    const [ button ] = siblings(footnote, `.${CLASS_BUTTON}`)
    const room = getAvailableRoom(button)
    const content = footnote.querySelector(`.${CLASS_CONTENT}`)
    const maxHeight = getFootnoteMaxHeight(footnote, room)

    updateFootnoteState(footnote, room)

    content.style.maxHeight = maxHeight + 'px'

    if (eventType === 'resize') {
      const wrapper = footnote.querySelector(`.${CLASS_WRAPPER}`)
      const maxWidth = content.offsetWidth
      const buttonMarginLeft = parseInt(getStyle(button, 'marginLeft'), 10)
      const left = -room.leftRelative * maxWidth + buttonMarginLeft + button.offsetWidth / 2

      footnote.style.left = left + 'px'
      wrapper.style.maxWidth = maxWidth + 'px'

      positionTooltip(footnote, room.leftRelative)
    }

    if (parseFloat(footnote.offsetHeight) <= content.scrollHeight) {
      classList(footnote).add(CLASS_SCROLLABLE)
    }
  }
}
