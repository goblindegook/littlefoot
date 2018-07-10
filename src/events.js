import delegate from 'dom-delegate'
import throttle from 'lodash.throttle'
import { bind } from './adapter/dom/events'
import {
  CLASS_BUTTON,
  CLASS_HOVERED
} from './adapter/constants'

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
  resizePopovers,
  hoverHandler,
  unhoverHandler
}) {
  bind(document, 'touchend', handleWith(toggleHandler))
  bind(document, 'click', handleWith(toggleHandler))
  bind(document, 'keyup', handleEscapeWith(dismiss))
  bind(document, 'gestureend', throttle(layoutPopovers))
  bind(window, 'scroll', throttle(layoutPopovers))
  bind(window, 'resize', throttle(resizePopovers))

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handleWith(hoverHandler))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handleWith(unhoverHandler))
}
