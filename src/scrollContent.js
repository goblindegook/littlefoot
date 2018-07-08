import classList from 'dom-classlist'
import { CLASS_FULLY_SCROLLED } from './constants'
import { findClosestPopover } from './document'

function parseScrollEvent (event) {
  return {
    target: event.currentTarget,
    delta: event.type === 'wheel' ? -event.deltaY : event.wheelDelta
  }
}

export function scrollContent (event) {
  const { target, delta } = parseScrollEvent(event)
  const isScrollUp = delta > 0
  const height = target.clientHeight
  const popover = findClosestPopover(target)

  if (!isScrollUp && delta < height + target.scrollTop - target.scrollHeight) {
    classList(popover).add(CLASS_FULLY_SCROLLED)
    target.scrollTop = target.scrollHeight
    event.stopPropagation()
    event.preventDefault()
    return
  }

  if (isScrollUp) {
    classList(popover).remove(CLASS_FULLY_SCROLLED)

    if (target.scrollTop < delta) {
      target.scrollTop = 0
      event.stopPropagation()
      event.preventDefault()
    }
  }
}
