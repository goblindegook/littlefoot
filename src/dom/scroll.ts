import { throttle } from '@pacote/throttle'
import { addClass, removeClass } from './element'

const FRAME = 16
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

export function bindScrollHandler(
  content: HTMLElement,
  popover: HTMLElement
): void {
  content.addEventListener('wheel', throttle(scrollHandler(popover), FRAME))
}
