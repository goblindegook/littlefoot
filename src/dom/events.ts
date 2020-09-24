import { throttle } from '@pacote/throttle'
import { off, on } from 'delegated-events'
import { Core, FootnoteAction } from '../core'

const FRAME = 16
const SELECTOR_BUTTON = '[data-footnote-button]'
const SELECTOR_FOOTNOTE = '[data-footnote-id]'
const SELECTOR_POPOVER = '[data-footnote-popover]'

const closestTarget = (event: Event, selector: string) =>
  (event.target as HTMLElement).closest<HTMLElement>(selector)

const getFootnoteId = (element: HTMLElement | null) =>
  element?.dataset.footnoteId

const touchHandler = (action: FootnoteAction, dismissAll: () => void) => (
  event: Event
) => {
  const element = closestTarget(event, SELECTOR_BUTTON)
  const id = getFootnoteId(element)
  if (id) {
    action(id)
  } else if (!closestTarget(event, SELECTOR_POPOVER)) {
    dismissAll()
  }
}

const hoverHandler = (action: FootnoteAction) => (event: Event) => {
  event.preventDefault()
  const element = closestTarget(event, SELECTOR_FOOTNOTE)
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

const onDocument = document.addEventListener
const offDocument = document.removeEventListener
const onWindow = window.addEventListener
const offWindow = window.removeEventListener

export function addListeners(core: Core): () => void {
  const toggleOnTouch = touchHandler(core.toggle, core.dismissAll)
  const dismissOnEscape = escapeHandler(core.dismissAll)
  const throttledReposition = throttle(core.repositionAll, FRAME)
  const throttledResize = throttle(core.resizeAll, FRAME)
  const showOnHover = hoverHandler(core.hover)
  const hideOnHover = hoverHandler(core.unhover)

  onDocument('touchend', toggleOnTouch)
  onDocument('click', toggleOnTouch)
  onDocument('keyup', dismissOnEscape)
  onDocument('gestureend', throttledReposition)
  onWindow('scroll', throttledReposition)
  onWindow('resize', throttledResize)
  on('mouseover', SELECTOR_FOOTNOTE, showOnHover)
  on('mouseout', SELECTOR_FOOTNOTE, hideOnHover)

  return () => {
    offDocument('touchend', toggleOnTouch)
    offDocument('click', toggleOnTouch)
    offDocument('keyup', dismissOnEscape)
    offDocument('gestureend', throttledReposition)
    offWindow('scroll', throttledReposition)
    offWindow('resize', throttledResize)
    off('mouseover', SELECTOR_FOOTNOTE, showOnHover)
    off('mouseout', SELECTOR_FOOTNOTE, hideOnHover)
  }
}
