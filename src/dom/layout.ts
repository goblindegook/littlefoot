import { getStyle } from '@pacote/get-style'
import { pixels } from '@pacote/pixels'
import { addClass, removeClass } from './element'

export const CLASS_TOOLTIP = 'littlefoot__tooltip'

const CLASS_POSITION_PREFIX = 'is-'

export type Position = 'above' | 'below'

type Room = Readonly<{ [K in Position]: number }>

function getAvailableRoom(element: HTMLElement): Room {
  const height = element.offsetHeight
  const above = element.getBoundingClientRect().top + height / 2

  return {
    above,
    below: window.innerHeight - above,
  }
}

export function getLeftRelative(element: HTMLElement): number {
  const marginLeft = parseFloat(getStyle(element, 'marginLeft'))
  const width = element.offsetWidth - marginLeft
  const left = element.getBoundingClientRect().left + width / 2

  return left / window.innerWidth
}

export function getLeftInPixels(
  content: HTMLElement,
  button: HTMLElement
): number {
  const maxWidth = content.offsetWidth
  const leftRelative = getLeftRelative(button)
  const buttonMarginLeft = parseInt(getStyle(button, 'marginLeft'), 10)
  return -leftRelative * maxWidth + buttonMarginLeft + button.offsetWidth / 2
}

function popoverPosition(footnote: HTMLElement, room: Room): Position {
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const totalHeight = 2 * marginSize + footnote.offsetHeight
  return room.below < totalHeight && room.below < room.above ? 'above' : 'below'
}

export function getAvailableHeight(
  footnote: HTMLElement,
  button: HTMLElement,
  maxHeight: number
): number {
  const room = getAvailableRoom(button)
  const position = popoverPosition(footnote, room)
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  return Math.min(maxHeight, room[position] - marginSize - 15)
}

export function getMaxHeight(element: HTMLElement) {
  return Math.round(pixels(getStyle(element, 'maxHeight'), element))
}

export function repositionPopover(
  popover: HTMLElement,
  button: HTMLElement,
  previous: Position
): Position {
  const room = getAvailableRoom(button)
  const position = popoverPosition(popover, room)

  if (previous !== position) {
    removeClass(popover, CLASS_POSITION_PREFIX + previous)
    addClass(popover, CLASS_POSITION_PREFIX + position)
    const transformX = getLeftRelative(button) * 100 + '%'
    const transformY = position === 'above' ? '100%' : '0'
    popover.style.transformOrigin = transformX + ' ' + transformY
  }

  return position
}

export function repositionTooltip(
  popover: HTMLElement,
  button: HTMLElement
): void {
  const tooltip = popover.querySelector<HTMLElement>('.' + CLASS_TOOLTIP)

  if (tooltip) {
    tooltip.style.left = getLeftRelative(button) * 100 + '%'
  }
}
