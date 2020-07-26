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
      button.classList.add(CLASS_CHANGING)
      button.setAttribute('aria-expanded', 'true')
      button.classList.add(CLASS_ACTIVE)

      button.insertAdjacentElement('afterend', popover)

      popover.style.maxWidth = document.body.clientWidth + 'px'
      const contentMaxHeight = getStyle(content, 'maxHeight')
      maxHeight = Math.round(pixels(contentMaxHeight, content))

      if (typeof onActivate === 'function') {
        onActivate(popover, button)
      }
    },

    dismiss: (onDeactivate) => {
      button.classList.add(CLASS_CHANGING)
      button.setAttribute('aria-expanded', 'false')
      button.classList.remove(CLASS_ACTIVE)
      if (typeof onDeactivate === 'function') {
        onDeactivate(popover)
      }
    },

    isActive: () => button.classList.contains(CLASS_ACTIVE),

    isReady: () => !button.classList.contains(CLASS_CHANGING),

    isHovered: () => isHovered,

    ready: () => {
      popover.classList.add(CLASS_ACTIVE)
      button.classList.remove(CLASS_CHANGING)
    },

    remove: () => {
      unmount(popover)
      button.classList.remove(CLASS_CHANGING)
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
          popover.classList.add(CLASS_SCROLLABLE)
          content.setAttribute('tabindex', '0')
        } else {
          popover.classList.remove(CLASS_SCROLLABLE)
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
