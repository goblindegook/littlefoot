import { getStyle } from '@pacote/get-style'

export const CLASS_CONTENT = 'littlefoot-footnote__content'
export const CLASS_TOOLTIP = 'littlefoot-footnote__tooltip'
export const CLASS_WRAPPER = 'littlefoot-footnote__wrapper'

const CLASS_POSITION_PREFIX = 'is-positioned-'
const BOTTOM = 'bottom'
const TOP = 'top'

type Room = Readonly<{
  top: number
  bottom: number
  leftRelative: number
}>

export function getAvailableRoom(element: HTMLElement): Room {
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

function isPopoverOnTop(footnote: HTMLElement, room: Room): boolean {
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  const totalHeight = 2 * marginSize + footnote.offsetHeight

  return room.bottom < totalHeight && room.bottom < room.top
}

export function getAvailableHeight(footnote: HTMLElement, room: Room): number {
  const isTop = isPopoverOnTop(footnote, room)
  const marginSize = parseInt(getStyle(footnote, 'marginTop'), 10)
  return room[isTop ? TOP : BOTTOM] - marginSize - 15
}

export function repositionPopover(popover: HTMLElement, room: Room): void {
  const isTop = isPopoverOnTop(popover, room)
  const previous = popover.dataset.footnotePosition
  const position = isTop ? TOP : BOTTOM

  if (previous !== position) {
    popover.dataset.footnotePosition = position
    popover.classList.remove(`${CLASS_POSITION_PREFIX}${previous}`)
    popover.classList.add(`${CLASS_POSITION_PREFIX}${position}`)
    popover.style.transformOrigin = `${room.leftRelative * 100}% ${
      isTop ? '100%' : '0'
    }`
  }
}

export function repositionTooltip(
  popover: HTMLElement,
  leftRelative: number
): void {
  const tooltip = popover.querySelector<HTMLElement>('.' + CLASS_TOOLTIP)

  if (tooltip) {
    tooltip.style.left = leftRelative * 100 + '%'
  }
}

export function unmount(element: HTMLElement): void {
  element.parentNode && element.parentNode.removeChild(element)
}
