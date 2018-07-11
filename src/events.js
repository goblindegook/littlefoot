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
  toggle,
  dismiss,
  reposition,
  resize,
  hover,
  unhover
}) {
  bind(document, 'touchend', handleWith(toggle))
  bind(document, 'click', handleWith(toggle))
  bind(document, 'keyup', handleEscapeWith(dismiss))
  bind(document, 'gestureend', throttle(reposition))
  bind(window, 'scroll', throttle(reposition))
  bind(window, 'resize', throttle(resize))

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handleWith(hover))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handleWith(unhover))
}
