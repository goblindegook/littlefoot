import { getStyle } from '@pacote/get-style'
import { pixels } from '@pacote/pixels'
import {
  getAvailableRoom,
  getAvailableHeight,
  repositionPopover,
  repositionTooltip,
  unmount,
} from './layout'
import { Footnote } from '../core'

const CLASS_ACTIVE = 'is-active'
const CLASS_CHANGING = 'is-changing'
const CLASS_SCROLLABLE = 'is-scrollable'

function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className)
}

function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className)
}

export type FootnoteElements = Readonly<{
  id: string
  host: HTMLElement
  button: HTMLElement
  popover: HTMLElement
  content: HTMLElement
  wrapper: HTMLElement
}>

export function createFootnote({
  id,
  button,
  content,
  host,
  popover,
  wrapper,
}: FootnoteElements): Footnote {
  let isHovered = false
  let maxHeight = 0

  return {
    id,

    activate: (onActivate) => {
      addClass(button, CLASS_CHANGING)
      button.setAttribute('aria-expanded', 'true')
      addClass(button, CLASS_ACTIVE)

      button.insertAdjacentElement('afterend', popover)

      popover.style.maxWidth = document.body.clientWidth + 'px'
      const contentMaxHeight = getStyle(content, 'maxHeight')
      maxHeight = Math.round(pixels(contentMaxHeight, content))

      if (typeof onActivate === 'function') {
        onActivate(popover, button)
      }
    },

    dismiss: (onDismiss) => {
      addClass(button, CLASS_CHANGING)
      button.setAttribute('aria-expanded', 'false')
      removeClass(button, CLASS_ACTIVE)
      removeClass(popover, CLASS_ACTIVE)
      if (typeof onDismiss === 'function') {
        onDismiss(popover, button)
      }
    },

    isActive: () => button.classList.contains(CLASS_ACTIVE),

    isReady: () => !button.classList.contains(CLASS_CHANGING),

    isHovered: () => isHovered,

    ready: () => {
      addClass(popover, CLASS_ACTIVE)
      removeClass(button, CLASS_CHANGING)
    },

    remove: () => {
      unmount(popover)
      removeClass(button, CLASS_CHANGING)
    },

    reposition: () => {
      if (popover.parentElement) {
        const room = getAvailableRoom(button)
        const minMaxHeight = Math.min(
          maxHeight,
          getAvailableHeight(popover, room)
        )
        content.style.maxHeight = minMaxHeight + 'px'
        repositionPopover(popover, room)

        if (popover.offsetHeight < content.scrollHeight) {
          addClass(popover, CLASS_SCROLLABLE)
          content.setAttribute('tabindex', '0')
        } else {
          removeClass(popover, CLASS_SCROLLABLE)
          content.removeAttribute('tabindex')
        }
      }
    },

    resize: () => {
      if (popover.parentElement) {
        const room = getAvailableRoom(button)
        const maxWidth = content.offsetWidth
        const buttonMarginLeft = parseInt(getStyle(button, 'marginLeft'), 10)
        const left =
          -room.leftRelative * maxWidth +
          buttonMarginLeft +
          button.offsetWidth / 2

        popover.style.left = left + 'px'
        wrapper.style.maxWidth = maxWidth + 'px'

        repositionTooltip(popover, room.leftRelative)
      }
    },

    startHovering: () => {
      isHovered = true
    },

    stopHovering: () => {
      isHovered = false
    },

    destroy: () => {
      unmount(host)
    },
  }
}
