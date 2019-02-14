import template from 'lodash.template'
import { getMaxHeight, getStyle } from './dom'
import { bindContentScrollHandler } from './events'
import {
  getAvailableRoom,
  getPopoverMaxHeight,
  repositionPopover,
  repositionTooltip
} from './layout'
import {
  CLASS_ACTIVE,
  CLASS_BUTTON,
  CLASS_CHANGING,
  CLASS_FOOTNOTE,
  CLASS_HOVERED,
  FOOTNOTE_CONTENT,
  FOOTNOTE_ID,
  FOOTNOTE_MAX_HEIGHT,
  FOOTNOTE_NUMBER,
  CLASS_SCROLLABLE,
  CLASS_WRAPPER,
  CLASS_CONTENT
} from './constants'

const siblings = require('dom-siblings')

function maybeCall<A extends any[], R> (
  fn: null | ((...args: A) => R),
  context: any,
  ...args: A
): R | null {
  return typeof fn === 'function' ? fn.call(context, ...args) : null
}

function findOne (className: string, selector = ''): HTMLElement | null {
  return document.querySelector<HTMLElement>(`${selector}.${className}`)
}

function findAll (className: string, selector = ''): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`${selector}.${className}`)
  )
}

function findPopoverContent (popover: HTMLElement): HTMLElement | null {
  return popover.querySelector(`.${CLASS_CONTENT}`)
}

export const findClosestPopover = (element: Element) =>
  element.closest(`.${CLASS_FOOTNOTE}`)

export type Footnote = {
  getId: () => string | null
  activate: (
    contentTemplate: string,
    className: string,
    onActivate: null | ((popover: HTMLElement, button: HTMLElement) => void)
  ) => Footnote
  dismiss: () => void
  hover: () => void
  isActive: () => boolean
  isChanging: () => boolean
  ready: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
  startChanging: () => void
  stopChanging: () => void
}

type FootnoteElements = {
  button: HTMLElement
  popover: HTMLElement | null
}

function createFootnote ({
  button,
  popover = null
}: FootnoteElements): Footnote {
  return {
    getId: () => button.getAttribute(FOOTNOTE_ID),

    activate: (contentTemplate, className, onActivate) => {
      maybeCall(button.blur, button)
      button.setAttribute('aria-expanded', 'true')
      button.classList.add(CLASS_ACTIVE)

      const render = template(contentTemplate)
      button.insertAdjacentHTML(
        'afterend',
        render({
          content: button.getAttribute(FOOTNOTE_CONTENT),
          id: button.getAttribute(FOOTNOTE_ID),
          number: button.getAttribute(FOOTNOTE_NUMBER)
        })
      )

      const newPopover = button.nextElementSibling as HTMLElement
      const content = findPopoverContent(newPopover)

      if (content) {
        newPopover.setAttribute(FOOTNOTE_MAX_HEIGHT, `${getMaxHeight(content)}`)
        newPopover.style.maxWidth = `${document.body.clientWidth}px`
        bindContentScrollHandler(content)
      }

      if (className) {
        newPopover.classList.add(className)
      }

      maybeCall(onActivate, null, newPopover, button)
      return createFootnote({ button, popover: newPopover })
    },

    dismiss: () => {
      maybeCall(button.blur, button)
      button.setAttribute('aria-expanded', 'false')
      button.classList.remove(CLASS_ACTIVE)
      button.classList.remove(CLASS_HOVERED)
    },

    hover: () => {
      button.classList.add(CLASS_HOVERED)
    },

    isActive: () => button.classList.contains(CLASS_ACTIVE),

    isChanging: () => button.classList.contains(CLASS_CHANGING),

    ready: () => {
      if (popover) {
        popover.classList.add(CLASS_ACTIVE)
      }
    },

    remove: () => {
      if (popover) {
        popover.parentNode!.removeChild(popover)
      }
    },

    reposition: () => {
      const room = getAvailableRoom(button)
      const content = popover && findPopoverContent(popover)

      if (popover && content) {
        const maxHeight = getPopoverMaxHeight(popover, room)
        content.style.maxHeight = maxHeight + 'px'
        repositionPopover(popover, room)

        if (popover.offsetHeight <= content.scrollHeight) {
          popover.classList.add(CLASS_SCROLLABLE)
        }
      }
    },

    resize: () => {
      const room = getAvailableRoom(button)
      const content = popover && findPopoverContent(popover)

      if (popover && content) {
        const maxWidth = content.offsetWidth
        const buttonMarginLeft = parseInt(getStyle(button, 'marginLeft'), 10)
        const left =
          -room.leftRelative * maxWidth +
          buttonMarginLeft +
          button.offsetWidth / 2
        const wrapper = popover.querySelector<HTMLElement>(`.${CLASS_WRAPPER}`)

        popover.style.left = left + 'px'

        if (wrapper) {
          wrapper.style.maxWidth = maxWidth + 'px'
        }

        repositionTooltip(popover, room.leftRelative)
      }
    },

    startChanging: () => {
      button.classList.add(CLASS_CHANGING)
    },

    stopChanging: () => {
      button.classList.remove(CLASS_CHANGING)
    }
  }
}

export function findFootnote (selector: string): Footnote | null {
  const button = findOne(CLASS_BUTTON, selector)
  return button && createFootnote({ button, popover: null })
}

export function findAllFootnotes (selector: string): Footnote[] {
  return findAll(CLASS_BUTTON, selector).map(button =>
    createFootnote({ button, popover: null })
  )
}

function findMatching (className: string, element: Element): HTMLElement {
  return element && siblings(element, `.${className}`)[0]
}

export function forAllActiveFootnotes (
  fn: (footnote: Footnote) => void,
  selector = ''
): Footnote[] {
  return findAll(CLASS_FOOTNOTE, selector).map(popover => {
    const button = findMatching(CLASS_BUTTON, popover)
    const footnote = createFootnote({ button, popover })
    fn(footnote)
    return footnote
  })
}

export function forOtherActiveFootnotes (
  fn: (footnote: Footnote) => void,
  footnote: Footnote
): Footnote[] {
  return forAllActiveFootnotes(
    fn,
    `:not([${FOOTNOTE_ID}="${footnote.getId()}"])`
  )
}

export function findClosestFootnote (
  target: HTMLElement | null
): Footnote | null {
  const button = target && (target.closest(`.${CLASS_BUTTON}`) as HTMLElement)
  const popover = button && findMatching(CLASS_FOOTNOTE, button)
  return button && createFootnote({ button, popover })
}

export function hasHoveredFootnotes (): boolean {
  return !!document.querySelector(
    `.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`
  )
}
