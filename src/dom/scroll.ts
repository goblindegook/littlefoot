import { addClass, removeClass } from './element'
import { throttle } from './throttle'

const CLASS_FULLY_SCROLLED = 'is-fully-scrolled'

const scrollHandler = (popover: HTMLElement) => (event: WheelEvent) => {
  const content = event.currentTarget as HTMLElement | null
  const delta = -event.deltaY

  if (delta > 0) {
    removeClass(popover, CLASS_FULLY_SCROLLED)
  }

  if (
    content &&
    delta <= 0 &&
    delta < content.clientHeight + content.scrollTop - content.scrollHeight
  ) {
    addClass(popover, CLASS_FULLY_SCROLLED)
  }
}

function focusContent(content: HTMLElement): void {
  if (content.hasAttribute('tabindex') && document.activeElement !== content)
    content.focus({ preventScroll: true })
}

export function bindScrollHandler(content: HTMLElement, popover: HTMLElement): void {
  content.addEventListener('wheel', throttle(scrollHandler(popover), 16))
  content.addEventListener('mouseenter', () => focusContent(content))
}
