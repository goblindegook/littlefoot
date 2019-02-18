import throttle from 'lodash.throttle'
import { forAllActiveFootnotes, createFootnote } from './footnotes'
import { CLASS_BUTTON, CLASS_FULLY_SCROLLED, CLASS_FOOTNOTE } from './constants'
import { Core, EventHandlerFn } from '../core'
import { findSibling } from './dom'
import { Footnote } from '../types'

const { on } = require('delegated-events')

type EventHandler<E extends Event> = (e: E) => void

function findClosestFootnote(target: HTMLElement | null): Footnote | null {
  const button = target && target.closest(`.${CLASS_BUTTON}`)
  const popover = button && findSibling(button, `.${CLASS_FOOTNOTE}`)
  return button && createFootnote(button as HTMLElement, popover)
}

const findClosestPopover = (target: Element): Element | null =>
  target.closest(`.${CLASS_FOOTNOTE}`)

function handleToggle(
  tap: EventHandlerFn,
  dismissAll: () => void
): EventListener {
  return event => {
    const target = event.target as HTMLElement
    const footnote = findClosestFootnote(target)

    if (footnote) {
      tap(footnote)
    } else if (!findClosestPopover(target)) {
      dismissAll()
    }
  }
}

function handleHover(hover: EventHandlerFn): EventListener {
  return event => {
    event.preventDefault()
    const target = event.target as HTMLElement
    const footnote = findClosestFootnote(target)

    if (footnote) {
      hover(footnote)
    }
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
  const throttledScrollHandler = throttle<EventHandler<any>>(scrollHandler)

  contentElement.addEventListener('mousewheel', throttledScrollHandler)
  contentElement.addEventListener('wheel', throttledScrollHandler)
}

export function bindEvents({
  tap,
  dismiss,
  reposition,
  resize,
  hover,
  unhover
}: Core): void {
  const dismissAll = () => forAllActiveFootnotes(dismiss)

  document.addEventListener('touchend', handleToggle(tap, dismissAll))
  document.addEventListener('click', handleToggle(tap, dismissAll))
  document.addEventListener('keyup', handleEscape(dismissAll))
  document.addEventListener('gestureend', throttle(reposition))
  window.addEventListener('scroll', throttle(reposition))
  window.addEventListener('resize', throttle(resize))

  on('mouseover', `.${CLASS_BUTTON}`, handleHover(hover))
  on('mouseout', `.${CLASS_BUTTON}`, handleHover(unhover))
}
