import closest from 'dom-closest'
import classList from 'dom-classlist'

/**
 * Footnote content scroll handler.
 *
 * @param  {Event} event Scroll or mousewheel event.
 * @return {void}
 */
export default function scrollContent(event) {
  const target     = event.currentTarget
  const delta      = event.type === 'wheel' ? -event.deltaY : event.wheelDelta
  const isScrollUp = delta > 0
  const height     = target.clientHeight
  const popover    = closest(target, '.littlefoot-footnote')

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
