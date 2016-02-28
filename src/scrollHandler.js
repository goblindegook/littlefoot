import closest from 'dom-closest'
import addClass from './dom/addClass'
import hasClass from './dom/hasClass'
import removeClass from './dom/removeClass'

/**
 * Footnote content scroll handler.
 *
 * @param {Event} event Scroll or mousewheel event.
 */
export default function scrollHandler(event) {
  const target  = event.currentTarget
  const style   = target.currentStyle || window.getComputedStyle(target)
  const height  = parseInt(style.height, 10)
  const popover = closest(target, '.littlefoot-footnote')
  const delta   = event.type === 'wheel' ? -event.deltaY : event.wheelDelta
  const up      = delta > 0

  if (target.scrollTop > 0 && target.scrollTop < 10) {
    addClass(popover, 'is-scrollable')
  }

  if (!hasClass(popover, 'is-scrollable')) {
    return
  }

  if (!up && delta < height + target.scrollTop - target.scrollHeight) {
    target.scrollTop = target.scrollHeight
    addClass(popover, 'is-fully-scrolled')
    event.stopPropagation()
    event.preventDefault()

  } else if (up && target.scrollTop < delta) {
    target.scrollTop = 0
    removeClass(popover, 'is-fully-scrolled')
    event.stopPropagation()
    event.preventDefault()

  } else if (up) {
    removeClass(popover, 'is-fully-scrolled')
  }
}
