import { Settings } from './settings'
import { Footnote, Adapter } from './types'

export type ActivateFootnote = (footnote: Footnote) => void
type DismissFootnote = (footnote: Footnote, delay?: number) => void

export type Core = {
  activate: ActivateFootnote
  dismiss: DismissFootnote
  dismissAll: () => void
  hover: ActivateFootnote
  reposition: () => void
  resize: () => void
  toggle: ActivateFootnote
  unhover: () => void
}

function createActivate(
  adapter: Adapter,
  settings: Settings
): ActivateFootnote {
  return footnote => {
    const { activateCallback, activateDelay, contentTemplate } = settings

    if (!footnote.isChanging()) {
      footnote.startChanging()

      const activated = footnote.activate(contentTemplate, activateCallback)

      adapter.forAllActiveFootnotes(fn => {
        fn.reposition()
        fn.resize()
      })

      setTimeout(() => {
        // FIXME: reposition and resize here?
        activated.ready()
        activated.stopChanging()
      }, activateDelay)
    }
  }
}

function createDismiss(settings: Settings): DismissFootnote {
  return (footnote, delay = settings.dismissDelay) => {
    if (!footnote.isChanging()) {
      footnote.startChanging()
      footnote.dismiss()

      setTimeout(() => {
        footnote.remove()
        footnote.stopChanging()
      }, delay)
    }
  }
}

export function createCore(adapter: Adapter, settings: Settings): Core {
  const activate = createActivate(adapter, settings)
  const dismiss = createDismiss(settings)

  return {
    activate,

    dismiss,

    dismissAll() {
      adapter.forAllActiveFootnotes(dismiss)
    },

    reposition() {
      adapter.forAllActiveFootnotes(footnote => footnote.reposition())
    },

    resize() {
      adapter.forAllActiveFootnotes(footnote => footnote.resize())
    },

    toggle(footnote) {
      const { allowMultiple } = settings
      if (footnote.isActive()) {
        dismiss(footnote)
      } else {
        if (!allowMultiple) {
          adapter.forOtherActiveFootnotes(dismiss, footnote)
        }
        activate(footnote)
      }
    },

    hover(footnote) {
      const { activateOnHover, allowMultiple } = settings
      if (activateOnHover && !footnote.isActive()) {
        if (!allowMultiple) {
          adapter.forOtherActiveFootnotes(dismiss, footnote)
        }
        activate(footnote)
        footnote.hover()
      }
    },

    unhover() {
      const { dismissOnUnhover, hoverDelay } = settings
      if (dismissOnUnhover) {
        setTimeout(() => {
          if (!adapter.hasHoveredFootnotes()) {
            adapter.forAllActiveFootnotes(dismiss)
          }
        }, hoverDelay)
      }
    }
  }
}
