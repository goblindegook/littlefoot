import delegate from 'dom-delegate'
import throttle from 'lodash.throttle'
import { bind } from './adapter/dom'
import {
  CLASS_BUTTON,
  CLASS_HOVERED
} from './adapter/constants'

function handle (fn) {
  return event => {
    fn(event.target || event.srcElement)
    event.preventDefault()
  }
}

function handleEscape (fn) {
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
  bind(document, 'touchend', handle(toggle))
  bind(document, 'click', handle(toggle))
  bind(document, 'keyup', handleEscape(dismiss))
  bind(document, 'gestureend', throttle(reposition))
  bind(window, 'scroll', throttle(reposition))
  bind(window, 'resize', throttle(resize))

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handle(hover))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handle(unhover))
}
