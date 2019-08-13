import throttle from 'lodash.throttle'
import { off, on } from 'delegated-events'
import { Core, FootnoteAction } from '../core'

type EventHandler<E extends Event> = (e: E) => void

const SELECTOR_BUTTON = '[data-footnote-button]'
const SELECTOR_FOOTNOTE = '[data-footnote-id]'
const SELECTOR_POPOVER = '[data-footnote-popover]'
const CLASS_FULLY_SCROLLED = 'is-fully-scrolled'

function closest<E extends HTMLElement>(
  element: HTMLElement,
  selector: string
): E | undefined {
  return (element && (element.closest(selector) as E | null)) || undefined
}

function getFootnoteId(element?: HTMLElement): string | undefined {
  return element ? element.dataset.footnoteId : undefined
}

function handleTap(
  get: Core['findById'],
  action: FootnoteAction,
  dismissAll: () => void
): EventListener {
  return event => {
    const element = closest(event.target as HTMLElement, SELECTOR_BUTTON)
    const id = getFootnoteId(element)
    const footnote = id && get(id)

    if (footnote) {
      action(footnote)
    } else if (!closest(event.target as HTMLElement, SELECTOR_POPOVER)) {
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
    const element = closest(event.target as HTMLElement, SELECTOR_FOOTNOTE)
    const id = getFootnoteId(element)
    const footnote = id && get(id)

    if (footnote) {
      action(footnote)
    }
  }
}

function handleEscape(fn: () => void): EventHandler<KeyboardEvent> {
  return event => event.keyCode === 27 && fn()
}

function handleScroll(popover: HTMLElement): EventHandler<WheelEvent> {
  return (event: WheelEvent): void => {
    const content = event.currentTarget as HTMLElement
    const delta = -event.deltaY

    if (delta > 0) {
      popover.classList.remove(CLASS_FULLY_SCROLLED)
      if (content.scrollTop < delta) {
        content.scrollTop = 0
        event.preventDefault()
      }
    }

    if (
      delta <= 0 &&
      delta < content.clientHeight + content.scrollTop - content.scrollHeight
    ) {
      popover.classList.add(CLASS_FULLY_SCROLLED)
      content.scrollTop = content.scrollHeight
      event.preventDefault()
    }
  }
}

export function bindScrollHandler(
  content: HTMLElement,
  popover: HTMLElement
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const throttledScroll = throttle<EventHandler<any>>(handleScroll(popover))
  content.addEventListener('mousewheel', throttledScroll)
  content.addEventListener('wheel', throttledScroll)
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
  on('mouseover', SELECTOR_FOOTNOTE, showOnHover)
  on('mouseout', SELECTOR_FOOTNOTE, hideOnHover)

  return () => {
    document.removeEventListener('touchend', toggleOnTap)
    document.removeEventListener('click', toggleOnTap)
    document.removeEventListener('keyup', dismissOnEscape)
    document.removeEventListener('gestureend', throttledReposition)
    window.removeEventListener('scroll', throttledReposition)
    window.removeEventListener('resize', throttledResize)
    off('mouseover', SELECTOR_FOOTNOTE, showOnHover)
    off('mouseout', SELECTOR_FOOTNOTE, hideOnHover)
  }
}
