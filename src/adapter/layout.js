import classList from 'dom-classlist'
import { getStyle } from './dom'
import {
  CLASS_TOOLTIP,
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

export function getPopoverMaxHeight (footnote, room) {
  const isTop = isPopoverOnTop(footnote, room)
  const maxHeight = parseInt(footnote.getAttribute(FOOTNOTE_MAX_HEIGHT), 10)
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const availableHeight = room[isTop ? TOP : BOTTOM] - marginSize - 15

  return Math.min(maxHeight, availableHeight)
}

export function repositionPopover (popover, room) {
  const isTop = isPopoverOnTop(popover, room)
  const previous = popover.getAttribute(POPOVER_POSITION) || BOTTOM
  const position = isTop ? TOP : BOTTOM

  if (previous !== position) {
    classList(popover).remove(`${CLASS_POSITION_PREFIX}${previous}`)
    classList(popover).add(`${CLASS_POSITION_PREFIX}${position}`)
    popover.setAttribute(POPOVER_POSITION, position)
    popover.style.transformOrigin = `${room.leftRelative * 100}% ${
      isTop ? '100%' : '0'
    }`
  }
}

export function repositionTooltip (popover, leftRelative = 0.5) {
  const tooltip = popover.querySelector(`.${CLASS_TOOLTIP}`)

  if (tooltip) {
    tooltip.style.left = leftRelative * 100 + '%'
  }
}
