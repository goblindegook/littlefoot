import throttle from 'lodash.throttle'
import { off, on } from 'delegated-events'
import { DATA_ID, DATA_POPOVER, DATA_BUTTON } from './constants'
import { Core, FootnoteAction } from '../core'
import { Footnote } from '../types'

type EventHandler<E extends Event> = (e: E) => void

const CLASS_FULLY_SCROLLED = 'is-fully-scrolled'

function closestPopover(target: Element): Element | null {
  return target.closest(`[${DATA_POPOVER}]`)
}

function closestFootnoteId(target: Element): string | null {
  const element = target.closest(`[${DATA_ID}]`)
  return element && element.getAttribute(DATA_ID)
}

function closestButtonId(target: Element): string | null {
  const button = target.closest(`[${DATA_BUTTON}]`)
  return button && button.getAttribute(DATA_ID)
}

function handleTap(
  get: (id: string) => Footnote | undefined,
  action: FootnoteAction,
  dismissAll: () => void
): EventListener {
  return event => {
    const id = closestButtonId(event.target as HTMLElement)
    const footnote = id && get(id)

    if (footnote) {
      action(footnote)
    } else if (!closestPopover(event.target as HTMLElement)) {
      dismissAll()
    }
  }
}

function handleHover(
  get: (id: string) => Footnote | undefined,
  action: FootnoteAction
): EventListener {
  return event => {
    event.preventDefault()
    const id = closestFootnoteId(event.target as HTMLElement)
    const footnote = id && get(id)

    if (footnote) {
      action(footnote)
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
    event.preventDefault()
    return
  }

  if (popover && delta > 0) {
    popover.classList.remove(CLASS_FULLY_SCROLLED)

    if (target.scrollTop < delta) {
      target.scrollTop = 0
      event.preventDefault()
    }
  }
}

export function bindContentScrollHandler(contentElement: Element): void {
  const throttledScrollHandler = throttle<EventHandler<any>>(scrollHandler)
  contentElement.addEventListener('mousewheel', throttledScrollHandler)
  contentElement.addEventListener('wheel', throttledScrollHandler)
}

export function addEventListeners({
  dismissAll,
  get,
  hover,
  reposition,
  resize,
  toggle,
  unhover
}: Core): () => void {
  const toggleOnTap = handleTap(get, toggle, dismissAll)
  const dismissOnEscape = handleEscape(dismissAll)
  const throttledReposition = throttle(reposition)
  const throttledResize = throttle(resize)
  const showOnHover = handleHover(get, hover)
  const hideOnHover = handleHover(get, unhover)

  document.addEventListener('touchend', toggleOnTap)
  document.addEventListener('click', toggleOnTap)
  document.addEventListener('keyup', dismissOnEscape)
  document.addEventListener('gestureend', throttledReposition)
  window.addEventListener('scroll', throttledReposition)
  window.addEventListener('resize', throttledResize)
  on('mouseover', `[${DATA_ID}]`, showOnHover)
  on('mouseout', `[${DATA_ID}]`, hideOnHover)

  return () => {
    document.removeEventListener('touchend', toggleOnTap)
    document.removeEventListener('click', toggleOnTap)
    document.removeEventListener('keyup', dismissOnEscape)
    document.removeEventListener('gestureend', throttledReposition)
    window.removeEventListener('scroll', throttledReposition)
    window.removeEventListener('resize', throttledResize)
    off('mouseover', `[${DATA_ID}]`, showOnHover)
    off('mouseout', `[${DATA_ID}]`, hideOnHover)
  }
}
