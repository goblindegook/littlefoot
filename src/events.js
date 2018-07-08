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

export function onTouchClick (fn) {
  const handler = handleWith(fn)
  bind(document, 'touchend', handler)
  bind(document, 'click', handler)
}

export function onEscapeKey (fn) {
  bind(document, 'keyup', handleEscapeWith(fn))
}

export function onScrollResize (fn) {
  const handler = throttle(fn)
  bind(document, 'gestureend', handler)
  bind(window, 'scroll', handler)
  bind(window, 'resize', handler)
}

export function onHover (fn) {
  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handleWith(fn))
}

export function onUnhover (fn) {
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handleWith(fn))
}
