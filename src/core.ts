import { Settings } from './settings'

export type Footnote = Readonly<{
  id: string
  activate: (
    onActivate?: (popover: HTMLElement, button: HTMLElement) => void
  ) => void
  ready: () => void
  dismiss: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
  startHovering: () => void
  stopHovering: () => void
  isActive: () => boolean
  isChanging: () => boolean
  isHovered: () => boolean
  destroy: () => void
}>

export type FootnoteAction = (footnote: Footnote, delay?: number) => void

export type Core = Readonly<{
  findById: (id: string) => Footnote | undefined
  activate: FootnoteAction
  dismiss: FootnoteAction
  hover: FootnoteAction
  toggle: FootnoteAction
  unhover: FootnoteAction
  dismissAll: (delay?: number) => void // FIXME: Remove?
  repositionAll: () => void // FIXME: Remove?
  resizeAll: () => void // FIXME: Remove?
  unmount: () => void
}>

interface Adapter {
  setup: (settings: Settings) => Footnote[]
  addListeners: (core: Core) => () => void
  cleanup: () => void
}

function createActivate(settings: Settings): FootnoteAction {
  return (footnote, delay = settings.activateDelay) => {
    const { activateCallback } = settings

    if (!footnote.isChanging()) {
      footnote.activate(activateCallback)
      footnote.reposition()
      footnote.resize()

      setTimeout(() => {
        footnote.ready()
      }, delay)
    }
  }
}

function createDismiss(settings: Settings): FootnoteAction {
  return (footnote, delay = settings.dismissDelay) => {
    if (!footnote.isChanging()) {
      footnote.dismiss()

      setTimeout(() => {
        footnote.remove()
      }, delay)
    }
  }
}

export function createCore(adapter: Adapter, settings: Settings): Core {
  const footnotes = adapter.setup(settings)
  const activate = createActivate(settings)
  const dismiss = createDismiss(settings)

  function dismissOthers(footnote: Footnote): void {
    footnotes.filter(current => current.id !== footnote.id).forEach(dismiss)
  }

  const core: Core = {
    activate, // FIXME: Does not dismiss others when allowMultiple = false

    dismiss,

    findById: id => footnotes.find(footnote => footnote.id === id),

    unmount() {},

    dismissAll(delay = settings.dismissDelay) {
      footnotes.forEach(current => dismiss(current, delay))
    },

    repositionAll() {
      footnotes.forEach(current => current.reposition())
    },

    resizeAll() {
      footnotes.forEach(current => current.resize())
    },

    toggle(footnote) {
      const { allowMultiple } = settings
      if (footnote.isActive()) {
        dismiss(footnote)
      } else {
        if (!allowMultiple) {
          dismissOthers(footnote)
        }
        activate(footnote)
      }
    },

    hover(footnote, delay = settings.hoverDelay) {
      const { activateOnHover, allowMultiple } = settings
      footnote.startHovering()
      if (activateOnHover && !footnote.isActive()) {
        if (!allowMultiple) {
          dismissOthers(footnote)
        }
        activate(footnote, delay)
      }
    },

    unhover(footnote, delay = settings.hoverDelay) {
      const { dismissOnUnhover } = settings
      footnote.stopHovering()
      if (dismissOnUnhover) {
        setTimeout(() => {
          if (!footnotes.some(f => f.isHovered())) {
            footnotes.forEach(dismiss)
          }
        }, delay)
      }
    }
  }

  const removeListeners = adapter.addListeners(core)

  return {
    ...core,
    unmount() {
      removeListeners()
      footnotes.forEach(footnote => footnote.destroy())
      adapter.cleanup()
    }
  }
}
