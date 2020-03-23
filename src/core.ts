import { Settings, ActivateCallback } from './settings'

export type Footnote = Readonly<{
  id: string
  activate: (onActivate?: ActivateCallback) => void
  ready: () => void
  dismiss: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
  startHovering: () => void
  stopHovering: () => void
  isActive: () => boolean
  isReady: () => boolean
  isHovered: () => boolean
  destroy: () => void
}>

export type FootnoteLookup = (id: string) => Footnote | undefined
export type FootnoteAction = (footnote: Footnote) => void
export type DelayedFootnoteAction = (footnote: Footnote, delay: number) => void

export type CoreDriver = Readonly<{
  lookup: FootnoteLookup
  activate: DelayedFootnoteAction
  dismiss: DelayedFootnoteAction
  hover: FootnoteAction
  toggle: FootnoteAction
  unhover: FootnoteAction
  dismissAll: () => void
  repositionAll: () => void
  resizeAll: () => void
}>

export type Core = CoreDriver &
  Readonly<{
    unmount: () => void
  }>

export type Adapter = Readonly<{
  setup: (settings: Settings) => Footnote[]
  addListeners: (core: CoreDriver) => () => void
  cleanup: (footnotes: Footnote[]) => void
}>

function dismiss(footnote: Footnote, delay: number): void {
  if (footnote.isReady()) {
    footnote.dismiss()

    setTimeout(() => {
      footnote.remove()
    }, delay)
  }
}

export function createCore(adapter: Adapter, settings: Settings): Core {
  const footnotes = adapter.setup(settings)

  function activate(footnote: Footnote, delay: number): void {
    if (!settings.allowMultiple) {
      footnotes
        .filter((current) => current.id !== footnote.id)
        .forEach((footnote) => dismiss(footnote, settings.dismissDelay))
    }

    if (footnote.isReady()) {
      footnote.activate(settings.activateCallback)
      footnote.reposition()
      footnote.resize()

      setTimeout(() => {
        footnote.ready()
      }, delay)
    }
  }

  const core: CoreDriver = {
    activate,

    dismiss,

    lookup: (id) => footnotes.find((footnote) => footnote.id === id),

    dismissAll() {
      footnotes.forEach((current) => dismiss(current, settings.dismissDelay))
    },

    repositionAll() {
      footnotes.forEach((current) => current.reposition())
    },

    resizeAll() {
      footnotes.forEach((current) => current.resize())
    },

    toggle(footnote) {
      if (footnote.isActive()) {
        dismiss(footnote, settings.dismissDelay)
      } else {
        activate(footnote, settings.activateDelay)
      }
    },

    hover(footnote) {
      footnote.startHovering()
      if (settings.activateOnHover && !footnote.isActive()) {
        activate(footnote, settings.hoverDelay)
      }
    },

    unhover(footnote) {
      footnote.stopHovering()
      if (settings.dismissOnUnhover) {
        setTimeout(() => {
          footnotes
            .filter((f) => !f.isHovered())
            .forEach((f) => dismiss(f, settings.dismissDelay))
        }, settings.hoverDelay)
      }
    },
  }

  const removeListeners = adapter.addListeners(core)

  return {
    ...core,
    unmount() {
      removeListeners()
      adapter.cleanup(footnotes)
    },
  }
}
