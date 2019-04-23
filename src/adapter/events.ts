import throttle from 'lodash.throttle'
import {
  CLASS_FULLY_SCROLLED,
  FOOTNOTE_POPOVER_ID,
  FOOTNOTE_BUTTON_ID
} from './constants'
import { Core, FootnoteAction } from '../core'
import { Footnote } from '../types'

const { on } = require('delegated-events')

type EventHandler<E extends Event> = (e: E) => void

function closestPopover(target: Element): Element | null {
  return target.closest(`[${FOOTNOTE_POPOVER_ID}]`)
}

function closestPopoverId(target: HTMLElement): string | null {
  const popover = closestPopover(target)
  return popover && popover.getAttribute(FOOTNOTE_POPOVER_ID)
}

function closestFootnoteId(target: HTMLElement): string | null {
  const button = target.closest(`[${FOOTNOTE_BUTTON_ID}]`)
  return button && button.getAttribute(FOOTNOTE_BUTTON_ID)
}

function handleTap(
  get: (id: string) => Footnote | undefined,
  toggle: FootnoteAction,
  dismissAll: () => void
): EventListener {
  return event => {
    const id = closestFootnoteId(event.target as HTMLElement)
    const footnote = id && get(id)

    if (footnote) {
      toggle(footnote)
    } else if (!closestPopover(event.target as HTMLElement)) {
      dismissAll()
    }
  }
}

function handleHover(
  get: (id: string) => Footnote | undefined,
  toggle: FootnoteAction
): EventListener {
  return event => {
    event.preventDefault()
    const target = event.target as HTMLElement
    const id = closestFootnoteId(target) || closestPopoverId(target)
    const footnote = id && get(id)

    if (footnote) {
      toggle(footnote)
    }
  }
}

function handleEscape(fn: () => void): EventHandler<KeyboardEvent> {
  return event => event.key === '27' && fn()
}

function scrollHandler(event: WheelEvent): void {
  const target = event.currentTarget as HTMLElement
  const delta = -event.deltaY
  const height = target.clientHeight
  const popover = closestPopover(target)

  if (
    popover &&
    delta <= 0 &&
    delta < height + target.scrollTop - target.scrollHeight
  ) {
    popover.classList.add(CLASS_FULLY_SCROLLED)
    target.scrollTop = target.scrollHeight
    event.stopPropagation()
    event.preventDefault()
    return
  }

  if (popover && delta > 0) {
    popover.classList.remove(CLASS_FULLY_SCROLLED)

    if (target.scrollTop < delta) {
      target.scrollTop = 0
      event.stopPropagation()
      event.preventDefault()
    }
  }
}

export function bindContentScrollHandler(contentElement: Element): void {
  const throttledScrollHandler = throttle<EventHandler<any>>(scrollHandler)
  contentElement.addEventListener('mousewheel', throttledScrollHandler)
  contentElement.addEventListener('wheel', throttledScrollHandler)
}

export function bindEvents({
  dismissAll,
  get,
  hover,
  reposition,
  resize,
  toggle,
  unhover
}: Core): void {
  document.addEventListener('touchend', handleTap(get, toggle, dismissAll))
  document.addEventListener('click', handleTap(get, toggle, dismissAll))
  document.addEventListener('keyup', handleEscape(dismissAll))
  document.addEventListener('gestureend', throttle(reposition))
  window.addEventListener('scroll', throttle(reposition))
  window.addEventListener('resize', throttle(resize))

  on('mouseover', `[${FOOTNOTE_BUTTON_ID}]`, handleHover(get, hover))
  on('mouseout', `[${FOOTNOTE_BUTTON_ID}]`, handleHover(get, unhover))
  on('mouseout', `[${FOOTNOTE_POPOVER_ID}]`, handleHover(get, unhover))
}
