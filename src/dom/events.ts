import { throttle } from '@pacote/throttle'
import { off, on } from 'delegated-events'
import { Core, FootnoteAction } from '../core'

const FRAME = 16
const SELECTOR_BUTTON = '[data-footnote-button]'
const SELECTOR_FOOTNOTE = '[data-footnote-id]'
const SELECTOR_POPOVER = '[data-footnote-popover]'

const target = (event: Event) => event.target as HTMLElement

const getFootnoteId = (element: HTMLElement | null) =>
  element?.dataset.footnoteId

const touchHandler = (action: FootnoteAction, dismissAll: () => void) => (
  event: Event
) => {
  const element = target(event).closest<HTMLElement>(SELECTOR_BUTTON)
  const id = getFootnoteId(element)
  if (id) {
    action(id)
  } else if (!target(event).closest<HTMLElement>(SELECTOR_POPOVER)) {
    dismissAll()
  }
}

const hoverHandler = (action: FootnoteAction) => (event: Event) => {
  event.preventDefault()
  const element = target(event).closest<HTMLElement>(SELECTOR_FOOTNOTE)
  const id = getFootnoteId(element)
  if (id) {
    action(id)
  }
}

const escapeHandler = (fn: () => void) => (event: KeyboardEvent) => {
  if (event.keyCode === 27 || event.key === 'Escape' || event.key === 'Esc') {
    fn()
  }
}

export function addListeners(core: Core): () => void {
  const toggleOnTouch = touchHandler(core.toggle, core.dismissAll)
  const dismissOnEscape = escapeHandler(core.dismissAll)
  const throttledReposition = throttle(core.repositionAll, FRAME)
  const throttledResize = throttle(core.resizeAll, FRAME)
  const showOnHover = hoverHandler(core.hover)
  const hideOnHover = hoverHandler(core.unhover)

  document.addEventListener('touchend', toggleOnTouch)
  document.addEventListener('click', toggleOnTouch)
  document.addEventListener('keyup', dismissOnEscape)
  document.addEventListener('gestureend', throttledReposition)
  window.addEventListener('scroll', throttledReposition)
  window.addEventListener('resize', throttledResize)
  on('mouseover', SELECTOR_FOOTNOTE, showOnHover)
  on('mouseout', SELECTOR_FOOTNOTE, hideOnHover)

  return () => {
    document.removeEventListener('touchend', toggleOnTouch)
    document.removeEventListener('click', toggleOnTouch)
    document.removeEventListener('keyup', dismissOnEscape)
    document.removeEventListener('gestureend', throttledReposition)
    window.removeEventListener('scroll', throttledReposition)
    window.removeEventListener('resize', throttledResize)
    off('mouseover', SELECTOR_FOOTNOTE, showOnHover)
    off('mouseout', SELECTOR_FOOTNOTE, hideOnHover)
  }
}
