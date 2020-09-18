interface ActionCallback<T> {
  (popover: T, button: T): void
}

export type CoreSettings<T> = Readonly<{
  activateCallback?: ActionCallback<T>
  dismissCallback?: ActionCallback<T>
  activateDelay: number
  activateOnHover: boolean
  allowMultiple: boolean
  dismissDelay: number
  dismissOnUnhover: boolean
  hoverDelay: number
}>

export type Footnote<T> = Readonly<{
  id: string
  activate: (onActivate?: ActionCallback<T>) => void
  ready: () => void
  dismiss: (onDeactivate?: ActionCallback<T>) => void
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

export type FootnoteAction = (id: string) => void
type DelayedFootnoteAction = (footnote: string, delay: number) => void

export type Core = Readonly<{
  activate: DelayedFootnoteAction
  dismiss: DelayedFootnoteAction
  hover: FootnoteAction
  toggle: FootnoteAction
  unhover: FootnoteAction
  dismissAll: () => void
  repositionAll: () => void
  resizeAll: () => void
  unmount: () => void
}>

export interface Adapter<T> {
  readonly footnotes: Footnote<T>[]
  readonly cleanup: (footnotes: Footnote<T>[]) => void
}

export function createCore<T>(
  adapter: Adapter<T>,
  settings: CoreSettings<T>
): Core {
  const dismiss = (delay: number) => (footnote: Footnote<T>) => {
    if (footnote.isReady()) {
      footnote.dismiss(settings.dismissCallback)

      setTimeout(() => {
        footnote.remove()
      }, delay)
    }
  }

  const activate = (delay: number) => (footnote: Footnote<T>) => {
    if (!settings.allowMultiple) {
      adapter.footnotes
        .filter((current) => current.id !== footnote.id)
        .forEach(dismiss(settings.dismissDelay))
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

  const action = (fn: (footnote: Footnote<T>) => void) => (id: string) => {
    const footnote = adapter.footnotes.find((footnote) => footnote.id === id)
    if (footnote) {
      fn(footnote)
    }
  }

  return {
    activate(id, delay) {
      action(activate(delay))(id)
    },

    dismiss(id, delay) {
      action(dismiss(delay))(id)
    },

    dismissAll() {
      adapter.footnotes.forEach(dismiss(settings.dismissDelay))
    },

    repositionAll() {
      adapter.footnotes.forEach((current) => current.reposition())
    },

    resizeAll() {
      adapter.footnotes.forEach((current) => current.resize())
    },

    toggle: action((footnote) =>
      footnote.isActive()
        ? dismiss(settings.dismissDelay)(footnote)
        : activate(settings.activateDelay)(footnote)
    ),

    hover: action((footnote) => {
      footnote.startHovering()
      if (settings.activateOnHover && !footnote.isActive()) {
        activate(settings.hoverDelay)(footnote)
      }
    }),

    unhover: action((footnote) => {
      footnote.stopHovering()
      if (settings.dismissOnUnhover) {
        setTimeout(() => {
          adapter.footnotes
            .filter((f) => !f.isHovered())
            .forEach(dismiss(settings.dismissDelay))
        }, settings.hoverDelay)
      }
    }),

    unmount() {
      adapter.cleanup(adapter.footnotes)
    },
  }
}
