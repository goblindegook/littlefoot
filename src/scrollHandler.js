import closest from 'dom-closest'
import classList from 'dom-classlist'
import getStylePropertyInPixels from './dom/getStylePropertyInPixels'

/**
 * Footnote content scroll handler.
 *
 * @param {Event} event Scroll or mousewheel event.
 */
export default function scrollHandler(event) {
  const target     = event.currentTarget
  const delta      = event.type === 'wheel' ? -event.deltaY : event.wheelDelta
  const isScrollUp = delta > 0
  const height     = getStylePropertyInPixels(target, 'height')
  const popover    = closest(target, '.littlefoot-footnote')

  if (target.scrollTop > 0 && target.scrollTop < 10) {
    classList(popover).add('is-scrollable')
  }

  if (!classList(popover).contains('is-scrollable')) {
    return
  }

  if (!isScrollUp && delta < height + target.scrollTop - target.scrollHeight) {
    classList(popover).add('is-fully-scrolled')

    target.scrollTop = target.scrollHeight
    event.stopPropagation()
    event.preventDefault()
    return
  }

  if (isScrollUp) {
    classList(popover).remove('is-fully-scrolled')

    if (target.scrollTop < delta) {
      target.scrollTop = 0
      event.stopPropagation()
      event.preventDefault()
    }
  }
}
