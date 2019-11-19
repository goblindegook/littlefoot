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
  isReady: () => boolean
  isHovered: () => boolean
  destroy: () => void
}>

export type FootnoteLookup = (id: string) => Footnote | undefined
export type FootnoteAction = (footnote: Footnote) => void

export type CoreDriver = Readonly<{
  lookup: FootnoteLookup
  activate: (
    footnote: Footnote,
    delay: number,
    onActivate?: (popover: HTMLElement, button: HTMLElement) => void
  ) => void
  dismiss: (footnote: Footnote, delay: number) => void
  hover: FootnoteAction
  toggle: FootnoteAction
  unhover: FootnoteAction
  dismissAll: () => void // FIXME: Remove?
  repositionAll: () => void // FIXME: Remove?
  resizeAll: () => void // FIXME: Remove?
}>

export type Core = CoreDriver &
  Readonly<{
    unmount: () => void
  }>

interface Adapter {
  setup: (settings: Settings) => Footnote[]
  addListeners: (core: CoreDriver) => () => void
  cleanup: (footnotes: Footnote[]) => void
}

function activate(
  footnote: Footnote,
  delay: number,
  callback?: (popover: HTMLElement, button: HTMLElement) => void
): void {
  if (footnote.isReady()) {
    footnote.activate(callback)
    footnote.reposition()
    footnote.resize()

    setTimeout(() => {
      footnote.ready()
    }, delay)
  }
}

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

  function dismissOthers(footnote: Footnote, delay: number): void {
    footnotes
      .filter(current => current.id !== footnote.id)
      .forEach(footnote => dismiss(footnote, delay))
  }

  const core: CoreDriver = {
    activate, // FIXME: Does not dismiss others when allowMultiple = false

    dismiss,

    lookup: id => footnotes.find(footnote => footnote.id === id),

    dismissAll() {
      footnotes.forEach(current => dismiss(current, settings.dismissDelay))
    },

    repositionAll() {
      footnotes.forEach(current => current.reposition())
    },

    resizeAll() {
      footnotes.forEach(current => current.resize())
    },

    toggle(footnote) {
      const { allowMultiple, dismissDelay } = settings
      if (footnote.isActive()) {
        dismiss(footnote, dismissDelay)
      } else {
        if (!allowMultiple) {
          dismissOthers(footnote, dismissDelay)
        }
        activate(footnote, settings.activateDelay, settings.activateCallback)
      }
    },

    hover(footnote) {
      const {
        activateOnHover,
        allowMultiple,
        dismissDelay,
        hoverDelay
      } = settings
      footnote.startHovering()
      if (activateOnHover && !footnote.isActive()) {
        if (!allowMultiple) {
          dismissOthers(footnote, dismissDelay)
        }
        activate(footnote, hoverDelay)
      }
    },

    unhover(footnote) {
      const { dismissOnUnhover, dismissDelay, hoverDelay } = settings
      footnote.stopHovering()
      if (dismissOnUnhover) {
        setTimeout(() => {
          if (!footnotes.some(f => f.isHovered())) {
            footnotes.forEach(f => dismiss(f, dismissDelay))
          }
        }, hoverDelay)
      }
    }
  }

  const removeListeners = adapter.addListeners(core)

  return {
    ...core,
    unmount() {
      removeListeners()
      adapter.cleanup(footnotes)
    }
  }
}
