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
  POPOVER_POSITION
} from './constants'

const CLASS_POSITION_PREFIX = 'is-positioned-'
const BOTTOM = 'bottom'
const TOP = 'top'

function isPopoverOnTop (footnote, room) {
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const totalHeight = 2 * marginSize + footnote.offsetHeight

  return room.bottom < totalHeight && room.bottom < room.top
}

function repositionPopover (popover, room) {
  const isTop = isPopoverOnTop(popover, room)
  const previous = popover.getAttribute(POPOVER_POSITION) || BOTTOM
  const position = isTop ? TOP : BOTTOM

  if (previous !== position) {
    classList(popover).remove(CLASS_POSITION_PREFIX + previous)
    classList(popover).add(CLASS_POSITION_PREFIX + position)
    popover.setAttribute(POPOVER_POSITION, position)
    popover.style.transformOrigin = `${room.leftRelative * 100}% ${isTop ? '100%' : '0'}`
  }
}

function getPopoverMaxHeight (footnote, room) {
  const isTop = isPopoverOnTop(footnote, room)
  const maxHeight = parseInt(footnote.getAttribute(FOOTNOTE_MAX_HEIGHT), 10)
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const availableHeight = room[isTop ? TOP : BOTTOM] - marginSize - 15

  return Math.min(maxHeight, availableHeight)
}

function setContentHeight (popover, content, room) {
  const maxHeight = getPopoverMaxHeight(popover, room)
  content.style.maxHeight = maxHeight + 'px'
}

function setPopoverScrollableState (popover, content) {
  if (parseFloat(popover.offsetHeight) <= content.scrollHeight) {
    classList(popover).add(CLASS_SCROLLABLE)
  }
}

function repositionTooltip (popover, leftRelative = 0.5) {
  const tooltip = popover.querySelector(`.${CLASS_TOOLTIP}`)

  if (tooltip) {
    tooltip.style.left = (leftRelative * 100) + '%'
  }
}

function resizePopover (popover, content, button, room) {
  const wrapper = popover.querySelector(`.${CLASS_WRAPPER}`)
  const maxWidth = content.offsetWidth
  const buttonMarginLeft = parseInt(getStyle(button, 'marginLeft'), 10)
  const left = -room.leftRelative * maxWidth + buttonMarginLeft + button.offsetWidth / 2

  popover.style.left = left + 'px'
  wrapper.style.maxWidth = maxWidth + 'px'

  repositionTooltip(popover, room.leftRelative)
}

/**
 * Returns a function that positions each footnote relative to its button.
 *
 * @param  {String} eventType The type of event that prompted repositioning,
 *                            defaults to 'resize'.
 * @return {void}
 */
export function layoutPopover (eventType = 'resize') {
  return popover => {
    const [ button ] = siblings(popover, `.${CLASS_BUTTON}`)
    const room = getAvailableRoom(button)
    const content = popover.querySelector(`.${CLASS_CONTENT}`)

    setContentHeight(popover, content, room)
    repositionPopover(popover, room)

    if (eventType === 'resize') {
      resizePopover(popover, content, button, room)
    }

    setPopoverScrollableState(popover, content)
  }
}
