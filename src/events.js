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
  layoutPopovers,
  hoverHandler,
  unhoverHandler
}) {
  const throttledLayout = throttle(event => layoutPopovers(event && event.type))

  bind(document, 'touchend', handleWith(toggleHandler))
  bind(document, 'click', handleWith(toggleHandler))
  bind(document, 'keyup', handleEscapeWith(dismiss))
  bind(document, 'gestureend', throttledLayout)
  bind(window, 'scroll', throttledLayout)
  bind(window, 'resize', throttledLayout)

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handleWith(hoverHandler))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handleWith(unhoverHandler))
}
