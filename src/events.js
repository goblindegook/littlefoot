import delegate from 'dom-delegate'
import throttle from 'lodash.throttle'
import { bind } from './dom/events'
import {
  CLASS_BUTTON,
  CLASS_HOVERED
} from './constants'

function handleWith (fn) {
  return event => {
    if (fn(event.target || event.srcElement)) {
      event.preventDefault()
    }
  }
}

function handleEscapeWith (fn) {
  return event => event.keyCode === 27 && fn()
}

export function bindEvents ({
  toggleHandler,
  dismiss,
  repositionPopovers,
  hoverHandler,
  unhoverHandler
}) {
  const throttledRepositionPopovers = throttle(event => repositionPopovers(event && event.type))

  bind(document, 'touchend', handleWith(toggleHandler))
  bind(document, 'click', handleWith(toggleHandler))
  bind(document, 'keyup', handleEscapeWith(dismiss))
  bind(document, 'gestureend', throttledRepositionPopovers)
  bind(window, 'scroll', throttledRepositionPopovers)
  bind(window, 'resize', throttledRepositionPopovers)

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handleWith(hoverHandler))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handleWith(unhoverHandler))
}
