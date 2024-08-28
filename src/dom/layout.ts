import { getStyle } from '@pacote/get-style'
import { pixels } from '@pacote/pixels'
import { addClass, removeClass } from './element'

export const CLASS_TOOLTIP = 'littlefoot__tooltip'

export type Position = 'above' | 'below'

function getLeftRelative(element: HTMLElement): number {
  const marginLeft = Number.parseFloat(getStyle(element, 'marginLeft'))
  const width = element.offsetWidth - marginLeft
  const left = element.getBoundingClientRect().left + width / 2

  return left / window.innerWidth
}

export function getLeftInPixels(
  content: HTMLElement,
  button: HTMLElement,
): number {
  const maxWidth = content.offsetWidth
  const leftRelative = getLeftRelative(button)
  const buttonMarginLeft = Number.parseInt(getStyle(button, 'marginLeft'), 10)
  return -leftRelative * maxWidth + buttonMarginLeft + button.offsetWidth / 2
}

export function getMaxHeight(element: HTMLElement) {
  return Math.round(pixels(getStyle(element, 'maxHeight'), element))
}

function getFootnotePosition(
  button: HTMLElement,
  popover: HTMLElement,
): [Position, number] {
  const marginSize = Number.parseInt(getStyle(popover, 'marginTop'), 10)
  const popoverHeight = 2 * marginSize + popover.offsetHeight
  const roomAbove = button.getBoundingClientRect().top + button.offsetHeight / 2
  const roomBelow = window.innerHeight - roomAbove

  return roomBelow >= popoverHeight || roomBelow >= roomAbove
    ? ['below', roomBelow - marginSize - 15]
    : ['above', roomAbove - marginSize - 15]
}

export function repositionPopover(
  popover: HTMLElement,
  button: HTMLElement,
  current: Position,
): [Position, number] {
  const [next, room] = getFootnotePosition(button, popover)

  if (current !== next) {
    removeClass(popover, 'is-' + current)
    addClass(popover, 'is-' + next)
    const transformX = getLeftRelative(button) * 100 + '%'
    const transformY = next === 'above' ? '100%' : '0'
    popover.style.transformOrigin = transformX + ' ' + transformY
  }

  return [next, room]
}

export function repositionTooltip(
  popover: HTMLElement,
  button: HTMLElement,
): void {
  const tooltip = popover.querySelector<HTMLElement>('.' + CLASS_TOOLTIP)

  if (tooltip) {
    tooltip.style.left = getLeftRelative(button) * 100 + '%'
  }
}
