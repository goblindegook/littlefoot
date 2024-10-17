import { throttle } from '@pacote/throttle'
import type { FootnoteAction, UseCases } from '../use-cases'

const SELECTOR_FOOTNOTE = '[data-footnote-id]'

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
  eventType: string,
  selector: string,
  listener: EventListener,
  options?: AddEventListenerOptions,
) =>
  onDocument(
    eventType,
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
    const element = closestTarget(event, '[data-footnote-button]')
    const id = getFootnoteId(element)
    if (id) {
      event.preventDefault()
      useCases.toggle(id)
      applyBlur()
 
    } else if (!closestTarget(event, '[data-footnote-popover]')) {
      useCases.touchOutside()
      removeBlur()
    }
  }
  const dismissOnEscape = (event: KeyboardEvent) => {
    if (event.keyCode === 27 || event.key === 'Escape' || event.key === 'Esc') {
      useCases.dismissAll()
      removeBlur()
    }
  }
  const throttledReposition = throttle(useCases.repositionAll, 16)
  const throttledResize = throttle(useCases.resizeAll, 16)
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

function createBlurContainer() {
  const blurContainer = document.createElement('div');
  blurContainer.classList.add('blur-container');
  document.body.appendChild(blurContainer);
}

function applyBlur() {
  createBlurContainer();
  document.body.classList.add('blurred');
}

function removeBlur() {
  document.body.classList.remove('blurred');
  const blurContainer = document.querySelector('.blur-container');
  if (blurContainer) {
    blurContainer.remove();
  }
}

