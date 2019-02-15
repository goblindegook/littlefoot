import throttle from 'lodash.throttle'
import { findClosestFootnote, forAllActiveFootnotes } from './footnotes'
import { CLASS_BUTTON, CLASS_FULLY_SCROLLED, CLASS_FOOTNOTE } from './constants'
import { Core } from '../core'

const { on } = require('delegated-events')

type FootnoteEventHandler = (footnote?: any, popover?: any) => void
type EventHandler<E extends Event> = (e: E) => void

const findClosestPopover = (target: Element): Element | null =>
  target.closest(`.${CLASS_FOOTNOTE}`)

function handle(fn: FootnoteEventHandler): EventHandler<Event> {
  return event => {
    const target = event.target as HTMLElement
    const footnote = findClosestFootnote(target)
    const popover = findClosestPopover(target)
    fn(footnote, popover)
  }
}

function handleHover(fn: FootnoteEventHandler): EventHandler<Event> {
  return event => {
    handle(fn)(event)
    event.preventDefault()
  }
}

function handleEscape(fn: () => void): EventHandler<KeyboardEvent> {
  return event => event.key === '27' && fn()
}

function scrollHandler(event: WheelEvent): void {
  const target = event.currentTarget as HTMLElement
  const delta = -event.deltaY
  const height = target.clientHeight
  const popover = findClosestPopover(target)

  if (
    popover &&
    delta <= 0 &&
    delta < height + target.scrollTop - target.scrollHeight
  ) {
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

export function bindContentScrollHandler(contentElement: Element): void {
  const throttledScrollHandler = (throttle(
    scrollHandler
  ) as any) as EventListener

  contentElement.addEventListener('mousewheel', throttledScrollHandler)
  contentElement.addEventListener('wheel', throttledScrollHandler)
}

export function bindEvents({
  toggle,
  dismiss,
  reposition,
  resize,
  hover,
  unhover
}: Core): void {
  const dismissAll = () => forAllActiveFootnotes(dismiss)

  document.addEventListener('touchend', handle(toggle))
  document.addEventListener('click', handle(toggle))
  document.addEventListener('keyup', handleEscape(dismissAll))
  document.addEventListener('gestureend', throttle(reposition))
  window.addEventListener('scroll', throttle(reposition))
  window.addEventListener('resize', throttle(resize))

  on('mouseover', `.${CLASS_BUTTON}`, handleHover(hover))
  on('mouseout', `.${CLASS_BUTTON}`, handleHover(unhover))
}
