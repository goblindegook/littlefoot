import delegate from 'dom-delegate'
import throttle from 'lodash.throttle'
import { bind } from './dom'
import { findClosestFootnote, findClosestPopover, forAllActiveFootnotes } from './footnotes'
import {
  CLASS_BUTTON,
  CLASS_HOVERED
} from './constants'

function handle (fn) {
  return event => {
    const target = event.target || event.srcElement
    const footnote = findClosestFootnote(target)
    const popover = findClosestPopover(target)
    fn(footnote, popover)
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
  const dismissAll = () => forAllActiveFootnotes(dismiss)

  bind(document, 'touchend', handle(toggle))
  bind(document, 'click', handle(toggle))
  bind(document, 'keyup', handleEscape(dismissAll))
  bind(document, 'gestureend', throttle(reposition))
  bind(window, 'scroll', throttle(reposition))
  bind(window, 'resize', throttle(resize))

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handle(hover))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handle(unhover))
}
