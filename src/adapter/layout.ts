import { getStyle } from './dom'
import {
  CLASS_TOOLTIP,
  FOOTNOTE_MAX_HEIGHT,
  POPOVER_POSITION
} from './constants'

const CLASS_POSITION_PREFIX = 'is-positioned-'
const BOTTOM = 'bottom'
const TOP = 'top'

type Room = {
  top: number
  bottom: number
  leftRelative: number
}

export function getAvailableRoom (element: HTMLElement): Room {
  const marginLeft = parseFloat(getStyle(element, 'marginLeft'))
  const width = element.offsetWidth - marginLeft
  const height = element.offsetHeight
  const rect = element.getBoundingClientRect()
  const left = rect.left + width / 2
  const top = rect.top + height / 2

  return {
    top,
    bottom: window.innerHeight - top,
    leftRelative: left / window.innerWidth
  }
}

function isPopoverOnTop (footnote: HTMLElement, room: Room): boolean {
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const totalHeight = 2 * marginSize + footnote.offsetHeight

  return room.bottom < totalHeight && room.bottom < room.top
}

export function getPopoverMaxHeight (
  footnote: HTMLElement,
  room: Room
): number {
  const isTop = isPopoverOnTop(footnote, room)
  const maxHeight = parseInt(
    footnote.getAttribute(FOOTNOTE_MAX_HEIGHT) || '0',
    10
  )
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const availableHeight = room[isTop ? TOP : BOTTOM] - marginSize - 15

  return Math.min(maxHeight, availableHeight)
}

export function repositionPopover (popover: HTMLElement, room: Room): void {
  const isTop = isPopoverOnTop(popover, room)
  const previous = popover.getAttribute(POPOVER_POSITION) || BOTTOM
  const position = isTop ? TOP : BOTTOM

  if (previous !== position) {
    popover.classList.remove(`${CLASS_POSITION_PREFIX}${previous}`)
    popover.classList.add(`${CLASS_POSITION_PREFIX}${position}`)
    popover.setAttribute(POPOVER_POSITION, position)
    popover.style.transformOrigin = `${room.leftRelative * 100}% ${
      isTop ? '100%' : '0'
    }`
  }
}

export function repositionTooltip (
  popover: HTMLElement,
  leftRelative = 0.5
): void {
  const tooltip = popover.querySelector<HTMLElement>(`.${CLASS_TOOLTIP}`)

  if (tooltip) {
    tooltip.style.left = leftRelative * 100 + '%'
  }
}
