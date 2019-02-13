import delegate from 'dom-delegate'
import throttle from 'lodash.throttle'
import {
  findClosestFootnote,
  findClosestPopover,
  forAllActiveFootnotes
} from './footnotes'
import { CLASS_BUTTON, CLASS_FULLY_SCROLLED, CLASS_HOVERED } from './constants'
import { Cancelable } from 'lodash';

type FootnoteAction = (footnote?: any, popover?: any) => void

type EventHandler<E extends Event> = ((e: E) => void) & ({} | Cancelable)

function handle (fn: FootnoteAction, hover = false): EventHandler<Event> {
  return event => {
    const target = event.target as HTMLElement
    const footnote = findClosestFootnote(target)
    const popover = findClosestPopover(target)
    fn(footnote, popover)
    if (hover) {
      event.preventDefault()
    }
  }
}

function handleEscape (fn: () => void): EventHandler<KeyboardEvent> {
  return event => event.keyCode === 27 && fn()
}

function scrollHandler (event: WheelEvent): void {
  const target = event.currentTarget as HTMLElement
  const delta = -event.deltaY
  const height = target.clientHeight
  const popover = findClosestPopover(target)

  if (popover && delta <= 0 && delta < height + target.scrollTop - target.scrollHeight) {
    popover.classList.add(CLASS_FULLY_SCROLLED)
    target.scrollTop = target.scrollHeight
    event.stopPropagation()
    event.preventDefault()
    return
  }

  if (popover && delta > 0) {
    popover.classList.remove(CLASS_FULLY_SCROLLED)

    if (target.scrollTop < delta) {
      target.scrollTop = 0
      event.stopPropagation()
      event.preventDefault()
    }
  }
}

export function bindContentScrollHandler (contentElement: Element): void {
  const throttledScrollHandler = throttle(scrollHandler) as any as EventListener

  contentElement.addEventListener('mousewheel', throttledScrollHandler)
  contentElement.addEventListener('wheel', throttledScrollHandler)
}

export function bindEvents ({
  toggle,
  dismiss,
  reposition,
  resize,
  hover,
  unhover
}): void {
  const dismissAll = () => forAllActiveFootnotes(dismiss)

  document.addEventListener('touchend', handle(toggle))
  document.addEventListener('click', handle(toggle))
  document.addEventListener('keyup', handleEscape(dismissAll))
  document.addEventListener('gestureend', throttle(reposition))
  window.addEventListener('scroll', throttle(reposition))
  window.addEventListener('resize', throttle(resize))

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, handle(hover, true))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, handle(unhover, true))
}
