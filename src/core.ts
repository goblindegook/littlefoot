import { Footnote, Settings } from './types'

export type Adapter = Readonly<{
  footnotes: () => readonly Footnote[]
  unmount: () => void
}>

export type FootnoteAction = (footnote: Footnote, delay?: number) => void

export type Core = Readonly<{
  activate: FootnoteAction
  dismiss: FootnoteAction
  dismissAll: (delay?: number) => void
  findById: (id: string) => Footnote | undefined
  hover: FootnoteAction
  repositionAll: () => void
  resizeAll: () => void
  toggle: FootnoteAction
  unhover: FootnoteAction
  unmount: () => void
}>

function createActivate(adapter: Adapter, settings: Settings): FootnoteAction {
  return (footnote, delay = settings.activateDelay) => {
    const { activateCallback } = settings

    if (!footnote.isChanging()) {
      footnote.startChanging()

      footnote.activate(activateCallback)

      adapter.footnotes().forEach(current => {
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
    activate,

    dismiss,

    findById: id =>
      adapter.footnotes().find(footnote => footnote.getId() === id),

    unmount: adapter.unmount,

    dismissAll(delay = settings.dismissDelay) {
      adapter.footnotes().forEach(current => dismiss(current, delay))
    },

    repositionAll() {
      adapter.footnotes().forEach(current => current.reposition())
    },

    resizeAll() {
      adapter.footnotes().forEach(current => current.resize())
    },

    toggle(footnote) {
      const { allowMultiple } = settings
      if (footnote.isActive()) {
        dismiss(footnote)
      } else {
        if (!allowMultiple) {
          adapter
            .footnotes()
            .filter(current => current.getId() !== footnote.getId())
            .forEach(dismiss)
        }
        activate(footnote)
      }
    },

    hover(footnote, delay = settings.hoverDelay) {
      const { activateOnHover, allowMultiple } = settings
      footnote.startHovering()
      if (activateOnHover && !footnote.isActive()) {
        if (!allowMultiple) {
          adapter
            .footnotes()
            .filter(current => current.getId() !== footnote.getId())
            .forEach(dismiss)
        }
        activate(footnote, delay)
      }
    },

    unhover(footnote, delay = settings.hoverDelay) {
      const { dismissOnUnhover } = settings
      footnote.stopHovering()
      if (dismissOnUnhover) {
        setTimeout(() => {
          if (!adapter.footnotes().some(f => f.isHovered())) {
            adapter.footnotes().forEach(dismiss)
          }
        }, delay)
      }
    }
  }
}
