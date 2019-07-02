import throttle from 'lodash.throttle'
import { off, on } from 'delegated-events'
import { Core, FootnoteAction } from '../core'

type EventHandler<E extends Event> = (e: E) => void

export const FOOTNOTE_SELECTOR = '[data-footnote-id]'

const CLASS_FULLY_SCROLLED = 'is-fully-scrolled'

function closestPopover(target: Element): HTMLElement | null {
  return target.closest('[data-footnote-popover]') as HTMLElement | null
}

function closestFootnoteId(target: Element): string | null | undefined {
  const element = target.closest(FOOTNOTE_SELECTOR) as HTMLElement | null
  return element && element.dataset.footnoteId
}

function closestButtonId(target: Element): string | null | undefined {
  const button = target.closest('[data-footnote-button]') as HTMLElement | null
  return button && button.dataset.footnoteId
}

function handleTap(
  get: Core['findById'],
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
  get: Core['findById'],
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
  return event => event.keyCode === 27 && fn()
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const throttledScrollHandler = throttle<EventHandler<any>>(scrollHandler)
  contentElement.addEventListener('mousewheel', throttledScrollHandler)
  contentElement.addEventListener('wheel', throttledScrollHandler)
}

export function addEventListeners({
  dismissAll,
  findById,
  hover,
  repositionAll,
  resizeAll,
  toggle,
  unhover
}: Core): () => void {
  const toggleOnTap = handleTap(findById, toggle, dismissAll)
  const dismissOnEscape = handleEscape(dismissAll)
  const throttledReposition = throttle(repositionAll)
  const throttledResize = throttle(resizeAll)
  const showOnHover = handleHover(findById, hover)
  const hideOnHover = handleHover(findById, unhover)

  document.addEventListener('touchend', toggleOnTap)
  document.addEventListener('click', toggleOnTap)
  document.addEventListener('keyup', dismissOnEscape)
  document.addEventListener('gestureend', throttledReposition)
  window.addEventListener('scroll', throttledReposition)
  window.addEventListener('resize', throttledResize)
  on('mouseover', FOOTNOTE_SELECTOR, showOnHover)
  on('mouseout', FOOTNOTE_SELECTOR, hideOnHover)

  return () => {
    document.removeEventListener('touchend', toggleOnTap)
    document.removeEventListener('click', toggleOnTap)
    document.removeEventListener('keyup', dismissOnEscape)
    document.removeEventListener('gestureend', throttledReposition)
    window.removeEventListener('scroll', throttledReposition)
    window.removeEventListener('resize', throttledResize)
    off('mouseover', FOOTNOTE_SELECTOR, showOnHover)
    off('mouseout', FOOTNOTE_SELECTOR, hideOnHover)
  }
}
