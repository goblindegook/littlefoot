import template from 'lodash.template'
import { getMaxHeight, getStyle, findSibling } from './dom'
import { bindContentScrollHandler } from './events'
import {
  getAvailableRoom,
  getPopoverMaxHeight,
  repositionPopover,
  repositionTooltip
} from './layout'
import {
  CLASS_ACTIVE,
  CLASS_CHANGING,
  CLASS_HOVERED,
  FOOTNOTE_CONTENT,
  FOOTNOTE_ID,
  FOOTNOTE_MAX_HEIGHT,
  FOOTNOTE_NUMBER,
  CLASS_SCROLLABLE,
  CLASS_WRAPPER,
  CLASS_CONTENT,
  CLASS_FOOTNOTE,
  CLASS_BUTTON
} from './constants'
import { Footnote } from '../types'

function findPopoverContent(popover: HTMLElement): HTMLElement {
  return popover.querySelector<HTMLElement>(`.${CLASS_CONTENT}`)!
}

function insertPopover(button: HTMLElement, contentTemplate: string) {
  const render = template(contentTemplate)
  button.insertAdjacentHTML(
    'afterend',
    render({
      content: button.getAttribute(FOOTNOTE_CONTENT),
      id: button.getAttribute(FOOTNOTE_ID),
      number: button.getAttribute(FOOTNOTE_NUMBER)
    })
  )
  const popover = button.nextElementSibling as HTMLElement
  const content = findPopoverContent(popover)
  popover.setAttribute(FOOTNOTE_MAX_HEIGHT, `${getMaxHeight(content)}`)
  popover.style.maxWidth = `${document.body.clientWidth}px`
  bindContentScrollHandler(content)
  return popover
}

export function footnoteFromButton(button: HTMLElement): Footnote {
  const popover = findSibling(button, `.${CLASS_FOOTNOTE}`)
  return createFootnote(button, popover)
}

export function footnoteFromPopover(popover: HTMLElement): Footnote {
  const button = findSibling(popover, `.${CLASS_BUTTON}`)!
  return createFootnote(button, popover)
}

function createFootnote(button: HTMLElement, popover?: HTMLElement): Footnote {
  return {
    getId: () => button.getAttribute(FOOTNOTE_ID),

    activate: (contentTemplate, onActivate) => {
      button.blur()
      button.setAttribute('aria-expanded', 'true')
      button.classList.add(CLASS_ACTIVE)

      const newPopover = insertPopover(button, contentTemplate)

      if (typeof onActivate === 'function') {
        onActivate(newPopover, button)
      }

      return createFootnote(button, newPopover)
    },

    dismiss: () => {
      button.blur()
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

      if (popover) {
        const content = findPopoverContent(popover)
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
