import { addClass, removeClass } from './element'

export const CLASS_TOOLTIP = 'littlefoot__tooltip' as const

export type Position = 'above' | 'below'

function getComputedValue(
  element: HTMLElement,
  property: keyof CSSStyleDeclaration | string,
): string {
  const view = element.ownerDocument?.defaultView ?? window
  const style = view.getComputedStyle(element)
  return style.getPropertyValue(property as string) || ''
}

function getNumericValue(
  element: HTMLElement,
  property: keyof CSSStyleDeclaration | string,
): number {
  const value = Number.parseFloat(getComputedValue(element, property))
  return Number.isNaN(value) ? 0 : value
}

function getLeftRelative(element: HTMLElement): number {
  const marginLeft = getNumericValue(element, 'margin-left')
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
  const buttonMarginLeft = getNumericValue(button, 'margin-left')
  return -leftRelative * maxWidth + buttonMarginLeft + button.offsetWidth / 2
}

export function getMaxHeight(element: HTMLElement) {
  const value = getComputedValue(element, 'max-height')
  if (value === '' || value === 'none') {
    return Number.POSITIVE_INFINITY
  }
  const numeric = Number.parseFloat(value)
  return Number.isNaN(numeric) ? Number.POSITIVE_INFINITY : Math.round(numeric)
}

function getFootnotePosition(
  button: HTMLElement,
  popover: HTMLElement,
): [Position, number] {
  const marginSize = getNumericValue(popover, 'margin-top')
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
