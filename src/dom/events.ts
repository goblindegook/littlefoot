import { throttle } from '@pacote/throttle'
import { UseCases, FootnoteAction } from '../use-cases'

const FRAME = 16
const SELECTOR_BUTTON = '[data-footnote-button]'
const SELECTOR_FOOTNOTE = '[data-footnote-id]'
const SELECTOR_POPOVER = '[data-footnote-popover]'

const closestTarget = (event: Event, selector: string) =>
  (event.target as HTMLElement).closest<HTMLElement>(selector)

const getFootnoteId = (element: HTMLElement | null) =>
  element?.dataset.footnoteId

const hoverHandler = (action: FootnoteAction) => (event: Event) => {
  event.preventDefault()
  const element = closestTarget(event, SELECTOR_FOOTNOTE)
  const id = getFootnoteId(element)
  if (id) {
    action(id)
  }
}

const onDocument = document.addEventListener
const onWindow = window.addEventListener

const delegate = (
  type: string,
  selector: string,
  listener: EventListener,
  options?: AddEventListenerOptions,
) =>
  onDocument(
    type,
    (event) => {
      const target = event.target as Element | null
      if (target?.closest(selector)) {
        listener.call(target, event)
      }
    },
    options,
  )

export function addListeners(useCases: UseCases): () => void {
  const toggleOnTouch = (event: Event) => {
    const element = closestTarget(event, SELECTOR_BUTTON)
    const id = getFootnoteId(element)
    if (id) {
      event.preventDefault()
      useCases.toggle(id)
    } else if (!closestTarget(event, SELECTOR_POPOVER)) {
      useCases.touchOutside()
    }
  }
  const dismissOnEscape = (event: KeyboardEvent) => {
    if (event.keyCode === 27 || event.key === 'Escape' || event.key === 'Esc') {
      useCases.dismissAll()
    }
  }
  const throttledReposition = throttle(useCases.repositionAll, FRAME)
  const throttledResize = throttle(useCases.resizeAll, FRAME)
  const showOnHover = hoverHandler(useCases.hover)
  const hideOnHover = hoverHandler(useCases.unhover)

  const controller = new AbortController()
  const options = { signal: controller.signal }

  onDocument('touchend', toggleOnTouch, options)
  onDocument('click', toggleOnTouch, options)
  onDocument('keyup', dismissOnEscape, options)
  onDocument('gestureend', throttledReposition, options)
  onWindow('scroll', throttledReposition, options)
  onWindow('resize', throttledResize, options)
  delegate('mouseover', SELECTOR_FOOTNOTE, showOnHover, options)
  delegate('mouseout', SELECTOR_FOOTNOTE, hideOnHover, options)

  return () => {
    controller.abort()
  }
}
