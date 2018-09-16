import classList from 'dom-classlist'
import delegate from 'dom-delegate'
import { throttle } from 'lodash'
import { bind } from './dom'
import { findClosestFootnote, findClosestPopover, forAllActiveFootnotes } from './footnotes'
import { CLASS_BUTTON, CLASS_FULLY_SCROLLED, CLASS_HOVERED } from './constants'

function handle (fn, hover = false) {
  return event => {
    const target = event.target || event.srcElement
    const footnote = findClosestFootnote(target)
    const popover = findClosestPopover(target)
    fn(footnote, popover)
    if (hover) {
      event.preventDefault()
    }
  }
}

function handleEscape (fn) {
  return event => event.keyCode === 27 && fn()
}

function scrollHandler (event) {
  const target = event.currentTarget
  const delta = event.type === 'wheel' ? -event.deltaY : event.wheelDelta
  const height = target.clientHeight
  const popover = findClosestPopover(target)

  if (delta <= 0 && delta < height + target.scrollTop - target.scrollHeight) {
    classList(popover).add(CLASS_FULLY_SCROLLED)
    target.scrollTop = target.scrollHeight
    event.stopPropagation()
    event.preventDefault()
    return
  }

  if (delta > 0) {
    classList(popover).remove(CLASS_FULLY_SCROLLED)

    if (target.scrollTop < delta) {
      target.scrollTop = 0
      event.stopPropagation()
      event.preventDefault()
    }
  }
}

export function bindContentScrollHandler (contentElement) {
  const throttledScrollHandler = throttle(scrollHandler)

  bind(contentElement, 'mousewheel', throttledScrollHandler)
  bind(contentElement, 'wheel', throttledScrollHandler)
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

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handle(hover, true))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handle(unhover, true))
}
