import closest from 'dom-closest'
import classList from 'dom-classlist'
import { CLASS_FULLY_SCROLLED, CLASS_FOOTNOTE } from './constants'

/**
 * Footnote content scroll handler.
 *
 * @param  {Event} event Scroll or mousewheel event.
 * @return {void}
 */
export function scrollContent (event) {
  const target = event.currentTarget
  const delta = event.type === 'wheel' ? -event.deltaY : event.wheelDelta
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
