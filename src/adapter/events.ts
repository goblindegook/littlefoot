import throttle from 'lodash.throttle'
import {
  findClosestFootnote,
  findClosestPopover,
  forAllActiveFootnotes
} from './footnotes'
import { CLASS_BUTTON, CLASS_FULLY_SCROLLED, CLASS_HOVERED } from './constants'
import { Cancelable } from 'lodash'
import { Core } from '../core'

const delegate = require('dom-delegate')

type FootnoteAction = (footnote?: any, popover?: any) => void
type EventHandler<E extends Event> = (e: E) => void

function handle(fn: FootnoteAction, hover = false): EventHandler<Event> {
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

function delegateEvent<K extends keyof WindowEventMap>(
  type: K,
  root: Document | Element,
  selector: string,
  listener: EventListener
) {
  delegate(root).on(type, selector, listener)
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

  delegateEvent('mouseover', document, `.${CLASS_BUTTON}`, handle(hover, true))
  delegateEvent('mouseout', document, `.${CLASS_BUTTON}`, handle(unhover, true))
}
