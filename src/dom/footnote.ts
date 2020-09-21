import {
  getAvailableHeight,
  repositionPopover,
  repositionTooltip,
  getMaxHeight,
  getLeftInPixels,
} from './layout'
import { Footnote } from '../core'
import { addClass, removeClass, unmount } from './api'

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

const isMounted = (popover: HTMLElement) => !!popover.parentElement

export function createFootnote({
  id,
  button,
  content,
  host,
  popover,
  wrapper,
}: FootnoteElements): Footnote<HTMLElement> {
  let isHovered = false
  let maxHeight = 0

  return {
    id,

    activate: (onActivate) => {
      button.setAttribute('aria-expanded', 'true')
      addClass(button, CLASS_CHANGING)
      addClass(button, CLASS_ACTIVE)

      button.insertAdjacentElement('afterend', popover)

      popover.style.maxWidth = document.body.clientWidth + 'px'
      maxHeight = getMaxHeight(content)

      onActivate?.(popover, button)
    },

    dismiss: (onDismiss) => {
      button.setAttribute('aria-expanded', 'false')
      addClass(button, CLASS_CHANGING)
      removeClass(button, CLASS_ACTIVE)
      removeClass(popover, CLASS_ACTIVE)

      onDismiss?.(popover, button)
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
      if (isMounted(popover)) {
        content.style.maxHeight =
          getAvailableHeight(popover, button, maxHeight) + 'px'
        repositionPopover(popover, button)

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
      if (isMounted(popover)) {
        popover.style.left = getLeftInPixels(content, button) + 'px'
        wrapper.style.maxWidth = content.offsetWidth + 'px'
        repositionTooltip(popover, button)
      }
    },

    startHovering: () => {
      isHovered = true
    },

    stopHovering: () => {
      isHovered = false
    },

    destroy: () => unmount(host),
  }
}
