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
  resizePopovers,
  hoverHandler,
  unhoverHandler
}) {
  const scrollHandler = throttle(layoutPopovers)
  const resizeHandler = throttle(() => {
    layoutPopovers()
    resizePopovers()
  })

  bind(document, 'touchend', handleWith(toggleHandler))
  bind(document, 'click', handleWith(toggleHandler))
  bind(document, 'keyup', handleEscapeWith(dismiss))
  bind(document, 'gestureend', scrollHandler)
  bind(window, 'scroll', scrollHandler)
  bind(window, 'resize', resizeHandler)

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handleWith(hoverHandler))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handleWith(unhoverHandler))
}
