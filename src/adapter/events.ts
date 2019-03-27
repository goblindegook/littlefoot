import throttle from 'lodash.throttle'
import { CLASS_BUTTON, CLASS_FULLY_SCROLLED, CLASS_FOOTNOTE } from './constants'
import { Core, ActivateFootnote } from '../core'
import { Adapter, Footnote } from '../types'

const { on } = require('delegated-events')

type EventHandler<E extends Event> = (e: E) => void

const findClosestPopover = (target: Element): Element | null =>
  target.closest(`.${CLASS_FOOTNOTE}`)

function handleTap(
  findByElement: (target: HTMLElement) => Footnote | undefined,
  activate: ActivateFootnote,
  dismissAll: () => void
): EventListener {
  return event => {
    const footnote = event.target && findByElement(event.target as HTMLElement)

    if (footnote) {
      activate(footnote)
    } else if (!findClosestPopover(event.target as HTMLElement)) {
      dismissAll()
    }
  }
}

function handleHover(
  findByElement: (target: HTMLElement) => Footnote | undefined,
  activate: ActivateFootnote
): EventListener {
  return event => {
    event.preventDefault()
    const footnote = event.target && findByElement(event.target as HTMLElement)

    if (footnote) {
      activate(footnote)
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

export function bindEvents(
  { findByElement }: Adapter,
  { toggle, dismissAll, reposition, resize, hover, unhover }: Core
): void {
  document.addEventListener(
    'touchend',
    handleTap(findByElement, toggle, dismissAll)
  )
  document.addEventListener(
    'click',
    handleTap(findByElement, toggle, dismissAll)
  )
  document.addEventListener('keyup', handleEscape(dismissAll))
  document.addEventListener('gestureend', throttle(reposition))
  window.addEventListener('scroll', throttle(reposition))
  window.addEventListener('resize', throttle(resize))

  on('mouseover', `.${CLASS_BUTTON}`, handleHover(findByElement, hover))
  on('mouseout', `.${CLASS_BUTTON}`, handleHover(findByElement, unhover))
}
