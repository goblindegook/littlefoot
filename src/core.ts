import { Footnote, Adapter, Settings } from './types'

export type FootnoteAction = (footnote: Footnote, delay?: number) => void

export type Core = Readonly<{
  activate: FootnoteAction
  dismiss: FootnoteAction
  dismissAll: (delay?: number) => void
  get: (id: string) => Footnote | undefined
  hover: FootnoteAction
  reposition: () => void
  resize: () => void
  toggle: FootnoteAction
  unhover: FootnoteAction
}>

function createActivate(adapter: Adapter, settings: Settings): FootnoteAction {
  return (footnote, delay = settings.activateDelay) => {
    const { activateCallback, contentTemplate } = settings

    if (!footnote.isChanging()) {
      footnote.startChanging()

      footnote.activate(contentTemplate, activateCallback)

      adapter.forEachFootnote(current => {
        current.reposition()
        current.resize()
      })

      setTimeout(() => {
        // FIXME: reposition and resize here?
        footnote.ready()
        footnote.stopChanging()
      }, delay)
    }
  }
}

function createDismiss(settings: Settings): FootnoteAction {
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
    get: adapter.findFootnote,

    activate,

    dismiss,

    dismissAll(delay = settings.dismissDelay) {
      adapter.forEachFootnote(current => dismiss(current, delay))
    },

    reposition() {
      adapter.forEachFootnote(current => current.reposition())
    },

    resize() {
      adapter.forEachFootnote(current => current.resize())
    },

    toggle(footnote) {
      const { allowMultiple } = settings
      if (footnote.isActive()) {
        dismiss(footnote)
      } else {
        if (!allowMultiple) {
          adapter.forEachFootnoteExcept(dismiss, footnote)
        }
        activate(footnote)
      }
    },

    hover(footnote, delay = settings.hoverDelay) {
      const { activateOnHover, allowMultiple } = settings
      footnote.startHovering()
      if (activateOnHover && !footnote.isActive()) {
        if (!allowMultiple) {
          adapter.forEachFootnoteExcept(dismiss, footnote)
        }
        activate(footnote, delay)
      }
    },

    unhover(footnote, delay = settings.hoverDelay) {
      const { dismissOnUnhover } = settings
      footnote.stopHovering()
      if (dismissOnUnhover) {
        setTimeout(() => {
          if (!adapter.hasHoveredFootnotes()) {
            adapter.forEachFootnote(dismiss)
          }
        }, delay)
      }
    }
  }
}
