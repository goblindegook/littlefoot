import closest from 'dom-closest'
import classList from 'dom-classlist'
import { CLASS_FULLY_SCROLLED, CLASS_FOOTNOTE } from './constants'

/**
 * Get event data.
 *
 * @param  {Event} event Scroll or mousewheel event.
 * @return {void}
 */
function parseEvent (event) {
  return {
    target: event.currentTarget,
    delta: event.type === 'wheel' ? -event.deltaY : event.wheelDelta
  }
}

/**
 * Footnote content scroll handler.
 *
 * @param  {Event} event Scroll or mousewheel event.
 * @return {void}
 */
export function scrollContent (event) {
  const { target, delta } = parseEvent(event)
  const isScrollUp = delta > 0
  const height = target.clientHeight
  const popover = closest(target, `.${CLASS_FOOTNOTE}`)

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
