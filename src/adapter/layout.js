import classList from 'dom-classlist'
import { getAvailableRoom } from './dom/getAvailableRoom'
import { getStyle } from './dom/getStyle'
import {
  CLASS_SCROLLABLE,
  CLASS_TOOLTIP,
  CLASS_WRAPPER,
  FOOTNOTE_MAX_HEIGHT,
  POPOVER_POSITION
} from './constants'
import { getPopoverFootnote } from './footnotes'
import { findPopoverContent } from './document'

const CLASS_POSITION_PREFIX = 'is-positioned-'
const BOTTOM = 'bottom'
const TOP = 'top'

function isPopoverOnTop (footnote, room) {
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const totalHeight = 2 * marginSize + footnote.offsetHeight

  return room.bottom < totalHeight && room.bottom < room.top
}

function getPopoverMaxHeight (footnote, room) {
  const isTop = isPopoverOnTop(footnote, room)
  const maxHeight = parseInt(footnote.getAttribute(FOOTNOTE_MAX_HEIGHT), 10)
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const availableHeight = room[isTop ? TOP : BOTTOM] - marginSize - 15

  return Math.min(maxHeight, availableHeight)
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

function repositionTooltip (popover, leftRelative = 0.5) {
  const tooltip = popover.querySelector(`.${CLASS_TOOLTIP}`)

  if (tooltip) {
    tooltip.style.left = (leftRelative * 100) + '%'
  }
}

/**
 * Positions a footnote relative to its button.
 */
export function layoutPopover (popover) {
  const button = getPopoverFootnote(popover).getButtonElement()
  const room = getAvailableRoom(button)
  const content = findPopoverContent(popover)

  const maxHeight = getPopoverMaxHeight(popover, room)
  content.style.maxHeight = maxHeight + 'px'

  repositionPopover(popover, room)

  if (parseFloat(popover.offsetHeight) <= content.scrollHeight) {
    classList(popover).add(CLASS_SCROLLABLE)
  }

  return { button, content, room }
}

/**
 * Resizes a footnote relative to its container and repositions the tooltip.
 */
export function resizePopover (popover) {
  const { button, content, room } = layoutPopover(popover)
  const maxWidth = content.offsetWidth
  const buttonMarginLeft = parseInt(getStyle(button, 'marginLeft'), 10)
  const left = -room.leftRelative * maxWidth + buttonMarginLeft + button.offsetWidth / 2
  const wrapper = popover.querySelector(`.${CLASS_WRAPPER}`)

  popover.style.left = left + 'px'
  wrapper.style.maxWidth = maxWidth + 'px'

  repositionTooltip(popover, room.leftRelative)
}
