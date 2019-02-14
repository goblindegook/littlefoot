import { Settings } from './settings'
import { Footnote } from './adapter/footnotes'
import { DOMAdapter } from './adapter'

export type Core = {
  activate: (footnote: Footnote, className?: string) => void
  dismiss: (footnote: Footnote, delay?: number) => void
  reposition: () => void
  resize: () => void
  toggle: (footnote: Footnote, popover: HTMLElement | null) => void
  hover: (footnote: Footnote) => void
  unhover: () => void
}

function createActivate(adapter: DOMAdapter, settings: Settings) {
  return (footnote: Footnote, className: string = '') => {
    const { activateCallback, activateDelay, contentTemplate } = settings

    if (!footnote.isChanging()) {
      footnote.startChanging()

      const activated = footnote.activate(
        contentTemplate,
        className,
        activateCallback
      )

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

function createDismiss(settings: Settings) {
  return (footnote: Footnote, delay = settings.dismissDelay) => {
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

export function createCore(adapter: DOMAdapter, settings: Settings): Core {
  const activate = createActivate(adapter, settings)
  const dismiss = createDismiss(settings)

  return {
    activate,

    dismiss,

    reposition() {
      adapter.forAllActiveFootnotes(footnote => footnote.reposition())
    },

    resize() {
      adapter.forAllActiveFootnotes(footnote => footnote.resize())
    },

    toggle(footnote, popover) {
      const { allowMultiple } = settings
      if (footnote) {
        if (footnote.isActive()) {
          dismiss(footnote)
        } else {
          if (!allowMultiple) {
            adapter.forOtherActiveFootnotes(dismiss, footnote)
          }
          activate(footnote)
        }
      } else if (!popover) {
        adapter.forAllActiveFootnotes(dismiss)
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
