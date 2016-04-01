import closest from 'dom-closest'
import classList from 'dom-classlist'
import getStyle from './dom/getStyle'

/**
 * Footnote content scroll handler.
 *
 * @param {Event} event Scroll or mousewheel event.
 */
export default function scrollHandler(event) {
  const target  = event.currentTarget
  const style   = getStyle(target)
  const height  = parseInt(style.height, 10)
  const popover = closest(target, '.littlefoot-footnote')
  const delta   = event.type === 'wheel' ? -event.deltaY : event.wheelDelta
  const up      = delta > 0

  if (target.scrollTop > 0 && target.scrollTop < 10) {
    classList(popover).add('is-scrollable')
  }

  if (!classList(popover).contains('is-scrollable')) {
    return
  }

  if (!up && delta < height + target.scrollTop - target.scrollHeight) {
    target.scrollTop = target.scrollHeight
    classList(popover).add('is-fully-scrolled')
    event.stopPropagation()
    event.preventDefault()

  } else if (up && target.scrollTop < delta) {
    target.scrollTop = 0
    classList(popover).remove('is-fully-scrolled')
    event.stopPropagation()
    event.preventDefault()

  } else if (up) {
    classList(popover).remove('is-fully-scrolled')
  }
}
